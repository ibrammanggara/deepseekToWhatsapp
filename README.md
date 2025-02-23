# deepseekToWhatsapp
---

## install in ubuntu

---

```
sudo apt update
sudo apt install -y libatk1.0-0 libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libxrandr2 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgbm1
```
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

\. "$HOME/.nvm/nvm.sh"

nvm install 23
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

requires ollama api and running deepseek-r1 models

https://ollama.com/library/deepseek-r1

### edit in index.js 
```
const response = await axios.post(
            "http://localhost:11434/api/chat", // edit this url api
            {
                model: "deepseek-r1:1.5b",
                messages: conversationHistory[userId],
            },
            {
                responseType: "stream",
            }
        );
```

---

## reference
https://www.youtube.com/watch?v=HVQlrlqchI0

https://github.com/danielcarneirotech/deepseek-whatsapp-bot

thanks
