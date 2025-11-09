/* 
  notes.js
  - Expanded search panel that contains New + results
  - Live search across title and content
  - Click outside closes panel
  - If localStorage.authToken exists, the client will attempt to use backend endpoints.
    Otherwise falls back to localStorage-only mode.
*/

/* CONFIG: change base API path if your server uses a different prefix */
const API_BASE = "/api/notes"; // expected endpoints: GET /api/notes, POST /api/notes, PUT /api/notes/:id, DELETE /api/notes/:id

// DOM
const searchInput = document.getElementById("searchInput");
const newNoteBtn = document.getElementById("newNoteBtn");
const topicList = document.getElementById("topicList");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");

// overlay panel elements
const searchOverlay = document.getElementById("searchOverlay");
const expandedSearchInput = document.getElementById("expandedSearchInput");
const panelNewBtn = document.getElementById("panelNewBtn");
const searchResults = document.getElementById("searchResults");

let notes = [];           // in-memory notes list
let activeNote = null;    // currently opened note object
let useBackend = !!localStorage.getItem("authToken"); // if true attempt server sync

// --- HELPERS: backend vs local operations ---
// fetch wrapper that attaches auth token if present
async function apiFetch(url, opts = {}) {
  const token = localStorage.getItem("authToken");
  const headers = opts.headers || {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  opts.headers = {...headers, "Content-Type":"application/json"};
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API error ${resp.status}: ${text}`);
  }
  return resp.json();
}

// load notes (tries backend first if token present)
async function loadNotes() {
  if (useBackend) {
    try {
      const data = await apiFetch(API_BASE, { method: "GET" }); // expects array
      notes = Array.isArray(data) ? data : [];
      renderCompactList();
      return;
    } catch (err) {
      console.warn("Backend notes fetch failed, falling back to localStorage:", err.message);
      useBackend = false;
    }
  }
  // fallback to localStorage
  notes = JSON.parse(localStorage.getItem("notes") || "[]");
  renderCompactList();
}

// save a note: if backend is used call PUT/POST, otherwise update localStorage
async function persistNote(note) {
  if (!note) return;
  if (useBackend) {
    try {
      if (!note._persisted) {
        // create
        const created = await apiFetch(API_BASE, { method: "POST", body: JSON.stringify(note) });
        // expect created note with id
        Object.assign(note, created);
        note._persisted = true;
      } else {
        await apiFetch(`${API_BASE}/${note.id}`, { method: "PUT", body: JSON.stringify(note) });
      }
      // reload list from server for canonical state
      await loadNotes();
      return;
    } catch (err) {
      console.error("Persist to backend failed:", err.message);
      // fallback: mark as local and continue
    }
  }

  // local storage flow
  const store = JSON.parse(localStorage.getItem("notes") || "[]");
  const idx = store.findIndex(n => n.id === note.id);
  if (idx >= 0) store[idx] = note;
  else store.push(note);
  localStorage.setItem("notes", JSON.stringify(store));
  notes = store;
  renderCompactList();
}

// delete note
async function removeNote(noteId) {
  if (!noteId) return;
  if (useBackend) {
    try {
      await apiFetch(`${API_BASE}/${noteId}`, { method: "DELETE" });
      await loadNotes();
      return;
    } catch (err) {
      console.warn("Backend delete failed, falling back to local remove:", err.message);
      useBackend = false;
    }
  }
  notes = notes.filter(n => n.id !== noteId);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderCompactList();
}

/* UI RENDERING */

// compact sidebar list
function renderCompactList() {
  topicList.innerHTML = "";
  if (!notes || notes.length === 0) {
    topicList.innerHTML = `<li class="no-results">No topics yet</li>`;
    return;
  }
  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.title || "Untitled";
    li.dataset.id = n.id;
    if (activeNote && activeNote.id === n.id) li.classList.add("active");
    li.addEventListener("click", () => {
      loadNoteById(n.id);
      // collapse overlay if open
      collapseSearchPanel();
    });
    topicList.appendChild(li);
  });
}

// render results in expanded panel (title + snippet)
function renderSearchResults(list) {
  searchResults.innerHTML = "";
  if (!list.length) {
    searchResults.innerHTML = `<div class="no-results">No matches</div>`;
    return;
  }
  list.forEach(n => {
    const item = document.createElement("div");
    item.className = "result-item";
    const t = document.createElement("div");
    t.className = "result-title";
    t.textContent = n.title || "Untitled";
    const s = document.createElement("div");
    s.className = "result-snippet";
    // snippet: first 80 characters of content without line breaks
    const snippet = (n.content || "").replace(/\s+/g, " ").trim().slice(0, 120);
    s.textContent = snippet || "— no content —";
    item.appendChild(t);
    item.appendChild(s);
    item.addEventListener("click", () => {
      loadNoteById(n.id);
      collapseSearchPanel();
    });
    searchResults.appendChild(item);
  });
}

/* SEARCH logic: searches title AND content (case-insensitive) */
function searchNotes(term) {
  const q = (term || "").trim().toLowerCase();
  if (!q) {
    renderSearchResults(notes);
    return notes;
  }
  const results = notes.filter(n => {
    const inTitle = (n.title || "").toLowerCase().includes(q);
    const inContent = (n.content || "").toLowerCase().includes(q);
    return inTitle || inContent;
  });
  renderSearchResults(results);
  return results;
}

/* NOTE operations */

function createLocalNote() {
  const newNote = {
    id: String(Date.now()), // use string id to avoid collisions
    title: "Change Topic Here",
    content: "",
    userId: null // backend can attach user
  };
  // for backend, we mark _persisted false; after server create we'll copy server ID
  newNote._persisted = false;
  notes.unshift(newNote); // insert at top
  // if not using backend persist immediately
  if (!useBackend) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  renderCompactList();
  loadNote(newNote);
  return newNote;
}

async function createNoteAndPersist() {
  const n = createLocalNote();
  try {
    await persistNote(n);
  } catch (err) {
    console.warn("Could not persist new note:", err.message);
  }
}

function loadNote(noteObj) {
  activeNote = noteObj;
  noteTitle.textContent = noteObj.title || "Untitled";
  noteContent.value = noteObj.content || "";
  noteContent.disabled = false;
  renderCompactList();
}

function loadNoteById(id) {
  const note = notes.find(n => String(n.id) === String(id));
  if (!note) return;
  loadNote(note);
}



/* EVENT HANDLERS */

// small search input triggers the panel (to provide bigger placeholder)
searchInput.addEventListener("focus", () => {
  // set expanded input initial value from compact one
  expandedSearchInput.value = searchInput.value;
  expandSearchPanel();
});

expandedSearchInput.addEventListener("input", (e) => {
  const v = e.target.value;
  searchInput.value = v; // keep compact input synced
  searchNotes(v);
});

// panel New & compact New

newNoteBtn.addEventListener("click", async () => {
  await createNoteAndPersist();
});


// global save / delete buttons
saveNoteBtn && saveNoteBtn.addEventListener("click", async () => {
  if (!activeNote) return alert("Select or create a note first.");
  // take title from contenteditable and content from textarea
  activeNote.title = noteTitle.textContent.trim() || "Untitled";
  activeNote.content = noteContent.value;
  await persistNote(activeNote);
  // reflect changes in UI
  renderCompactList();
  alert("Note saved.");
});

deleteNoteBtn && deleteNoteBtn.addEventListener("click", async () => {
  if (!activeNote) return alert("Select a note to delete.");
  const ok = confirm("Delete this note?");
  if (!ok) return;
  const id = activeNote.id;
  activeNote = null;
  await removeNote(id);
  // clear editor
  noteTitle.textContent = "Select or Create a Topic";
  noteContent.value = "";
  noteContent.disabled = true;
  alert("Note deleted.");
});

// auto-save when typing (throttle to avoid too many writes)
let autoSaveTimer = null;
noteTitle.addEventListener("input", () => {
  if (!activeNote) return;
  // update in memory immediately
  activeNote.title = noteTitle.textContent;
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => persistNote(activeNote), 700);
});
noteContent.addEventListener("input", () => {
  if (!activeNote) return;
  activeNote.content = noteContent.value;
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => persistNote(activeNote), 700);
});

// compact search box typing should filter the compact list in-place
searchInput.addEventListener("input", (e) => {
  const term = e.target.value;
  // filter compact list (not the overlay) for quick browsing
  const filtered = (notes || []).filter(n => {
    const q = term.toLowerCase();
    return (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q);
  });
  // render filtered compact items
  topicList.innerHTML = "";
  if (!filtered.length) { topicList.innerHTML = `<li class="no-results">No topics</li>`; return; }
  filtered.forEach(n => {
    const li = document.createElement("li");
    li.textContent = n.title || "Untitled";
    li.dataset.id = n.id;
    li.addEventListener("click", () => loadNoteById(n.id));
    topicList.appendChild(li);
  });
});

/* INITIALIZE */
(async function init(){
  // load notes (server if token present, else local)
  await loadNotes();
  // if we have notes, preselect the first
  if (notes && notes.length) loadNote(notes[0]);
})();

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