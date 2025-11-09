
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

// ================= USER MANAGEMENT ================= //
function getCurrentUser() { return localStorage.getItem("currentUser"); }

function signup(username, password) {
  if (!username || !password) return alert("Please fill all fields!");
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username]) return alert("User already exists!");
  users[username] = { password, notes: [], timetable: [], gpa: [], profile: {}, notifications: [] };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  window.location.href = "index.html";
}

function login(username, password) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[username] && users[username].password === password) {
    localStorage.setItem("currentUser", username);
    window.location.href = "homepage.html";
  } else alert("Invalid username or password.");
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// ================= NOTES MODULE ================= //
(function() {
  let editingIndex = -1;

  function getUsers() { return JSON.parse(localStorage.getItem("users") || "{}"); }
  function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }

  function els() {
    return {
      noteInput: document.getElementById("noteInput"),
      saveBtn: document.getElementById("saveNoteBtn") || document.getElementById("addNoteBtn"),
      cancelBtn: document.getElementById("cancelNoteEditBtn"),
      notesList: document.getElementById("notesList"),
      noteForm: document.getElementById("noteForm")
    };
  }

  function renderNotes() {
    const { notesList } = els();
    if (!notesList) return;
    const user = getCurrentUser();
    if (!user) return notesList.innerHTML="<li>Please log in to manage notes.</li>";

    const users = getUsers();
    const notes = users[user]?.notes || [];
    notesList.innerHTML = "";
    if (notes.length === 0) {
      notesList.innerHTML='<li style="opacity:.8">No notes yet — add one above.</li>';
      return;
    }

    notes.forEach((note, i)=>{
      const li = document.createElement("li");
      li.className="note-item";
      li.style.display="flex"; li.style.justifyContent="space-between"; li.style.alignItems="center"; li.style.gap="8px";
      const textDiv = document.createElement("div");
      textDiv.innerHTML=note.replace(/\n/g,"<br>");
      textDiv.style.flex="1"; textDiv.style.textAlign="left";

      const actions = document.createElement("div");
      actions.style.display="flex"; actions.style.gap="6px";
      const editBtn = document.createElement("button"); editBtn.textContent="✏️ Edit"; editBtn.onclick=()=>startEdit(i);
      const delBtn = document.createElement("button"); delBtn.textContent="🗑️ Delete"; delBtn.className="delete-btn"; delBtn.onclick=()=>{ if(confirm("Delete this note?")) deleteNote(i); };

      actions.appendChild(editBtn); actions.appendChild(delBtn);
      li.appendChild(textDiv); li.appendChild(actions);
      notesList.appendChild(li);
    });
  }

  function startEdit(index) {
    const { noteInput, saveBtn, cancelBtn } = els();
    const user = getCurrentUser();
    if (!user) return alert("Please login to edit notes.");
    const users = getUsers();
    const notes = users[user]?.notes || [];
    if (!notes[index]) return;
    noteInput.value = notes[index];
    editingIndex = index;
    if (saveBtn) saveBtn.textContent="🔁 Update Note";
    if (cancelBtn) cancelBtn.style.display="inline-block";
    noteInput.focus(); noteInput.selectionStart=noteInput.selectionEnd=noteInput.value.length;
  }

  function cancelEdit() {
    const { noteInput, saveBtn, cancelBtn } = els();
    editingIndex=-1; if(noteInput) noteInput.value=""; if(saveBtn) saveBtn.textContent="💾 Save Note"; if(cancelBtn) cancelBtn.style.display="none";
  }

  function handleSave(e) {
    if(e) e.preventDefault();
    const { noteInput, saveBtn, cancelBtn } = els();
    if(!noteInput) return;
    const text = noteInput.value.trim();
    if(!text) return alert("Please type a note before saving.");
    const user = getCurrentUser();
    if(!user) return alert("Please login to save notes.");
    const users = getUsers();
    if(!users[user]) users[user]={password:"",notes:[],timetable:[],gpa:[],profile:{},notifications:[]};
    if(!Array.isArray(users[user].notes)) users[user].notes=[];
    if(editingIndex===-1) users[user].notes.push(text);
    else { users[user].notes[editingIndex]=text; editingIndex=-1; if(saveBtn) saveBtn.textContent="💾 Save Note"; }
    saveUsers(users); if(noteInput) noteInput.value=""; if(cancelBtn) cancelBtn.style.display="none"; renderNotes();
  }

  function deleteNote(index) {
    const user = getCurrentUser();
    if(!user) return;
    const users = getUsers();
    if(!users[user]?.notes) return;
    users[user].notes.splice(index,1);
    saveUsers(users);
    if(editingIndex===index) cancelEdit();
    if(editingIndex>index) editingIndex--;
    renderNotes();
  }

  function init() {
    const { noteInput, saveBtn, cancelBtn, noteForm } = els();
    if(noteForm) noteForm.addEventListener("submit", handleSave);
    else if(saveBtn){ saveBtn.type="button"; saveBtn.addEventListener("click", handleSave); }
    if(cancelBtn){ cancelBtn.type="button"; cancelBtn.addEventListener("click", cancelEdit); cancelBtn.style.display="none"; }
    if(noteInput){ noteInput.addEventListener("keydown",(ev)=>{ if(ev.key==="Enter" && (ev.ctrlKey||ev.metaKey)){ ev.preventDefault(); handleSave(); } }); }
    renderNotes();
  }

  document.addEventListener("DOMContentLoaded", init);
  window.__notes={ renderNotes, startEdit, deleteNote, handleSave, cancelEdit };
})();

