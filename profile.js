/* profile.js
   Handles profile page: shows username, manages profile picture and bio.
   Works with both storage shapes used across the app:
   - 'users' object in localStorage (preferred)
   - legacy 'user_<username>' entries and 'loggedInUser'
*/
(function(){
  const defaultSrc = 'assets/pwa/icons/icon-192.png';

  function getActiveUser(){
    return localStorage.getItem('currentUser') || localStorage.getItem('loggedInUser') || null;
  }

  function loadUsers(){
    try{ return JSON.parse(localStorage.getItem('users') || '{}'); }catch(e){ return {}; }
  }

  function saveUsers(u){
    try{ localStorage.setItem('users', JSON.stringify(u)); }catch(e){ console.warn('Failed saving users', e); }
  }

  function ensureUserRecord(username){
    if(!username) return null;
    const users = loadUsers();
    if(users[username]) return users;

    // Attempt to load legacy record stored under 'user_<username>' or other minimal storage
    const legacy = localStorage.getItem('user_' + username);
    if(legacy){
      try{
        users[username] = JSON.parse(legacy);
      }catch(e){ users[username] = { username }; }
    } else {
      // create empty record compatible with other modules
      users[username] = { password: '', notes: [], timetable: [], gpa: [], profile: {} };
    }
    saveUsers(users);
    return users;
  }

  function getProfile(username){
    if(!username) return {};
    const users = ensureUserRecord(username);
    return users[username].profile || {};
  }

  function persistProfile(username, profile){
    const users = ensureUserRecord(username);
    users[username].profile = profile || {};
    saveUsers(users);
  }

  function updateUIForUser(username){
    const greetEls = document.querySelectorAll('.user-greet');
    greetEls.forEach(el=> el.textContent = username ? ('Hi, ' + username) : 'Hi, Guest');

    const nameEl = document.getElementById('profileUsername');
    if(nameEl) nameEl.textContent = username ? username : 'Guest';

    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){
      logoutBtn.addEventListener('click', (e)=>{
        e.preventDefault();
        try{ localStorage.removeItem('currentUser'); }catch(e){}
        try{ localStorage.removeItem('loggedInUser'); }catch(e){}
        window.location.href = 'index.html';
      });
    }
  }

  function init(){
    const username = getActiveUser();
    updateUIForUser(username);

    const pic = document.getElementById('profilePic');
    const uploadInput = document.getElementById('uploadPic');
    const uploadBtn = document.getElementById('uploadBtn');
    const resetBtn = document.getElementById('resetPicBtn');
    const bioText = document.getElementById('bioText');
    const bioInput = document.getElementById('bioInput');
    const editBioBtn = document.getElementById('editBioBtn');
    const saveBioBtn = document.getElementById('saveBioBtn');

    // load profile
    const profile = getProfile(username);

    // If no user logged in, attach friendly prompts (don't leave buttons inert)
    if (!username) {
      if (pic) pic.src = defaultSrc;
      if (bioText) bioText.textContent = 'Please log in to edit your profile.';

      const makeAlert = (msg) => () => alert(msg);
      if (uploadBtn) uploadBtn.addEventListener('click', makeAlert('Please log in to upload a profile picture.'));
      if (resetBtn) resetBtn.addEventListener('click', makeAlert('Please log in to reset your profile picture.'));
      if (editBioBtn) editBioBtn.addEventListener('click', makeAlert('Please log in to edit your bio.'));
      if (saveBioBtn) saveBioBtn.addEventListener('click', makeAlert('Please log in to save your bio.'));

      // Keep the actual file input and bio textarea non-editable
      if (uploadInput) uploadInput.disabled = true;
      if (bioInput) bioInput.readOnly = true;

      return; // stop attaching the normal handlers below
    }
    if(pic){
      pic.src = profile && profile.picData ? profile.picData : defaultSrc;
      pic.alt = username ? username + "'s profile" : 'Profile picture';
    }

    if(bioText){ bioText.textContent = profile && profile.bio ? profile.bio : 'No bio yet. Click Edit to add one.'; }
    if(bioInput){ bioInput.value = profile && profile.bio ? profile.bio : ''; }

    if(uploadBtn && uploadInput){
      uploadBtn.addEventListener('click', ()=> uploadInput.click());
      uploadInput.addEventListener('change', (ev)=>{
        const f = ev.target.files && ev.target.files[0];
        if(!f) return;
        const reader = new FileReader();
        reader.onload = function(e){
          const data = e.target.result;
          if(pic) pic.src = data;
          // persist (only if user present)
          if (!username) return;
          const prof = getProfile(username);
          prof.picData = data;
          persistProfile(username, prof);
        };
        reader.readAsDataURL(f);
      });
    }

    if(resetBtn){
      resetBtn.addEventListener('click', ()=>{
        if(!username){ alert('Please log in to reset your profile picture.'); return; }
        if(!confirm('Reset profile picture to default?')) return;
        if(pic) pic.src = defaultSrc;
        const prof = getProfile(username);
        delete prof.picData;
        persistProfile(username, prof);
      });
    }

    if(editBioBtn){
      editBioBtn.addEventListener('click', ()=>{
        if(!username){ alert('Please log in to edit your bio.'); return; }
        if(!bioInput || !bioText) return;
        bioInput.style.display = 'block';
        bioText.style.display = 'none';
        bioInput.focus();
      });
    }

    if(saveBioBtn){
      saveBioBtn.addEventListener('click', ()=>{
        if(!username){ alert('Please log in to save your bio.'); return; }
        if(!bioInput || !bioText) return;
        const v = bioInput.value.trim();
        bioText.textContent = v || 'No bio yet. Click Edit to add one.';
        bioInput.style.display = 'none';
        bioText.style.display = 'block';

        const prof = getProfile(username);
        prof.bio = v;
        persistProfile(username, prof);
      });
    }

    // hide textarea by default
    if(bioInput){ bioInput.style.display = 'none'; }

    // accessibility: keyboard shortcut to save bio (Ctrl/Cmd+Enter)
    if(bioInput){
      bioInput.addEventListener('keydown', (ev)=>{
        if((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter'){
          saveBioBtn && saveBioBtn.click();
        }
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // ================= LOGOUT ================= //
const logoutButton=document.getElementById("logoutBtn");
if(logoutButton) logoutButton.addEventListener("click",()=>{ if(confirm("Logout now?")) logout(); });
})();
