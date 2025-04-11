// Toggle Chat Display
function toggleChat() {
  const chatBox = document.getElementById("chatBox");
  chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
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

    // Add user message to chat box
    const userMsg = document.createElement('p');
    userMsg.innerHTML = `<strong>You:</strong> ${message}`;
    chatContent.appendChild(userMsg);
    chatContent.scrollTop = chatContent.scrollHeight;

    // Clear input field
    inputField.value = '';

    // Call backend chatbot API
    fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        setTimeout(() => {
          const botMsg = document.createElement('p');
          botMsg.innerHTML = `<strong>Bot:</strong> ${data.reply}`;
          chatContent.appendChild(botMsg);
          chatContent.scrollTop = chatContent.scrollHeight;
        }, 0);
      })
      .catch(error => {
        const botMsg = document.createElement('p');
        botMsg.innerHTML = `<strong>Bot:</strong> Error: ${error}`;
        chatContent.appendChild(botMsg);
        chatContent.scrollTop = chatContent.scrollHeight;
      });
  }
});
