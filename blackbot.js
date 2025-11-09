// --- Elements ---
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const newChatBtn = document.getElementById("new-chat-btn");
const micBtn = document.getElementById("mic-btn");
const loadingIndicator = document.getElementById("loading-indicator");

const uploadToggle = document.getElementById("uploadToggle");
const uploadMenu = document.getElementById("uploadMenu");
const cameraOption = document.getElementById("cameraOption");
const photoOption = document.getElementById("photoOption");
const fileOption = document.getElementById("fileOption");
const photoInput = document.getElementById("photoInput");
const fileInput = document.getElementById("fileInput");
const cameraStream = document.getElementById("cameraStream");
const photoCanvas = document.getElementById("photoCanvas");

const sidebar = document.getElementById("sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
const savedChatsContainer = document.getElementById("savedChatsContainer");

// --- User Info & Chat Memory ---
const username = localStorage.getItem("username") || "User";
let chatHistory = JSON.parse(localStorage.getItem(`chatHistory_${username}`) || "[]");
let chatSessions = JSON.parse(localStorage.getItem(`chatSessions_${username}`) || "[]");

// --- Helper: Render saved chat sessions under toggle ---
function renderSavedChats() {
  savedChatsContainer.innerHTML = "";
  if (chatSessions.length === 0) {
    savedChatsContainer.innerHTML = "<p>No saved chats</p>";
    return;
  }

  chatSessions.forEach((session, index) => {
    const chatBtn = document.createElement("button");
    chatBtn.textContent = `Chat ${index + 1} (${session.length} messages)`;
    chatBtn.classList.add("saved-chat-btn");
    chatBtn.addEventListener("click", () => {
      chatWindow.innerHTML = "";
      chatHistory = session;
      chatHistory.forEach(msg => addMessage(msg.role, msg.text, msg.type));
    });
    savedChatsContainer.appendChild(chatBtn);
  });
}

// --- Add message to chat ---
function addMessage(role, text, type = "text") {
  const msg = document.createElement("div");
  msg.classList.add("message", role);

  if (type === "image") {
    msg.innerHTML = `<p>${text}</p>`;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return;
  }

  if (role === "user") {
    msg.innerHTML = `<p>${text}</p>`;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    return;
  }

  // AI typing animation
  msg.innerHTML = `<p></p>`;
  chatWindow.appendChild(msg);
  const p = msg.querySelector("p");
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      p.textContent += text.charAt(i);
      i++;
      chatWindow.scrollTop = chatWindow.scrollHeight;
      setTimeout(typeChar, 25);
    }
  }

  setTimeout(typeChar, 700); // slight pause before typing
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// --- Initial Load ---
window.addEventListener("DOMContentLoaded", () => {
  if (chatHistory.length === 0) {
    addMessage("ai", `👋 Hey ${username}, I’m Black — your smart study assistant. How can I help today?`);
  } else {
    chatHistory.forEach(msg => addMessage(msg.role, msg.text, msg.type));
  }
  renderSavedChats();
});

// --- Handle Chat Submission ---
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  userInput.value = "";

  try {
    loadingIndicator.style.display = "block";

    const res = await fetch("http://localhost:5501/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("Server error");
    const data = await res.json();
    const reply = data.reply || "⚠️ Connection issue. Try again.";

    addMessage("ai", reply);

    // Save messages to current chatHistory
    chatHistory.push({ role: "user", text: message });
    chatHistory.push({ role: "ai", text: reply });
    localStorage.setItem(`chatHistory_${username}`, JSON.stringify(chatHistory));
    renderSavedChats();
  } catch (err) {
    addMessage("ai", "⚠️ Connection error — could not reach AI.");
    console.error(err);
  } finally {
    loadingIndicator.style.display = "none";
  }
});

// --- New Chat ---
newChatBtn.addEventListener("click", () => {
  // Save current chat to sessions before starting new
  if (chatHistory.length > 0) {
    chatSessions.push(chatHistory);
    localStorage.setItem(`chatSessions_${username}`, JSON.stringify(chatSessions));
  }

  chatWindow.innerHTML = "";
  chatHistory = [];
  localStorage.setItem(`chatHistory_${username}`, JSON.stringify(chatHistory));
  addMessage("ai", `🧠 New chat started, ${username}. What would you like to discuss today?`);
  renderSavedChats();
});

