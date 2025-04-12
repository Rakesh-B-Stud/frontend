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
    .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>'); // wrap list items in ul
}

// Handle sending messages and chatbot response
document.addEventListener('DOMContentLoaded', function () {
  const sendButton = document.querySelector('.chat-input button');
  const inputField = document.querySelector('.chat-input input');
  const chatContent = document.getElementById('chatContent');

  // Restore chat from sessionStorage
  const savedChat = sessionStorage.getItem('chatHistory');
  if (savedChat) {
    chatContent.innerHTML = savedChat;
    chatContent.scrollTop = chatContent.scrollHeight;
  }

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
    sessionStorage.setItem('chatHistory', chatContent.innerHTML);

    inputField.value = "";

    const botMsg = document.createElement("div");
    botMsg.className = "chat-bubble bot";
    botMsg.id = "bot-typing";
    botMsg.innerHTML = `<div class="bubble-content"><em>Bot is typing...</em></div>`;
    chatContent.appendChild(botMsg);
    chatContent.scrollTop = chatContent.scrollHeight;
    sessionStorage.setItem('chatHistory', chatContent.innerHTML);
    
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
      });
  }
});

document.getElementById("userInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const userMessage = this.value.trim();
    if (!userMessage) return;

    // Save message to sessionStorage or URL param
    localStorage.setItem("lastUserMessage", userMessage);

    // Open the new tab with a different HTML page
    window.open("response.html", "_blank");

    this.value = ""; // clear input
  }
});

const chatWrapper = document.getElementById('chatWrapper');
const openChatBtn = document.getElementById('openChatBtn');

openChatBtn.addEventListener('click', () => {
  chatWrapper.style.display = 'block';
});

document.addEventListener('click', function(event) {
  const isClickInside = chatWrapper.contains(event.target) || openChatBtn.contains(event.target);
  if (!isClickInside) {
    chatWrapper.style.display = 'none';
  }
});

// Toggle Menu Display
function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Close menu when clicking outside
document.addEventListener('click', function (event) {
  const menu = document.getElementById('dropdownMenu');
  const button = document.querySelector('.menu-btn');

  if (!menu.contains(event.target) && !button.contains(event.target)) {
    menu.style.display = 'none';
  }
});
