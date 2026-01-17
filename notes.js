<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Notes | Student Companion</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* ===== CSS VARIABLES (Matching Homepage) ===== */
    :root {
      --mature-bg: linear-gradient(180deg,#06060a,#0b0b10);
      --mature-surface: rgba(255,255,255,0.03);
      --mature-card: #0f1114;
      --mature-accent: #7b61ff;
      --mature-accent-2: #6248e6;
      --muted-text: #c7cbd6;
      --muted-weak: #98a0b3;
      --border-soft: rgba(255,255,255,0.04);
      --success: #00ff9d;
      --info: #00b8ff;
      --warning: #ffb800;
      --danger: #ff6b6b;
      --gradient-primary: linear-gradient(135deg, var(--mature-accent), var(--success));
      --gradient-secondary: linear-gradient(135deg, var(--info), var(--mature-accent));
      --radius-lg: 24px;
      --radius-md: 16px;
      --radius-sm: 12px;
      --radius-xs: 8px;
      --shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      --shadow-light: 0 10px 30px rgba(123, 97, 255, 0.2);
      --transition: all 0.3s ease;
    }

    /* ===== GLOBAL STYLES ===== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    html, body {
      height: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      background: var(--mature-bg) !important;
      color: var(--muted-text);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      line-height: 1.6;
      transition: background 0.3s ease, color 0.3s ease;
      padding-bottom: 80px;
    }

    /* ===== LIGHT THEME ===== */
    body.theme-light {
      --mature-bg: linear-gradient(180deg, #f5f5f7, #ffffff);
      --mature-surface: rgba(0, 0, 0, 0.03);
      --mature-card: #ffffff;
      --muted-text: #2d3748;
      --muted-weak: #4a5568;
      --border-soft: rgba(0, 0, 0, 0.1);
      background: var(--mature-bg) !important;
      color: var(--muted-text);
    }

    body.theme-light .header {
      background: rgba(255, 255, 255, 0.95);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    body.theme-light .sidebar {
      background: var(--mature-card);
      border-right: 1px solid var(--border-soft);
    }

    body.theme-light .note-editor {
      background: var(--mature-card);
      border-left: 1px solid var(--border-soft);
    }

    body.theme-light .topic-item-box {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid var(--border-soft);
    }

    body.theme-light input,
    body.theme-light textarea,
    body.theme-light select {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid var(--border-soft);
      color: var(--muted-text);
    }

    body.theme-light input:focus,
    body.theme-light textarea:focus {
      border-color: var(--mature-accent);
      background: rgba(123, 97, 255, 0.05);
    }

    /* ===== REDUCED MOTION ===== */
    body.reduce-motion * {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideInLeft {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    /* ===== HEADER ===== */
    .header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 5%;
      background: rgba(15, 17, 20, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-soft);
      position: fixed;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      transition: var(--transition);
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
    }

    .brand-icon {
      font-size: 1.8rem;
      color: var(--mature-accent);
      filter: drop-shadow(0 0 5px rgba(123, 97, 255, 0.5));
    }

    .header-brand h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .header-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: var(--radius-sm);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: var(--transition);
      border: none;
      cursor: pointer;
    }

    .back-btn {
      background: rgba(123, 97, 255, 0.1);
      color: var(--mature-accent);
      border: 1px solid rgba(123, 97, 255, 0.2);
    }

    .back-btn:hover {
      background: rgba(123, 97, 255, 0.2);
      transform: translateX(-3px);
    }

    .logout-btn {
      background: rgba(255, 107, 107, 0.1);
      color: var(--danger);
      border: 1px solid rgba(255, 107, 107, 0.2);
    }

    .logout-btn:hover {
      background: rgba(255, 107, 107, 0.2);
      transform: translateY(-2px);
    }

    /* ===== MAIN LAYOUT ===== */
    .main-layout {
      display: flex;
      flex: 1;
      margin-top: 70px;
      height: calc(100vh - 150px);
      overflow: hidden;
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      width: 320px;
      background: var(--mature-card);
      border-right: 1px solid var(--border-soft);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 70px;
      left: 0;
      bottom: 80px;
      z-index: 900;
      transition: var(--transition);
      transform: translateX(0);
    }

    .sidebar.collapsed {
      transform: translateX(-100%);
    }

    .sidebar-header {
      padding: 25px;
      border-bottom: 1px solid var(--border-soft);
      background: linear-gradient(135deg, rgba(123, 97, 255, 0.05), rgba(98, 72, 230, 0.02));
    }

    .sidebar-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .sidebar-title i {
      font-size: 1.5rem;
      color: var(--mature-accent);
      background: rgba(123, 97, 255, 0.1);
      padding: 10px;
      border-radius: 12px;
    }

    .sidebar-title h2 {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--muted-text);
    }

    .search-container {
      position: relative;
      margin-bottom: 20px;
    }

    #searchInput {
      width: 100%;
      padding: 14px 45px 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1.5px solid var(--border-soft);
      border-radius: var(--radius-sm);
      color: var(--muted-text);
      font-size: 0.95rem;
      transition: var(--transition);
    }

    #searchInput:focus {
      outline: none;
      border-color: var(--mature-accent);
      box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.15);
    }

    #searchInput::placeholder {
      color: var(--muted-weak);
    }

    .search-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-weak);
    }

    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: var(--transition);
      text-align: center;
    }

    .primary-btn {
      background: linear-gradient(135deg, var(--mature-accent), var(--mature-accent-2));
      color: white;
      box-shadow: 0 5px 15px rgba(123, 97, 255, 0.3);
    }

    .primary-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(123, 97, 255, 0.4);
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.08);
      color: var(--muted-text);
      border: 1px solid var(--border-soft);
    }

    .secondary-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-3px);
      border-color: var(--mature-accent);
    }

    .chat-btn {
      background: linear-gradient(135deg, #8a2be2, #00ffff);
      color: white;
      box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
    }

    .chat-btn:hover {
      background: linear-gradient(135deg, #7a1bd2, #00e0e0);
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(138, 43, 226, 0.4);
    }

    .chat-btn:disabled {
      background: var(--muted-weak);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .topic-list-container {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .topic-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ===== TOPIC ITEMS ===== */
    .topic-item-box {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 18px;
      cursor: pointer;
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .topic-item-box:hover {
      transform: translateY(-5px);
      border-color: var(--mature-accent);
      box-shadow: var(--shadow-light);
    }

    .topic-item-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--mature-accent), var(--success));
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .topic-item-box:hover::before {
      transform: translateX(0);
    }

    .topic-item-box.active {
      background: rgba(123, 97, 255, 0.1);
      border-color: var(--mature-accent);
    }

    .topic-item-box.active::before {
      transform: translateX(0);
    }

    .topic-content-box {
      position: relative;
      z-index: 1;
    }

    .topic-title-box {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .topic-title {
      font-weight: 600;
      color: var(--muted-text);
      font-size: 1rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .date-badge {
      font-size: 0.75rem;
      background: rgba(123, 97, 255, 0.2);
      color: var(--mature-accent);
      padding: 4px 8px;
      border-radius: 20px;
      font-weight: 500;
      white-space: nowrap;
      margin-left: 8px;
    }

    .topic-preview-box {
      color: var(--muted-weak);
      font-size: 0.85rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .file-indicator {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-right: 8px;
      color: var(--info);
      font-size: 0.8rem;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--muted-weak);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 15px;
      opacity: 0.5;
      color: var(--mature-accent);
    }

    .empty-state h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--muted-text);
    }

    .empty-state p {
      font-size: 0.95rem;
      max-width: 300px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* ===== NOTE EDITOR ===== */
    .note-editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--mature-card);
      padding: 25px;
      margin-left: 320px;
      transition: var(--transition);
      animation: fadeIn 0.6s ease-out;
    }

    .sidebar.collapsed ~ .note-editor {
      margin-left: 0;
    }

    .editor-header {
      margin-bottom: 25px;
    }

    #noteTitle {
      width: 100%;
      font-size: 2rem;
      font-weight: 700;
      color: var(--muted-text);
      padding: 10px;
      border: none;
      background: transparent;
      outline: none;
      transition: var(--transition);
      border-bottom: 2px solid transparent;
    }

    #noteTitle[placeholder]:empty:before {
      content: attr(placeholder);
      color: var(--muted-weak);
      font-weight: normal;
      opacity: 0.7;
    }

    #noteTitle:focus {
      border-bottom: 2px solid var(--mature-accent);
    }

    .editor-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    #noteContent {
      flex: 1;
      width: 100%;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid var(--border-soft);
      border-radius: var(--radius-md);
      color: var(--muted-text);
      font-size: 1rem;
      line-height: 1.6;
      resize: none;
      outline: none;
      transition: var(--transition);
      font-family: 'Inter', sans-serif;
      min-height: 300px;
    }

    #noteContent:focus {
      border-color: var(--mature-accent);
      box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.15);
      background: rgba(123, 97, 255, 0.02);
    }

    #noteContent:disabled {
      background: rgba(255, 255, 255, 0.02);
      color: var(--muted-weak);
      cursor: not-allowed;
    }

    .file-preview {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-md);
      padding: 20px;
    }

    .file-preview h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--muted-text);
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-soft);
      border-radius: var(--radius-sm);
      transition: var(--transition);
    }

    .file-item:hover {
      background: rgba(123, 97, 255, 0.05);
      border-color: var(--mature-accent);
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      cursor: pointer;
    }

    .file-icon-large {
      font-size: 1.5rem;
      color: var(--mature-accent);
    }

    .file-details {
      flex: 1;
    }

    .file-name {
      font-weight: 500;
      color: var(--muted-text);
      margin-bottom: 4px;
      word-break: break-word;
    }

    .file-size {
      font-size: 0.85rem;
      color: var(--muted-weak);
    }

    .file-actions {
      display: flex;
      gap: 8px;
    }

    .file-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: none;
      border-radius: var(--radius-xs);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      background: transparent;
    }

    .view-btn {
      background: rgba(0, 184, 255, 0.1);
      color: var(--info);
      border: 1px solid rgba(0, 184, 255, 0.2);
    }

    .view-btn:hover {
      background: rgba(0, 184, 255, 0.2);
      transform: translateY(-2px);
    }

    .extract-btn {
      background: rgba(0, 255, 157, 0.1);
      color: var(--success);
      border: 1px solid rgba(0, 255, 157, 0.2);
    }

    .extract-btn:hover {
      background: rgba(0, 255, 157, 0.2);
      transform: translateY(-2px);
    }

    .send-chat-btn {
      background: rgba(138, 43, 226, 0.1);
      color: #8a2be2;
      border: 1px solid rgba(138, 43, 226, 0.2);
    }

    .send-chat-btn:hover {
      background: rgba(138, 43, 226, 0.2);
      transform: translateY(-2px);
    }

    .remove-btn {
      background: rgba(255, 107, 107, 0.1);
      color: var(--danger);
      border: 1px solid rgba(255, 107, 107, 0.2);
    }

    .remove-btn:hover {
      background: rgba(255, 107, 107, 0.2);
      transform: translateY(-2px);
    }

    .editor-actions {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .editor-actions button {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    #saveNoteBtn {
      background: linear-gradient(135deg, var(--mature-accent), var(--mature-accent-2));
      color: white;
      box-shadow: 0 5px 20px rgba(123, 97, 255, 0.3);
    }

    #saveNoteBtn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(123, 97, 255, 0.4);
    }

    #deleteNoteBtn {
      background: rgba(255, 107, 107, 0.1);
      color: var(--danger);
      border: 1px solid rgba(255, 107, 107, 0.2);
    }

    #deleteNoteBtn:hover {
      background: rgba(255, 107, 107, 0.2);
      transform: translateY(-3px);
      border-color: var(--danger);
    }

    /* ===== BOTTOM NAVIGATION ===== */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15, 17, 20, 0.95);
      backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-soft);
      display: flex;
      justify-content: space-around;
      padding: 12px 0;
      z-index: 1000;
      transition: var(--transition);
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-decoration: none;
      color: var(--muted-weak);
      font-size: 0.75rem;
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      min-width: 70px;
      cursor: pointer;
    }

    .nav-item i {
      font-size: 1.2rem;
      margin-bottom: 4px;
      transition: all 0.3s ease;
    }

    .nav-item.active {
      color: var(--mature-accent);
      background: rgba(123, 97, 255, 0.1);
    }

    .nav-item.active i {
      transform: translateY(-2px);
    }

    .nav-item:hover {
      color: var(--mature-accent);
      transform: translateY(-2px);
    }

    /* ===== FLOATING AI BUTTON ===== */
    .floating-ai {
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: linear-gradient(135deg, var(--mature-accent), var(--mature-accent-2));
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      box-shadow: 0 8px 25px rgba(123, 97, 255, 0.4);
      transition: all 0.3s ease;
      z-index: 999;
    }

    .floating-ai:hover {
      transform: scale(1.1) rotate(10deg);
      box-shadow: 0 12px 30px rgba(123, 97, 255, 0.6);
      animation: pulse 2s infinite;
    }

    .floating-ai i {
      font-size: 1.5rem;
    }

    /* ===== NOTIFICATION SYSTEM ===== */
    .notification-container {
      position: fixed;
      top: 90px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification {
      background: var(--mature-card);
      border-left: 4px solid var(--mature-accent);
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateX(400px);
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      backdrop-filter: blur(10px);
    }

    .notification.show {
      transform: translateX(0);
    }

    .notification.success {
      border-left-color: var(--success);
    }

    .notification.error {
      border-left-color: var(--danger);
    }

    .notification.warning {
      border-left-color: var(--warning);
    }

    .notification.info {
      border-left-color: var(--info);
    }

    .notification.chat {
      border-left-color: #8a2be2;
    }

    .notification-icon {
      font-size: 1.2rem;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--muted-text);
    }

    .notification-message {
      font-size: 0.9rem;
      color: var(--muted-weak);
    }

    .notification-close {
      background: none;
      border: none;
      color: var(--muted-weak);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 4px;
      border-radius: 50%;
      transition: var(--transition);
    }

    .notification-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--muted-text);
    }

    /* ===== MODALS ===== */
    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal.show {
      display: flex;
    }

    .modal-content {
      background: var(--mature-card);
      padding: 30px;
      border-radius: var(--radius-lg);
      width: 90%;
      max-width: 500px;
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow);
      animation: fadeIn 0.3s ease;
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .modal-header i {
      font-size: 1.5rem;
      color: var(--mature-accent);
    }

    .modal-header h2 {
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--muted-text);
    }

    .modal-input {
      width: 100%;
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1.5px solid var(--border-soft);
      border-radius: var(--radius-sm);
      color: var(--muted-text);
      font-size: 1rem;
      margin-bottom: 20px;
      transition: var(--transition);
    }

    .modal-input:focus {
      outline: none;
      border-color: var(--mature-accent);
      box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.15);
    }

    .modal-actions {
      display: flex;
      gap: 12px;
    }

    .modal-actions button {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: var(--transition);
    }

    .modal-confirm {
      background: linear-gradient(135deg, var(--mature-accent), var(--mature-accent-2));
      color: white;
    }

    .modal-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(123, 97, 255, 0.3);
    }

    .modal-cancel {
      background: rgba(255, 255, 255, 0.08);
      color: var(--muted-text);
      border: 1px solid var(--border-soft);
    }

    .modal-cancel:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }

    /* ===== FILE VIEWER ===== */
    .file-viewer-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 3000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .file-viewer-modal.show {
      display: flex;
    }

    .file-viewer-content {
      background: var(--mature-card);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--border-soft);
      box-shadow: var(--shadow);
    }

    .viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid var(--border-soft);
    }

    .viewer-header h2 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--muted-text);
      margin: 0;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .viewer-body {
      flex: 1;
      overflow: auto;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-viewer {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: var(--radius-sm);
    }

    /* ===== RESPONSIVE DESIGN ===== */
    @media (max-width: 1024px) {
      .sidebar {
        width: 280px;
      }
      
      .note-editor {
        margin-left: 280px;
      }
      
      .action-buttons {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .header {
        padding: 12px 20px;
      }
      
      .header-brand h1 {
        font-size: 1.3rem;
      }
      
      .header-btn {
        padding: 8px 12px;
        font-size: 0.85rem;
      }
      
      .sidebar {
        width: 100%;
        max-width: 320px;
        transform: translateX(-100%);
        z-index: 1001;
      }
      
      .sidebar.show {
        transform: translateX(0);
      }
      
      .note-editor {
        margin-left: 0;
        padding: 20px;
      }
      
      .sidebar.show ~ .note-editor {
        margin-left: 0;
        transform: translateX(320px);
      }
      
      #noteTitle {
        font-size: 1.6rem;
      }
      
      .editor-actions {
        flex-direction: column;
        gap: 10px;
      }
      
      .file-actions {
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      
      .notification-container {
        top: 80px;
        right: 10px;
        left: 10px;
      }
      
      .notification {
        min-width: auto;
        max-width: 100%;
      }
      
      .nav-item {
        min-width: 60px;
        padding: 8px 12px;
        font-size: 0.7rem;
      }
      
      .nav-item i {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .header-brand h1 {
        font-size: 1.1rem;
      }
      
      .back-btn span,
      .logout-btn span {
        display: none;
      }
      
      .back-btn,
      .logout-btn {
        padding: 8px;
      }
      
      #noteTitle {
        font-size: 1.4rem;
      }
      
      .note-editor {
        padding: 15px;
      }
      
      .modal-content {
        padding: 20px;
      }
      
      .modal-actions {
        flex-direction: column;
      }
      
      .floating-ai {
        bottom: 70px;
        right: 15px;
        width: 50px;
        height: 50px;
      }
      
      .floating-ai i {
        font-size: 1.2rem;
      }
    }

    /* ===== CUSTOM SCROLLBAR ===== */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--mature-accent);
      border-radius: 4px;
      transition: var(--transition);
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--mature-accent-2);
    }

    /* ===== FILE UPLOAD HIDDEN ===== */
    #fileUpload {
      display: none;
    }

    /* ===== TOGGLE BUTTON ===== */
    .toggle-sidebar-btn {
      position: fixed;
      bottom: 80px;
      left: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--mature-accent), var(--mature-accent-2));
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 998;
      box-shadow: 0 4px 15px rgba(123, 97, 255, 0.3);
      transition: var(--transition);
    }

    .toggle-sidebar-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(123, 97, 255, 0.4);
    }

    /* ===== SIDEBAR OVERLAY ===== */
    .sidebar-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 899;
    }

    @media (max-width: 768px) {
      .sidebar.show + .sidebar-overlay {
        display: block;
      }
    }
  </style>
  <meta name="theme-color" content="#7b61ff">
