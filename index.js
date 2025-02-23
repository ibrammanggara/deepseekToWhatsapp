const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");

// Object to store conversation history
const conversationHistory = {};

// Function to process messages using Ollama with history
async function processMessage(text, userId) {
    try {
        // Initialize the user's history if it doesn't exist
        if (!conversationHistory[userId]) {
            conversationHistory[userId] = [];
        }

        // Add the user's message to the history
        conversationHistory[userId].push({ role: "user", content: text });

        // Limit the history to the last 10 interactions
        if (conversationHistory[userId].length > 10) {
            conversationHistory[userId].shift();
        }

        // Send the request to Ollama
        const response = await axios.post(
            "https://api.mel-on.tech/api/chat",
            {
                model: "deepseek-r1:1.5b", // Model yang digunakan
                messages: conversationHistory[userId], // Kirim riwayat percakapan
            },
            {
                responseType: "stream", // Tangani respons streaming
            }
        );

        let fullResponse = "";
        let buffer = "";

        // Tangani respons streaming
        for await (const chunk of response.data) {
            buffer += chunk.toString(); // Tambahkan chunk ke buffer

            // Pisahkan buffer berdasarkan newline untuk mendapatkan JSON yang lengkap
            const lines = buffer.split("\n");
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (line) {
                    try {
                        const chunkData = JSON.parse(line);

                        // Tambahkan konten ke respons penuh
                        if (chunkData.message && chunkData.message.content) {
                            fullResponse += chunkData.message.content;
                        }

                        // Jika respons selesai, keluar dari loop
                        if (chunkData.done) {
                            break;
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                        console.log("Received line:", line);
                    }
                }
            }

            // Simpan sisa buffer yang belum diproses
            buffer = lines[lines.length - 1];
        }

        // Hapus tag <think>...</think> jika ada
        fullResponse = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

        // Tambahkan respons AI ke riwayat percakapan
        conversationHistory[userId].push({ role: "assistant", content: fullResponse });

        console.log(`Generated response for CLIENT: ${fullResponse}`);
        console.log("***************************************");
        return fullResponse;
    } catch (error) {
        console.error("Error processing message:", error);
        return "Sorry, I couldn't process your message.";
    }
}

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(), // Save the session locally
                          puppeteer: {
                              executablePath: "/usr/bin/chromium-browser", // Path ke Chromium
                              args: ["--no-sandbox", "--disable-setuid-sandbox"], // Opsi untuk menjalankan sebagai root
                          },
});

// Generate the QR Code in the terminal
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

// When ready, display a message
client.on("ready", () => {
    console.log("Client is ready!");
    console.log("---------------------------------------------");
});

// Listen for received messages
client.on("message", async (message) => {
    // Ignore messages from "status" updates
    if (message.from.includes("status")) {
        return;
    }
    console.log(`Message received from CLIENT: ${message.body}`);
    console.log("---------------------------------------------");

    // Process the message with Ollama using the history
    const response = await processMessage(message.body, message.from);

    // Reply to the message on WhatsApp
    message.reply(response);
});

// Initialize the client
client.initialize();
