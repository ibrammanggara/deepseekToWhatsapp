# deepseekToWhatsapp
---

## install in ubuntu

---

```
sudo apt update
sudo apt install -y libatk1.0-0 libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libxrandr2 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgbm1
```

---

## install required

```
npm i
```

---

## run command

```
node index.js
```

# Note

---

requires ollama api and running deepseek-r1 models on hardware with GPU for powerful ai commands

https://ollama.com/library/deepseek-r1

### edit in index.js 
```
const response = await axios.post(
            "https://api.mel-on.tech/api/chat", # edit this api
            {
                model: "deepseek-r1:1.5b", // Model yang digunakan
                messages: conversationHistory[userId], // Kirim riwayat percakapan
            },
            {
                responseType: "stream", // Tangani respons streaming
            }
        );
```

---

## reference
https://www.youtube.com/watch?v=HVQlrlqchI0

https://github.com/danielcarneirotech/deepseek-whatsapp-bot

thanks

--
