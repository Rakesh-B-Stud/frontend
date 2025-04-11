// Toggle Chat Display
function toggleChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
}

// Format bot message by replacing markdown
function formatBotMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/^\* (.*)$/gm, '<li>$1</li>') // bullet points
    .replace(/<li>.*<\/li>/g, match => `<ul>${match}</ul>`); // wrap list items in ul if any
}

// Handle sending messages and chatbot response
document.addEventListener('DOMContentLoaded', function () {
  const sendButton = document.querySelector('.chat-input button');
  const inputField = document.querySelector('.chat-input input');
  const chatContent = document.getElementById('chatContent');

  sendButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const message = inputField.value.trim();
    if (message === "") return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg = document.createElement("div");
    userMsg.className = "chat-bubble user";
    userMsg.innerHTML = `<div class="bubble-content"><strong>You</strong> <span class="timestamp">${timestamp}</span><div class="text">${message}</div></div>`;
    chatContent.appendChild(userMsg);
    chatContent.scrollTop = chatContent.scrollHeight;

    inputField.value = "";

    const botMsg = document.createElement("div");
    botMsg.className = "chat-bubble bot";
    botMsg.id = "bot-typing";
    botMsg.innerHTML = `<div class="bubble-content"><em>Bot is typing...</em></div>`;
    chatContent.appendChild(botMsg);
    chatContent.scrollTop = chatContent.scrollHeight;

    fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formatted = formatBotMessage(data.reply);
        botMsg.innerHTML = `<div class="bubble-content"><strong>Bot</strong> <span class="timestamp">${time}</span><div class="text">${formatted}</div></div>`;
        chatContent.scrollTop = chatContent.scrollHeight;
      })
      .catch(err => {
        botMsg.innerHTML = "<div class='bubble-content error'>⚠️ Error: Could not fetch response.</div>";
      });
  }
});