// --- Microphone Input ---
micBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false; // stop automatically after speaking

  recognition.onstart = () => addMessage("ai", "🎙 AI listening...");
  recognition.onerror = (e) => addMessage("ai", "⚠ Mic error or no speech detected.");
  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    addMessage("ai", "AI istened ");
  };
  recognition.onend = () => {
    console.log("Speech recognition ended.");
  };

  recognition.start();
});
// --- Upload Toggle ---
uploadToggle.addEventListener("click", () => {
  uploadMenu.style.display = uploadMenu.style.display === "flex" ? "none" : "flex";
});

// --- Photo Upload ---
photoOption.addEventListener("click", () => {
  uploadMenu.style.display = "none";
  photoInput.click();
});
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) previewImageBeforeSend(file);
});

// --- File Upload ---
fileOption.addEventListener("click", () => {
  uploadMenu.style.display = "none";
  fileInput.click();
});
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) sendFileToAI(file);
});

// --- Camera Capture ---
let cameraActive = false;
let cameraStreamObj = null;

cameraOption.addEventListener("click", async () => {
  if (cameraActive && cameraStreamObj) {
    const ctx = photoCanvas.getContext("2d");
    photoCanvas.width = cameraStream.videoWidth;
    photoCanvas.height = cameraStream.videoHeight;
    ctx.drawImage(cameraStream, 0, 0);

    cameraStreamObj.getTracks().forEach(track => track.stop());
    cameraStream.style.display = "none";
    cameraActive = false;

    photoCanvas.toBlob((blob) => previewImageBeforeSend(blob), "image/jpeg");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraStreamObj = stream;
    cameraStream.srcObject = stream;
    cameraStream.style.display = "block";
    cameraStream.width = 180;
    cameraStream.height = 120;
    cameraActive = true;

    addMessage("ai", "📸 Camera active — click again to capture photo.");
  } catch (err) {
    alert("❌ Camera access denied or unavailable.");
    cameraActive = false;
  }
});

// --- Preview image before sending ---
function previewImageBeforeSend(fileOrBlob) {
  const imgURL = URL.createObjectURL(fileOrBlob);
  const previewDiv = document.createElement("div");
  previewDiv.classList.add("preview-box");
  previewDiv.innerHTML = `
    <img src="${imgURL}" class="preview-image" />
    <div class="preview-actions">
      <button id="sendImgBtn" class="send-btn">Send</button>
      <button id="retakeImgBtn" class="retake-btn">Retake</button>
    </div>
  `;
  chatWindow.appendChild(previewDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  document.getElementById("sendImgBtn").addEventListener("click", () => {
    sendImageToAI(fileOrBlob);
    previewDiv.remove();
  });

  document.getElementById("retakeImgBtn").addEventListener("click", () => {
    previewDiv.remove();
  });
}

// --- Send image to AI ---
async function sendImageToAI(fileOrBlob) {
  const formData = new FormData();
  formData.append("image", fileOrBlob);

  addMessage("user", "🖼️ Sent an image...", "image");

  try {
    const response = await fetch("http://localhost:5501/analyze-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    addMessage("ai", data.text || "⚠️ No result from AI.");
    chatHistory.push({ role: "user", text: "🖼️ Sent an image...", type: "image" });
    chatHistory.push({ role: "ai", text: data.text || "⚠️ No result from AI." });
    localStorage.setItem(`chatHistory_${username}`, JSON.stringify(chatHistory));
    renderSavedChats();
  } catch (err) {
    addMessage("ai", "⚠️ Error analyzing image.");
    console.error(err);
  }
}

// --- Send file to AI ---
async function sendFileToAI(file) {
  const formData = new FormData();
  formData.append("file", file);

  addMessage("user", `📎 Uploaded: ${file.name}`);

  try {
    const response = await fetch("http://localhost:5501/analyze-image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    addMessage("ai", data.text || "⚠️ No result from AI.");
    chatHistory.push({ role: "user", text: `📎 Uploaded: ${file.name}` });
    chatHistory.push({ role: "ai", text: data.text || "⚠️ No result from AI." });
    localStorage.setItem(`chatHistory_${username}`, JSON.stringify(chatHistory));
    renderSavedChats();
  } catch (err) {
    addMessage("ai", "⚠️ Error analyzing file.");
    console.error(err);
  }
}

// --- Sidebar Toggle ---
toggleSidebar.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !toggleSidebar.contains(e.target)) {
    sidebar.classList.remove("show");
  }
});

// --- Expand chat input ---
userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});