</head>
<body>
  <!-- Header -->
  <header class="header">
    <a href="homepage.html" class="header-brand">
      <i class="fas fa-graduation-cap brand-icon"></i>
      <h1>Student Companion</h1>
    </a>
    <div class="header-actions">
      <a href="homepage.html" class="header-btn back-btn">
        <i class="fas fa-arrow-left"></i>
        <span>Back to Home</span>
      </a>
      <button class="header-btn logout-btn" id="logoutBtn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  </header>

  <!-- Main Layout -->
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <i class="fas fa-sticky-note"></i>
          <h2>My Notes</h2>
        </div>
        
        <div class="search-container">
          <input type="text" id="searchInput" placeholder="Search notes..." autocomplete="on">
          <i class="fas fa-search search-icon"></i>
        </div>
        
        <div class="action-buttons">
          <button id="newNoteBtn" class="action-btn primary-btn">
            <i class="fas fa-plus"></i>
            New Note
          </button>
          <button id="uploadFileBtn" class="action-btn secondary-btn">
            <i class="fas fa-upload"></i>
            Upload
          </button>
        </div>
        
        <button id="sendToChatBtn" class="action-btn chat-btn" disabled>
          <i class="fas fa-paper-plane"></i>
          Send to AI
        </button>
        
        <input type="file" id="fileUpload" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.ppt,.pptx,.xls,.xlsx,.csv,.md">
      </div>
      
      <div class="topic-list-container">
        <ul id="topicList" class="topic-list">
          <!-- Topics will be populated by JavaScript -->
        </ul>
      </div>
    </aside>

    <!-- Sidebar Overlay (Mobile) -->
    <div class="sidebar-overlay"></div>

    <!-- Note Editor -->
    <section class="note-editor">
      <div class="editor-header">
        <input type="text" id="noteTitle" placeholder="Note Title..." spellcheck="false">
      </div>
      
      <div class="editor-content">
        <textarea id="noteContent" placeholder="Start writing your note here..." disabled></textarea>
        
        <!-- File Preview Section -->
        <div id="filePreviewSection" class="file-preview" style="display: none;">
          <h3><i class="fas fa-paperclip"></i> Attached Files</h3>
          <div id="fileList" class="file-list">
            <!-- Files will be displayed here -->
          </div>
        </div>
      </div>
      
      <div class="editor-actions">
        <button id="saveNoteBtn">
          <i class="fas fa-save"></i>
          Save Note
        </button>
        <button id="deleteNoteBtn">
          <i class="fas fa-trash"></i>
          Delete Note
        </button>
      </div>
    </section>
  </div>

  <!-- Bottom Navigation -->
  <nav class="bottom-nav">
    <a href="homepage.html" class="nav-item">
      <i class="fas fa-home"></i>
      Home
    </a>
    <a href="timetable.html" class="nav-item">
      <i class="fas fa-calendar-alt"></i>
      Timetable
    </a>
    <a href="notes.html" class="nav-item active">
      <i class="fas fa-sticky-note"></i>
      Notes
    </a>
    <a href="gpa.html" class="nav-item">
      <i class="fas fa-chart-line"></i>
      GPA
    </a>
    <a href="profile.html" class="nav-item">
      <i class="fas fa-user"></i>
      Profile
    </a>
  </nav>

  <!-- Floating AI Button -->
  <a href="ai2.html" class="floating-ai">
    <i class="fas fa-robot"></i>
  </a>

  <!-- Toggle Sidebar Button (Mobile) -->
  <button class="toggle-sidebar-btn" id="toggleSidebarBtn">
    <i class="fas fa-bars"></i>
  </button>

  <!-- Notification Container -->
  <div id="notificationContainer" class="notification-container"></div>

  <!-- File Modal -->
  <div id="fileModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <i class="fas fa-file-alt"></i>
        <h2>Create File Note</h2>
      </div>
      <input type="text" id="fileNameInput" class="modal-input" placeholder="Enter note title..." autocomplete="off">
      <div class="modal-actions">
        <button id="modalConfirm" class="modal-confirm">Create Note</button>
        <button id="modalCancel" class="modal-cancel">Cancel</button>
      </div>
    </div>
  </div>

  <!-- File Viewer Modal -->
  <div id="fileViewerModal" class="file-viewer-modal">
    <div class="file-viewer-content">
      <div class="viewer-header">
        <h2 id="viewerTitle">File Viewer</h2>
        <button id="closeViewerBtn" class="header-btn back-btn">
          <i class="fas fa-times"></i>
          Close
        </button>
      </div>
      <div class="viewer-body" id="viewerBody">
        <!-- File content will be displayed here -->
      </div>
    </div>
  </div>

  <script>
    // ====== SETTINGS MANAGEMENT ======
    const SettingsManager = {
      defaults: {
        theme: 'dark',
        accentColor: '#7b61ff',
        enableNotifications: true,
        reminderSound: true,
        animations: true,
        reduceMotion: false
      },

      current: {},

      init: function() {
        this.loadSettings();
        this.applySettings();
        this.initEventListeners();
      },

      loadSettings: function() {
        const username = localStorage.getItem('currentUser') || 'guest';
        const userSettings = JSON.parse(localStorage.getItem(`${username}_settings`)) || {};
        this.current = { ...this.defaults, ...userSettings };
        this.applySettings();
      },

      saveSettings: function() {
        const username = localStorage.getItem('currentUser') || 'guest';
        localStorage.setItem(`${username}_settings`, JSON.stringify(this.current));
      },

      applySettings: function() {
        // Apply theme
        document.body.classList.remove('theme-dark', 'theme-light', 'theme-auto');
        if (this.current.theme === 'light') {
          document.body.classList.add('theme-light');
        } else if (this.current.theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else {
          document.body.classList.add('theme-dark');
        }

        // Apply accent color
        if (this.current.accentColor) {
          document.documentElement.style.setProperty('--mature-accent', this.current.accentColor);
          const hex = this.current.accentColor.replace('#', '');
          const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
          const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
          const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
          const darker = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          document.documentElement.style.setProperty('--mature-accent-2', darker);
        }

        // Apply animations
        if (this.current.reduceMotion) {
          document.body.classList.add('reduce-motion');
        } else {
          document.body.classList.remove('reduce-motion');
        }

        // Update bottom nav theme
        this.updateBottomNavTheme();
      },

      updateBottomNavTheme: function() {
        const bottomNav = document.querySelector('.bottom-nav');
        const header = document.querySelector('.header');
        const theme = this.current.theme === 'auto' ? 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
          this.current.theme;
        
        if (theme === 'light') {
          if (bottomNav) {
            bottomNav.style.background = 'rgba(255, 255, 255, 0.95)';
            bottomNav.style.borderTop = '1px solid rgba(0, 0, 0, 0.1)';
          }
          if (header) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
          }
        } else {
          if (bottomNav) {
            bottomNav.style.background = 'rgba(15, 17, 20, 0.95)';
            bottomNav.style.borderTop = '1px solid rgba(255, 255, 255, 0.04)';
          }
          if (header) {
            header.style.background = 'rgba(15, 17, 20, 0.95)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.04)';
          }
        }
      },

      initEventListeners: function() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
          if (confirm('Are you sure you want to logout?')) {
            this.logoutUser();
          }
        });

        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if (this.current.theme === 'auto') {
            this.applySettings();
          }
        });
      },

      showNotification: function(message, type = 'info', title = '', duration = 5000) {
        // Check if notifications are enabled
        if (!this.current.enableNotifications && type !== 'error') {
          return;
        }

        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
          success: 'fas fa-check-circle',
          error: 'fas fa-exclamation-circle',
          warning: 'fas fa-exclamation-triangle',
          info: 'fas fa-info-circle',
          chat: 'fas fa-paper-plane'
        };

        notification.innerHTML = `
          <i class="${icons[type] || icons.info} notification-icon"></i>
          <div class="notification-content">
            ${title ? `<div class="notification-title">${title}</div>` : ''}
            <div class="notification-message">${message}</div>
          </div>
          <button class="notification-close">&times;</button>
        `;

        container.appendChild(notification);

        // Play sound if enabled
        if (this.current.reminderSound && type !== 'info') {
          this.playNotificationSound();
        }

        // Show notification
        setTimeout(() => {
          notification.classList.add('show');
        }, 10);

        // Auto remove after duration
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            if (notification.parentNode === container) {
              container.removeChild(notification);
            }
          }, 300);
        }, duration);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
          notification.classList.remove('show');
          setTimeout(() => {
            if (notification.parentNode === container) {
              container.removeChild(notification);
            }
          }, 300);
        });
      },

      playNotificationSound: function() {
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {
          console.log('Audio playback failed:', e);
        }
      },

      logoutUser: function() {
        this.saveSettings();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginUser');
        
        this.showNotification('Logged out successfully', 'success', 'Goodbye!');
        
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      }
    };

    // ====== NOTES MANAGEMENT ======
    const NotesManager = {
      notes: [],
      activeNote: null,
      pendingFiles: [],
      currentViewingFile: null,
      autoSaveTimer: null,
      user: null,

      init: function() {
        this.getCurrentUser();
        this.loadNotes();
        this.bindEvents();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
      },

      getCurrentUser: function() {
        this.user = localStorage.getItem('currentUser') || localStorage.getItem('loginUser') || 'guest';
      },

      getStorageKey: function() {
        return this.user !== 'guest' ? `studentAI_notes_${this.user}` : 'notes';
      },

      loadNotes: function() {
        try {
          const storageKey = this.getStorageKey();
          const storedNotes = localStorage.getItem(storageKey);
          this.notes = storedNotes ? JSON.parse(storedNotes) : [];
          
          // Add sample notes if empty
          if (this.notes.length === 0 && this.user === 'guest') {
            this.notes = [
              {
                id: 'note_1',
                title: 'Welcome to Notes',
                content: 'This is your first note! You can create new notes, upload files, and send them to the AI assistant for help with your studies.',
                files: [],
                tags: ['welcome', 'getting-started'],
                createdAt: Date.now() - 86400000,
                updatedAt: Date.now() - 86400000
              },
              {
                id: 'note_2',
                title: 'Study Tips',
                content: '1. Create separate notes for each subject\n2. Use the search function to find notes quickly\n3. Upload lecture slides as PDFs\n4. Send complex topics to AI for explanation\n5. Use tags to organize your notes',
                files: [],
                tags: ['tips', 'organization'],
                createdAt: Date.now() - 172800000,
                updatedAt: Date.now() - 172800000
              }
            ];
            this.saveNotes();
          }
          
          // Sort by last updated
          this.notes.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
          
          this.renderTopicList();
          this.updateSendToChatButton();
          
          // Load last active note if any
          const lastActive = localStorage.getItem('lastActiveNote');
          if (lastActive) {
            const { id } = JSON.parse(lastActive);
            const note = this.notes.find(n => n.id === id);
            if (note) {
              this.loadNote(note);
            } else if (this.notes.length > 0) {
              this.loadNote(this.notes[0]);
            }
          } else if (this.notes.length > 0) {
            this.loadNote(this.notes[0]);
          }
          
        } catch (error) {
          console.error('Error loading notes:', error);
          this.notes = [];
          SettingsManager.showNotification('Error loading notes', 'error');
        }
      },

      saveNotes: function() {
        try {
          const storageKey = this.getStorageKey();
          localStorage.setItem(storageKey, JSON.stringify(this.notes));
          
          // Update homepage stats
          this.updateHomepageStats();
        } catch (error) {
          console.error('Error saving notes:', error);
          SettingsManager.showNotification('Error saving notes', 'error');
        }
      },

      updateHomepageStats: function() {
        const notesCount = this.notes.length;
        localStorage.setItem('notesCount', notesCount.toString());
      },

      formatDate: function(timestamp) {
        if (!timestamp) return "Recently";
        const date = new Date(parseInt(timestamp));
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays/7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      },

      formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },

      getFileIcon: function(fileType) {
        if (fileType.includes('pdf')) return '📕';
        if (fileType.includes('word') || fileType.includes('doc')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        if (fileType.includes('presentation') || fileType.includes('ppt')) return '📊';
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📈';
        if (fileType.includes('text') || fileType.includes('plain')) return '📝';
        if (fileType.includes('csv')) return '📊';
        if (fileType.includes('markdown') || fileType.includes('md')) return '📋';
        return '📎';
      },

      canViewFile: function(fileType) {
        return fileType.startsWith('image/') || fileType.includes('pdf') || fileType.includes('text');
      },

      canExtractText: function(fileType) {
        return fileType.includes('text') || fileType.includes('pdf') || fileType.includes('markdown');
      },

      extractTextFromBase64: function(base64Data) {
        try {
          if (!base64Data) return '';
          const base64WithoutPrefix = base64Data.split(',')[1];
          if (!base64WithoutPrefix) return '';
          const text = atob(base64WithoutPrefix);
          return text.substring(0, 5000); // Limit extraction
        } catch (e) {
          console.error('Failed to extract text:', e);
          return '';
        }
      },

      createNewNote: function(title = "New Note", files = [], extractedText = "") {
        const newNote = {
          id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: title,
          content: extractedText || "",
          files: files,
          tags: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          userId: this.user !== 'guest' ? this.user : null
        };

        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderTopicList();
        this.loadNote(newNote);
        
        document.getElementById('noteTitle').focus();
        document.getElementById('noteTitle').select();
        
        SettingsManager.showNotification('New note created!', 'success', 'Note Created');
        return newNote;
      },

      loadNote: function(note) {
        this.activeNote = note;
        
        document.getElementById('noteTitle').value = note.title || "";
        document.getElementById('noteContent').value = note.content || "";
        document.getElementById('noteContent').disabled = false;
        
        if (note.files && note.files.length > 0) {
          this.renderFileList(note.files);
          document.getElementById('filePreviewSection').style.display = 'block';
        } else {
          document.getElementById('filePreviewSection').style.display = 'none';
        }
        
        // Update active state in topic list
        document.querySelectorAll('.topic-item-box').forEach(item => {
          item.classList.remove('active');
          if (item.dataset.id === note.id) {
            item.classList.add('active');
          }
        });
        
        this.updateSendToChatButton();
        
        // Save last active note
        localStorage.setItem('lastActiveNote', JSON.stringify({
          id: note.id,
          title: note.title,
          preview: note.content.substring(0, 200)
        }));
      },

      saveNote: function() {
        if (!this.activeNote) {
          SettingsManager.showNotification('No note selected', 'warning');
          return;
        }
        
        this.activeNote.title = document.getElementById('noteTitle').value.trim() || "Untitled";
        this.activeNote.content = document.getElementById('noteContent').value;
        this.activeNote.updatedAt = Date.now();
        
        const index = this.notes.findIndex(n => n.id === this.activeNote.id);
        if (index !== -1) {
          this.notes[index] = this.activeNote;
        }
        
        this.saveNotes();
        this.renderTopicList();
        SettingsManager.showNotification('Note saved successfully!', 'success', 'Note Saved');
      },

      deleteNote: function() {
        if (!this.activeNote) {
          SettingsManager.showNotification('No note selected', 'warning');
          return;
        }
        
        if (!confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
          return;
        }
        
        const noteId = this.activeNote.id;
        this.notes = this.notes.filter(n => n.id !== noteId);
        this.saveNotes();
        this.renderTopicList();
        
        this.activeNote = null;
        document.getElementById('noteTitle').value = "";
        document.getElementById('noteContent').value = "";
        document.getElementById('noteContent').disabled = true;
        document.getElementById('filePreviewSection').style.display = 'none';
        
        if (this.notes.length > 0) {
          this.loadNote(this.notes[0]);
        }
        
        SettingsManager.showNotification('Note deleted', 'success', 'Note Deleted');
      },

      updateSendToChatButton: function() {
        const sendToChatBtn = document.getElementById('sendToChatBtn');
        if (sendToChatBtn) {
          sendToChatBtn.disabled = !this.activeNote;
          if (this.activeNote) {
            const shortTitle = this.activeNote.title.length > 15 
              ? this.activeNote.title.substring(0, 15) + '...' 
              : this.activeNote.title;
            sendToChatBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${shortTitle}`;
          }
        }
      },

      sendNoteToChat: function() {
        if (!this.activeNote) {
          SettingsManager.showNotification('Select a note first', 'warning');
          return;
        }
        
        if (this.user === 'guest') {
          SettingsManager.showNotification('Please log in to use AI features', 'warning', 'Login Required');
          return;
        }
        
        try {
          const chatNote = {
            id: this.activeNote.id,
            title: this.activeNote.title,
            content: this.activeNote.content,
            files: this.activeNote.files || [],
            timestamp: Date.now(),
            userId: this.user
          };
          
          localStorage.setItem('chat_currentNote', JSON.stringify(chatNote));
          localStorage.setItem('chat_noteReady', 'true');
          
          SettingsManager.showNotification(
            'Note prepared for AI Assistant! Click the AI button to continue',
            'chat',
            'Ready for AI',
            5000
          );
          
        } catch (error) {
          console.error('Error sending note to chat:', error);
          SettingsManager.showNotification('Failed to prepare note for AI', 'error');
        }
      },

      renderTopicList: function(filteredNotes = this.notes) {
        const topicList = document.getElementById('topicList');
        if (!topicList) return;

        topicList.innerHTML = "";

        if (!filteredNotes || filteredNotes.length === 0) {
          topicList.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-sticky-note empty-icon"></i>
              <h3>No notes yet</h3>
              <p>Create your first note or upload files to get started</p>
            </div>
          `;
          return;
        }

        filteredNotes.forEach(note => {
          const li = document.createElement("li");
          li.className = "topic-item-box";
          if (this.activeNote && this.activeNote.id === note.id) {
            li.classList.add("active");
          }
          li.dataset.id = note.id;

          const hasFiles = note.files && note.files.length > 0;
          const fileIcon = hasFiles ? `<span class="file-indicator">📎 ${note.files.length}</span>` : '';
          
          let preview = note.content || "";
          if (hasFiles) {
            preview = `${note.files.length} attached file${note.files.length > 1 ? 's' : ''}`;
          } else {
            preview = preview.replace(/\s+/g, ' ').trim().substring(0, 100);
            if (preview.length >= 100) preview += '...';
          }
          
          const date = this.formatDate(note.updatedAt || note.createdAt);
          
          li.innerHTML = `
            <div class="topic-content-box">
              <div class="topic-title-box">
                <span class="topic-title">${fileIcon}${note.title || 'Untitled'}</span>
                <span class="date-badge">${date}</span>
              </div>
              <div class="topic-preview-box">
                ${preview || 'No content'}
              </div>
            </div>
          `;

          li.addEventListener("click", () => {
            this.loadNote(note);
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
              document.querySelector('.sidebar').classList.remove('show');
              document.querySelector('.sidebar-overlay').style.display = 'none';
            }
          });

          topicList.appendChild(li);
        });
      },

      searchNotes: function(term) {
        const q = term.toLowerCase().trim();
        if (!q) {
          this.renderTopicList(this.notes);
          return;
        }
        
        const filtered = this.notes.filter(note => {
          const inTitle = (note.title || "").toLowerCase().includes(q);
          const inContent = (note.content || "").toLowerCase().includes(q);
          const inFiles = note.files?.some(file => 
            file.name.toLowerCase().includes(q)
          ) || false;
          const inTags = note.tags?.some(tag => 
            tag.toLowerCase().includes(q)
          ) || false;
          return inTitle || inContent || inFiles || inTags;
        });
        
        this.renderTopicList(filtered);
      },

      bindEvents: function() {
        // Note actions
        document.getElementById('newNoteBtn').addEventListener('click', () => this.createNewNote());
        document.getElementById('saveNoteBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('deleteNoteBtn').addEventListener('click', () => this.deleteNote());
        document.getElementById('sendToChatBtn').addEventListener('click', () => this.sendNoteToChat());
        
        // File upload
        document.getElementById('uploadFileBtn').addEventListener('click', () => {
          document.getElementById('fileUpload').click();
        });
        
        document.getElementById('fileUpload').addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
          this.searchNotes(e.target.value);
        });
        
        // Modal
        document.getElementById('modalConfirm').addEventListener('click', () => this.createFileNote());
        document.getElementById('modalCancel').addEventListener('click', () => this.cancelFileUpload());
        
        // File viewer
        document.getElementById('closeViewerBtn').addEventListener('click', () => this.closeFileViewer());
        
        // Toggle sidebar
        document.getElementById('toggleSidebarBtn').addEventListener('click', () => this.toggleSidebar());
        document.querySelector('.sidebar-overlay').addEventListener('click', () => this.toggleSidebar());
      },

      setupAutoSave: function() {
        const noteTitle = document.getElementById('noteTitle');
        const noteContent = document.getElementById('noteContent');
        
        const triggerAutoSave = () => {
          if (!this.activeNote) return;
          if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
          this.autoSaveTimer = setTimeout(() => this.saveNote(), 2000);
        };
        
        if (noteTitle) noteTitle.addEventListener('input', triggerAutoSave);
        if (noteContent) noteContent.addEventListener('input', triggerAutoSave);
      },

      setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
          // Ctrl/Cmd + S to save
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveNote();
          }
          
          // Ctrl/Cmd + N for new note
          if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.createNewNote();
          }
          
          // Escape to close modals/sidebar
          if (e.key === 'Escape') {
            if (document.getElementById('fileViewerModal').classList.contains('show')) {
              this.closeFileViewer();
            }
            if (document.getElementById('fileModal').classList.contains('show')) {
              this.cancelFileUpload();
            }
            if (window.innerWidth <= 768 && document.querySelector('.sidebar').classList.contains('show')) {
              this.toggleSidebar();
            }
          }
        });
      },

      toggleSidebar: function() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
          sidebar.classList.toggle('show');
          overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
        } else {
          sidebar.classList.toggle('collapsed');
        }
      },

      // File management methods
      readFileAsBase64: function(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      },

      async handleFileUpload(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;
        
        event.target.value = '';
        
        this.pendingFiles = [];
        let extractedText = "";
        
        try {
          for (const file of files) {
            const base64Data = await this.readFileAsBase64(file);
            const fileObj = {
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64Data
            };
            this.pendingFiles.push(fileObj);
            
            if (files.length === 1 && this.canExtractText(file.type)) {
              const text = this.extractTextFromBase64(base64Data);
              if (text.trim()) {
                extractedText = text;
              }
            }
          }
          
          if (this.activeNote) {
            // Add files to existing note
            this.activeNote.files = [...(this.activeNote.files || []), ...this.pendingFiles];
            this.renderFileList(this.activeNote.files);
            document.getElementById('filePreviewSection').style.display = 'block';
            this.saveNote();
            SettingsManager.showNotification(`${this.pendingFiles.length} file(s) attached`, 'success');
            this.pendingFiles = [];
          } else {
            // Create new note from files
            const defaultName = files.length === 1 ? 
              files[0].name.replace(/\.[^/.]+$/, "") : 
              `${files.length} Files`;
            document.getElementById('fileNameInput').value = defaultName;
            document.getElementById('fileNameInput').dataset.extractedText = extractedText;
            document.getElementById('fileNameInput').focus();
            document.getElementById('fileModal').classList.add('show');
          }
        } catch (error) {
          console.error('Error uploading files:', error);
          SettingsManager.showNotification('Error uploading files', 'error');
        }
      },

      createFileNote: function() {
        const title = document.getElementById('fileNameInput').value.trim() || "File Note";
        const extractedText = document.getElementById('fileNameInput').dataset.extractedText || "";
        
        this.createNewNote(title, this.pendingFiles, extractedText);
        this.pendingFiles = [];
        document.getElementById('fileModal').classList.remove('show');
      },

      cancelFileUpload: function() {
        this.pendingFiles = [];
        document.getElementById('fileModal').classList.remove('show');
      },

      renderFileList: function(files) {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;
        
        fileList.innerHTML = '';
        
        if (!files || files.length === 0) {
          fileList.innerHTML = '<div class="empty-state" style="padding: 20px;">No files attached</div>';
          return;
        }
        
        files.forEach((file, index) => {
          const fileItem = document.createElement('div');
          fileItem.className = 'file-item';
          
          const canView = this.canViewFile(file.type);
          const canExtract = this.canExtractText(file.type);
          
          fileItem.innerHTML = `
            <div class="file-info" ${canView ? `onclick="NotesManager.viewFile(${index})" style="cursor: pointer;"` : ''}>
              <span class="file-icon-large">${this.getFileIcon(file.type)}</span>
              <div class="file-details">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${this.formatFileSize(file.size)} • ${file.type.split('/')[1] || file.type}</div>
              </div>
            </div>
            <div class="file-actions">
              ${canExtract ? `<button class="file-action-btn extract-btn" onclick="NotesManager.extractTextFromFile(${index})"><i class="fas fa-file-alt"></i> Extract</button>` : ''}
              ${canView ? `<button class="file-action-btn view-btn" onclick="NotesManager.viewFile(${index})"><i class="fas fa-eye"></i> View</button>` : ''}
              <button class="file-action-btn send-chat-btn" onclick="NotesManager.sendFileToChat(${index})"><i class="fas fa-paper-plane"></i> Send</button>
              <button class="file-action-btn remove-btn" onclick="NotesManager.removeFile(${index})"><i class="fas fa-trash"></i></button>
            </div>
          `;
          fileList.appendChild(fileItem);
        });
      },

      viewFile: function(index) {
        if (!this.activeNote || !this.activeNote.files || !this.activeNote.files[index]) return;
        
        const file = this.activeNote.files[index];
        this.currentViewingFile = file;
        
        document.getElementById('viewerTitle').textContent = file.name;
        const viewerBody = document.getElementById('viewerBody');
        viewerBody.innerHTML = '';
        
        if (file.type.startsWith('image/')) {
          viewerBody.innerHTML = `<img src="${file.data}" class="image-viewer" alt="${file.name}">`;
        } else if (file.type.includes('pdf')) {
          viewerBody.innerHTML = `<iframe src="${file.data}" class="pdf-viewer" style="width: 100%; height: 70vh; border: none;"></iframe>`;
        } else if (file.type.includes('text')) {
          const textContent = this.extractTextFromBase64(file.data);
          viewerBody.innerHTML = `<pre class="text-viewer" style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; overflow: auto; max-height: 70vh;">${textContent}</pre>`;
        } else {
          viewerBody.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--muted-weak);">
              <div style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;">📄</div>
              <h3 style="margin-bottom: 10px;">File cannot be viewed inline</h3>
              <p>This file type (${file.type}) is not supported for inline viewing.</p>
              <a href="${file.data}" download="${file.name}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: var(--mature-accent); color: white; border-radius: 8px; text-decoration: none;">
                <i class="fas fa-download"></i> Download File
              </a>
            </div>
          `;
        }
        
        document.getElementById('fileViewerModal').classList.add('show');
      },

      extractTextFromFile: function(index) {
        if (!this.activeNote || !this.activeNote.files || !this.activeNote.files[index]) return;
        
        const file = this.activeNote.files[index];
        if (!this.canExtractText(file.type)) {
          SettingsManager.showNotification('Cannot extract text from this file type', 'warning');
          return;
        }
        
        const textContent = this.extractTextFromBase64(file.data);
        if (textContent.trim()) {
          const currentContent = document.getElementById('noteContent').value;
          const separator = currentContent ? '\n\n--- Extracted from file ---\n\n' : '';
          document.getElementById('noteContent').value = currentContent + separator + `File: ${file.name}\n\n${textContent}`;
          
          this.saveNote();
          SettingsManager.showNotification('Text extracted into note', 'success', 'Extraction Complete');
        } else {
          SettingsManager.showNotification('No text content could be extracted', 'warning');
        }
      },

      sendFileToChat: function(index) {
        if (!this.activeNote || !this.activeNote.files || !this.activeNote.files[index]) return;
        
        const file = this.activeNote.files[index];
        
        if (this.user === 'guest') {
          SettingsManager.showNotification('Please log in to use AI features', 'warning', 'Login Required');
          return;
        }
        
        const chatFile = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: file.data
        };
        
        localStorage.setItem('chat_currentFile', JSON.stringify(chatFile));
        localStorage.setItem('chat_fileReady', 'true');
        
        SettingsManager.showNotification(
          'File prepared for AI analysis!',
          'chat',
          'Ready for AI',
          5000
        );
      },

      removeFile: function(index) {
        if (!this.activeNote || !this.activeNote.files) return;
        
        this.activeNote.files.splice(index, 1);
        this.renderFileList(this.activeNote.files);
        
        if (this.activeNote.files.length === 0) {
          document.getElementById('filePreviewSection').style.display = 'none';
        }
        
        this.saveNote();
        SettingsManager.showNotification('File removed from note', 'info');
      },

      closeFileViewer: function() {
        document.getElementById('fileViewerModal').classList.remove('show');
        this.currentViewingFile = null;
      }
    };

    // ====== INITIALIZE EVERYTHING ======
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Settings Manager
      SettingsManager.init();
      
      // Initialize Notes Manager
      NotesManager.init();
      
      // Expose managers to window for onclick handlers
      window.NotesManager = NotesManager;
      window.SettingsManager = SettingsManager;
      
      // Update homepage stats
      NotesManager.updateHomepageStats();
      
      // Handle mobile sidebar
      if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.add('collapsed');
      }
      
      // Listen for resize events
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          document.querySelector('.sidebar').classList.remove('collapsed');
        } else {
          document.querySelector('.sidebar').classList.add('collapsed');
        }
      });
    });
  </script>
</body>
</html>