// ================= TIMETABLE ================= //
let editingTimetableIndex = null;
function addClass(e){
  e.preventDefault();
  const user=getCurrentUser(); if(!user) return;
  const course=document.getElementById("classCourse").value.trim();
  const day=document.getElementById("classDay").value;
  const time=document.getElementById("classTime").value;
  const notifyBefore=parseInt(document.getElementById("notifyBefore").value);
  if(!course||!day||!time) return alert("Please fill all fields.");

  let users=JSON.parse(localStorage.getItem("users"))||{};
  if(!users[user].timetable) users[user].timetable=[];
  if(editingTimetableIndex===null) users[user].timetable.push({course,day,time,notifyBefore});
  else{ users[user].timetable[editingTimetableIndex]={course,day,time,notifyBefore}; editingTimetableIndex=null; document.getElementById("addClassBtn").textContent="➕ Add Class"; document.getElementById("cancelEditBtn").style.display="none"; }

  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("timetableForm").reset();
  loadTimetable();
}

function loadTimetable(){
  const user=getCurrentUser(); if(!user) return;
  let users=JSON.parse(localStorage.getItem("users"))||{};
  const timetable=users[user].timetable||[];
  const list=document.getElementById("timetableList"); if(!list) return;
  list.innerHTML="";
  timetable.forEach((item,index)=>{
    const li=document.createElement("li");
    li.innerHTML=`<span><b>${item.course}</b> - ${item.day}, ${item.time} (⏰ ${item.notifyBefore} min before)</span>`;
    const editBtn=document.createElement("button"); editBtn.textContent="Edit"; editBtn.onclick=()=>editClass(index);
    const delBtn=document.createElement("button"); delBtn.textContent="Delete"; delBtn.onclick=()=>deleteClass(index);
    li.appendChild(editBtn); li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function editClass(index){
  const user=getCurrentUser(); if(!user) return;
  let users=JSON.parse(localStorage.getItem("users"));
  const item=users[user].timetable[index];
  document.getElementById("classCourse").value=item.course;
  document.getElementById("classDay").value=item.day;
  document.getElementById("classTime").value=item.time;
  document.getElementById("notifyBefore").value=item.notifyBefore;
  editingTimetableIndex=index; document.getElementById("addClassBtn").textContent="Update Class"; document.getElementById("cancelEditBtn").style.display="inline-block";
}

function deleteClass(index){
  const user=getCurrentUser(); if(!user) return;
  let users=JSON.parse(localStorage.getItem("users"));
  users[user].timetable.splice(index,1);
  localStorage.setItem("users",JSON.stringify(users));
  loadTimetable();
}

document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("timetableForm");
  if(form) form.addEventListener("submit",addClass);
  const cancelBtn=document.getElementById("cancelEditBtn");
  if(cancelBtn) cancelBtn.addEventListener("click",()=>{
    editingTimetableIndex=null;
    document.getElementById("timetableForm").reset();
    document.getElementById("addClassBtn").textContent="➕ Add Class";
    cancelBtn.style.display="none";
  });
  loadTimetable();
});

// ================= GPA ================= //
const gpaForm=document.getElementById("gpaForm");
const courseNameInput=document.getElementById("courseName");
const courseGradeInput=document.getElementById("courseGrade");
const courseUnitsInput=document.getElementById("courseUnits");
const gpaList=document.getElementById("gpaList");
const gpaResult=document.getElementById("gpaResult");
const cancelEditBtn=document.getElementById("cancelCourseEditBtn");
const gradePoints={A:5,B:4,C:3,D:2,E:1,F:0};
let gpaCourses=[], gpaEditIndex=null;

function loadGPA(){
  const user=getCurrentUser(); if(!user) return;
  let users=JSON.parse(localStorage.getItem("users"))||{};
  if(!users[user].gpa) users[user].gpa=[];
  gpaCourses=users[user].gpa;
  displayGPA();
}

function displayGPA(){
  gpaList.innerHTML="";
  if(gpaCourses.length===0){ gpaList.innerHTML='<li style="color:gray;text-align:center;">No courses added yet.</li>'; gpaResult.textContent="0.00"; return; }
  gpaCourses.forEach((c,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<span>${c.name} - <b>${c.grade}</b> (${c.units} units)</span>
    <div class="actions">
      <button class="edit-btn" onclick="editGPA(${i})">✏️</button>
      <button class="delete-btn" onclick="deleteGPA(${i})">🗑️</button>
    </div>`;
    gpaList.appendChild(li);
  });
  calculateGPA();
}

function calculateGPA(){
  let totalUnits=0, totalPoints=0;
  gpaCourses.forEach(c=>{ totalUnits+=c.units; totalPoints+=gradePoints[c.grade]*c.units; });
  gpaResult.textContent=totalUnits>0?(totalPoints/totalUnits).toFixed(2):"0.00";
}

function saveGPA(){ const user=getCurrentUser(); if(!user) return; let users=JSON.parse(localStorage.getItem("users")); users[user].gpa=gpaCourses; localStorage.setItem("users",JSON.stringify(users)); }

if(gpaForm) gpaForm.addEventListener("submit",e=>{
  e.preventDefault();
  const name=courseNameInput.value.trim(); const grade=courseGradeInput.value; const units=parseInt(courseUnitsInput.value);
  if(!name||!grade||isNaN(units)) return alert("Please fill all fields correctly!");
  const course={name,grade,units};
  if(gpaEditIndex!==null){ gpaCourses[gpaEditIndex]=course; gpaEditIndex=null; cancelEditBtn.style.display="none"; }
  else gpaCourses.push(course);
  saveGPA(); displayGPA(); gpaForm.reset();
});

function editGPA(i){ const c=gpaCourses[i]; courseNameInput.value=c.name; courseGradeInput.value=c.grade; courseUnitsInput.value=c.units; gpaEditIndex=i; cancelEditBtn.style.display="inline-block"; }

if(cancelEditBtn) cancelEditBtn.addEventListener("click",()=>{ gpaEditIndex=null; cancelEditBtn.style.display="none"; gpaForm.reset(); });

function deleteGPA(i){ if(confirm("Delete this course?")){ gpaCourses.splice(i,1); saveGPA(); displayGPA(); } }

document.addEventListener("DOMContentLoaded", loadGPA);

// ---------- Notification helpers ----------
const notificationTimers = {}; // map index -> timeoutId

function requestNotificationPermission() {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  return Notification.requestPermission();
}

// Convert day string ("Monday") + time ("14:30") into the next Date occurrence
function nextOccurrenceOf(dayStr, timeStr) {
  const days = { sunday:0, monday:1, tuesday:2, wednesday:3, thursday:4, friday:5, saturday:6 };
  const now = new Date();
  const targetDay = days[dayStr.toLowerCase()];
  if (typeof targetDay === "undefined") return null;

  const [hour, minute] = timeStr.split(":").map(s => parseInt(s,10));
  // build candidate date for this week
  const candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);

  // compute difference in days
  const diff = (targetDay - candidate.getDay() + 7) % 7;
  candidate.setDate(candidate.getDate() + diff);

  // if candidate is in the past for today, and diff===0, advance by 7 days
  if (candidate <= now) candidate.setDate(candidate.getDate() + 7);
  return candidate;
}

function scheduleNotification(index, item) {
  // clear existing if any
  cancelNotification(index);

  const nextDate = nextOccurrenceOf(item.day, item.time);
  if (!nextDate) return;
  const notifyMs = (nextDate.getTime() - (item.notifyBefore || 0) * 60_000);
  const now = Date.now();
  let delay = notifyMs - now;

  // If delay is already passed, schedule for the following week
  if (delay <= 0) {
    // schedule for next week's same day/time
    const nextWeek = new Date(nextDate);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const notifyMsNext = nextWeek.getTime() - (item.notifyBefore || 0) * 60_000;
    delay = notifyMsNext - now;
  }

  // Safety: don't schedule ridiculously far in the future (but JS setTimeout supports up to 2^31-1 ms)
  const maxTimeout = 2**31 - 1;
  if (delay > maxTimeout) delay = maxTimeout; // will fire later; we'll reschedule when page reloads

  const tid = setTimeout(async () => {
    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const n = new Notification(`${item.course} in ${item.notifyBefore} min`, {
          body: `${item.course} starts at ${item.time} on ${item.day}.`,
          tag: `timetable-${index}-${item.day}-${item.time}`, // avoid duplicates
          renotify: true
        });
        // optional: focus window on click
        n.onclick = () => window.focus();
      } catch (err) {
        // fallback
        alert(`${item.course} starts at ${item.time} on ${item.day}.`);
      }
    } else {
      // fallback alert if no permission
      alert(`${item.course} starts at ${item.time} on ${item.day}.`);
    }

    // After firing, schedule next week's notification for the same class
    // Recompute next occurrence by adding 7 days and schedule again
    const users = JSON.parse(localStorage.getItem("users")) || {};
    const user = getCurrentUser();
    if (!user || !users[user] || !users[user].timetable) return;
    // find current index may have shifted — but we use the passed index as key; if class still exists, reschedule
    const currentItem = users[user].timetable[index];
    if (currentItem) scheduleNotification(index, currentItem);
  }, delay);

  notificationTimers[index] = tid;
}

function cancelNotification(index) {
  if (notificationTimers[index]) {
    clearTimeout(notificationTimers[index]);
    delete notificationTimers[index];
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

function scheduleAllNotifications() {
  // clear all timers
  Object.keys(notificationTimers).forEach(k => cancelNotification(k));
  const user = getCurrentUser();
  if (!user) return;
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const timetable = (users[user] && users[user].timetable) || [];
  timetable.forEach((item, idx) => {
    // only schedule when notifyBefore > 0 (optional)
    scheduleNotification(idx, item);
  });
}

// Optional robust alternative: if you prefer to check every minute rather than relying on setTimeout precision
// you can set an interval that checks upcoming items and fires notifications if now >= target - notifyBefore.
// Not included by default, but good as a fallback if environment is flaky.

// ---------- Integrate with your existing flow ----------

// After DOM loads, request permission and schedule notifications
document.addEventListener("DOMContentLoaded", async () => {
  // your existing DOMContentLoaded code is already present; we call our additions after that
  // request permission (non-blocking)
  requestNotificationPermission().then(perm => {
    if (perm === "granted") {
      console.log("Notifications granted");
    } else if (perm === "denied") {
      console.log("Notifications denied; falling back to alerts");
    }
    // schedule timers from stored timetable
    scheduleAllNotifications();
  }).catch(() => {
    scheduleAllNotifications();
  });
});

// Modify addClass, deleteClass and edit flow to reschedule notifications after storage changes.
// In your addClass() after localStorage.setItem(...) and loadTimetable(), call:
  // scheduleAllNotifications();

// In deleteClass(index) after saving to localStorage and loadTimetable(), call:
  // cancelNotification(index); scheduleAllNotifications();

// In editClass() when user updates and you save, call scheduleAllNotifications() as well.

// Example small edits to your existing functions (copy these lines into the right places):

// In addClass(), after localStorage.setItem("users", JSON.stringify(users)); 
// and after loadTimetable();
scheduleAllNotifications();

// In deleteClass(index), after localStorage.setItem(...); and loadTimetable();
cancelNotification(index);
scheduleAllNotifications();

// When you cancel editing (the Cancel button handler) nothing needed, except if you used temp timers during edit.

// ---------- Notes & limitations ----------
/*
1. Browser must be open (tab may need to be active in some browsers). Timers are lost when the page is closed; they will be re-created on next load by scheduleAllNotifications().
2. To receive notifications while the browser is closed (or page not open), you need a service worker + Push API and a backend (or convert to a PWA with push). I can help implement a service-worker + local push solution, but it requires additional setup.
3. If you want more reliability across browser restarts, consider using a server to send push notifications or integrate with a native app/OS scheduler.
4. If you want to allow multiple notifications per class (e.g., 30 min and 5 min), schedule multiple setTimeouts per item.
*/

// ================= NOTIFICATION SYSTEM ================= //

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

async function startNotificationChecker() {
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.warn("Notifications not allowed. Using alerts instead.");
  }

  setInterval(() => {
    const user = getCurrentUser();
    if (!user) return;

    const users = JSON.parse(localStorage.getItem("users")) || {};
    const timetable = users[user]?.timetable || [];
    const now = new Date();

    timetable.forEach((item) => {
      const classTime = parseClassDate(item.day, item.time);
      if (!classTime) return;

      const diff = classTime - now;
      const notifyBeforeMs = (item.notifyBefore || 0) * 60 * 1000;

      // Check if it's time to notify (within 1 minute window)
      if (diff > 0 && diff <= notifyBeforeMs + 60000) {
        sendClassNotification(item);
      }
    });
  }, 60000); // check every minute
}

// Helper: convert "Monday 14:30" to Date of next occurrence
function parseClassDate(day, time) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const targetDay = days.indexOf(day);
  if (targetDay === -1) return null;

  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  const classDate = new Date(now);
  classDate.setHours(hours, minutes, 0, 0);

  let dayDiff = targetDay - now.getDay();
  if (dayDiff < 0 || (dayDiff === 0 && classDate < now)) dayDiff += 7;
  classDate.setDate(now.getDate() + dayDiff);

  return classDate;
}

// Show the notification
function sendClassNotification(item) {
  const title = `⏰ ${item.course} starts soon!`;
  const body = `${item.course} begins at ${item.time} on ${item.day}.`;

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  } else {
    alert(body);
  }
}

// Run the checker when page loads
document.addEventListener("DOMContentLoaded", startNotificationChecker);

function updateDashboard() {
  // Load user data (adjust keys as needed)
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const timetable = JSON.parse(localStorage.getItem("timetable")) || [];
  const gpa = parseFloat(localStorage.getItem("gpa")) || 0;

  // Calculate simple progress percentages
  const notesPercent = Math.min((notes.length / 10) * 100, 100);
  const classPercent = Math.min((timetable.length / 10) * 100, 100);
  const gpaPercent = Math.min((gpa / 4) * 100, 100); // assuming max GPA = 4.0

  // Update bars
  document.getElementById("notesProgress").style.width = `${notesPercent}%`;
  document.getElementById("classProgress").style.width = `${classPercent}%`;
  document.getElementById("gpaProgress").style.width = `${gpaPercent}%`;

  // Update numbers
  document.getElementById("notesCountDisplay").textContent = notes.length;
  document.getElementById("classCountDisplay").textContent = timetable.length;
  document.getElementById("gpaCountDisplay").textContent = gpa.toFixed(2);
}

// Run this when the page loads
document.addEventListener("DOMContentLoaded", updateDashboard);



// ================= LOGOUT ================= //
const logoutButton=document.getElementById("logoutBtn");
if(logoutButton) logoutButton.addEventListener("click",()=>{ if(confirm("Logout now?")) logout(); });
// 👁️ Show / Hide Password
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
  passwordField.setAttribute("type", type);
  togglePassword.textContent = type === "password" ? "👁️" : "🙈";
});

// 🔑 Forgot Password Logic
document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Password reset link has been sent to your email (feature coming soon).");
});

