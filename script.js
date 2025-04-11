function toggleChat() {
    const chatBox = document.getElementById("chatBox");
    chatBox.style.display = chatBox.style.display === "flex" ? "none" : "flex";
  }

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

      // Add user message
      const userMsg = document.createElement('p');
      userMsg.innerHTML = `<strong>You:</strong> ${message}`;
      chatContent.appendChild(userMsg);

      chatContent.scrollTop = chatContent.scrollHeight;
      inputField.value = '';

      // Bot response after delay
      setTimeout(() => {
        const botMsg = document.createElement('p');
        botMsg.innerHTML = `<strong>Bot:</strong> This is a sample response to "${message}"`;
        chatContent.appendChild(botMsg);
        chatContent.scrollTop = chatContent.scrollHeight;
      }, 1000);
    }
  });