let setupSeats = [];
let currentSetupScript = 'trouble_brewing';
let setupFocusedSeatId = null;

function openSetup() {
  setupSeats = seats.map(s => ({
    id: s.id, name: s.name || '', role: s.role || null, alive: s.alive !== false,
    markers: s.markers ? [...s.markers] : [],
    notes: typeof s.notes === 'string' ? s.notes : '',
    reminder: Array.isArray(s.reminder) ? [...s.reminder] : []
  }));
  currentSetupScript = currentScript || 'trouble_brewing';
  setupFocusedSeatId = setupSeats[0] ? setupSeats[0].id : null;
  document.getElementById('setupBackdrop').classList.add('open');
  document.getElementById('setupModal').classList.add('open');
  renderSetupPlayers();
  renderSetupScriptTabs();
  renderSetupRolePool();
  updateSetupRoleCounter();
  document.getElementById('setupSeatCount').textContent = String(setupSeats.length);
}

function closeSetupModal() {
  const backdrop = document.getElementById('setupBackdrop');
  const modal = document.getElementById('setupModal');
  const phase1 = document.getElementById('setupPhase1');
  if (backdrop) backdrop.classList.remove('open');
  if (modal) { modal.classList.remove('open'); modal.style.display = 'none'; }
  // Phase 1 ist ein Vollbild-Overlay — auch schließen falls aktiv
  if (phase1) phase1.style.display = 'none';
}

function applySetup() {
  currentScript = currentSetupScript;
  if (typeof gameSetup !== 'undefined' && gameSetup) gameSetup.script = currentSetupScript;
  seats = setupSeats.map(s => ({
    id: s.id, name: s.name || '', role: s.role || null, alive: s.alive !== false,
    markers: s.markers ? [...s.markers] : [],
    notes: typeof s.notes === 'string' ? s.notes : '',
    reminder: Array.isArray(s.reminder) ? [...s.reminder] : []
  }));
  const scriptLabelEl = document.getElementById('scriptLabel');
  if (scriptLabelEl) scriptLabelEl.textContent = SCRIPT_LABELS[currentSetupScript] || currentSetupScript;
  closeSetupModal();
  buildNightOrder();
  draw();
  renderPanel();
  updateNightLabel();
  // Update background when setup is finished
  updatePhaseBackground(currentScript, 'day');
  scheduleSave();
}

function getScriptRoleIds() {
  const script = SCRIPT_ROLES[currentSetupScript];
  if (!script) return [];
  return (script.townsfolk || [])
    .concat(script.outsiders || [])
    .concat(script.minions || [])
    .concat(script.demons || [])
    .concat(script.travelers || []);
}

function setupModalAllowedRoleIds() {
  const allow = typeof botcAllowOutsideScriptRoles === 'function' ? botcAllowOutsideScriptRoles() : false;
  const ids = new Set();
  if (allow && typeof ROLES === 'object' && ROLES) {
    Object.keys(ROLES).forEach((k) => {
      const r = ROLES[k];
      if (r && String(r.type || '').toLowerCase() !== 'fabled') ids.add(k);
    });
  } else if (typeof expandScriptRoleIds === 'function') {
    expandScriptRoleIds(currentSetupScript).forEach((id) => ids.add(id));
  }
  setupSeats.forEach((s) => {
    const k = s.role;
    if (k && ROLES[k] && String(ROLES[k].type || '').toLowerCase() !== 'fabled') ids.add(k);
  });
  return ids;
}

function renderSetupPlayers() {
  const list = document.getElementById('setupPlayerList');
  if (!list) return;
  const assigned = new Set(setupSeats.map(s => s.role).filter(Boolean));
  const allowed = setupModalAllowedRoleIds();
  const groups = { Townsfolk: [], Outsider: [], Minion: [], Dämon: [], Traveller: [], Sonstige: [] };
  const typeMap = { townsfolk: 'Townsfolk', outsider: 'Outsider', minion: 'Minion', demon: 'Dämon', traveler: 'Traveller' };
  Object.entries(ROLES).forEach(([k, r]) => {
    if (String(r.type || '').toLowerCase() === 'fabled') return;
    if (!allowed.has(k)) return;
    const t = typeMap[(r.type || '').toLowerCase()] || 'Sonstige';
    if (!groups[t]) groups[t] = [];
    groups[t].push([k, r, assigned.has(k)]);
  });
  function esc(v) { return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  list.innerHTML = setupSeats.map(s => {
    const roleOpts = Object.entries(groups)
      .filter(([, arr]) => arr.length)
      .map(([g2, arr]) => {
      const opts = arr.map(([k, r, used]) => `<option value="${esc(k)}"${s.role === k ? ' selected' : ''}>${esc(r.name || r.n)}${used ? ' (✓)' : ''}</option>`).join('');
      return `<optgroup label="${esc(g2)}">${opts}</optgroup>`;
    }).join('');
    const aliveCls = s.alive ? ' on' : '';
    return `<div class="setupPlayerRow${s.id === setupFocusedSeatId ? ' focused' : ''}" data-seat-id="${s.id}">
      <span class="setupPlayerNum">${s.id}</span>
      <input type="text" class="setupPlayerNameIn" value="${esc(s.name || '')}" placeholder="Name" data-seat-id="${s.id}">
      <select class="setupPlayerRoleSel" data-seat-id="${s.id}"><option value="">—</option>${roleOpts}</select>
      <button type="button" class="setupPlayerAlive${aliveCls}" data-seat-id="${s.id}" aria-label="Lebend">${s.alive ? '✦' : '✝'}</button>
      <button type="button" class="setupPlayerDel" data-seat-id="${s.id}" aria-label="Entfernen">×</button>
    </div>`;
  }).join('');
  list.querySelectorAll('.setupPlayerRow').forEach(row => {
    const id = parseInt(row.getAttribute('data-seat-id'), 10);
    row.addEventListener('click', () => { setupFocusedSeatId = id; renderSetupPlayers(); renderSetupRolePool(); });
  });
  list.querySelectorAll('.setupPlayerNameIn').forEach(inp => {
    inp.addEventListener('input', () => {
      const s = setupSeats.find(x => x.id === parseInt(inp.getAttribute('data-seat-id'), 10));
      if (s) s.name = inp.value;
    });
    inp.addEventListener('click', (e) => e.stopPropagation());
  });
  list.querySelectorAll('.setupPlayerRoleSel').forEach(sel => {
    sel.addEventListener('change', () => {
      const s = setupSeats.find(x => x.id === parseInt(sel.getAttribute('data-seat-id'), 10));
      if (s) s.role = sel.value || null;
      updateSetupRoleCounter();
      renderSetupRolePool();
    });
    sel.addEventListener('click', (e) => e.stopPropagation());
  });
  list.querySelectorAll('.setupPlayerAlive').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = setupSeats.find(x => x.id === parseInt(btn.getAttribute('data-seat-id'), 10));
      if (s) { s.alive = !s.alive; renderSetupPlayers(); updateSetupRoleCounter(); }
    });
  });
  list.querySelectorAll('.setupPlayerDel').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute('data-seat-id'), 10);
      if (setupSeats.length <= 5) return;
      setupSeats = setupSeats.filter(x => x.id !== id).map((x, i) => ({ ...x, id: i + 1 }));
      setupFocusedSeatId = setupSeats[0] ? setupSeats[0].id : null;
      document.getElementById('setupSeatCount').textContent = String(setupSeats.length);
      renderSetupPlayers();
      renderSetupScriptTabs();
      renderSetupRolePool();
      updateSetupRoleCounter();
    });
  });
  document.getElementById('setupSeatMinus').onclick = () => {
    if (setupSeats.length <= 5) return;
    setupSeats = setupSeats.slice(0, -1).map((x, i) => ({ ...x, id: i + 1 }));
    document.getElementById('setupSeatCount').textContent = String(setupSeats.length);
    renderSetupPlayers();
    updateSetupRoleCounter();
  };
  document.getElementById('setupSeatPlus').onclick = () => {
    if (setupSeats.length >= 20) return;
    const nextId = setupSeats.length + 1;
    setupSeats.push({ id: nextId, name: '', role: null, alive: true, markers: [], notes: '', reminder: [] });
    document.getElementById('setupSeatCount').textContent = String(setupSeats.length);
    renderSetupPlayers();
    updateSetupRoleCounter();
  };
  document.getElementById('setupAutoNames').onclick = () => {
    setupSeats.forEach((s, i) => { if (!s.name || !s.name.trim()) s.name = 'Spieler ' + (i + 1); });
    renderSetupPlayers();
  };
}

function renderSetupScriptTabs() {
  const cont = document.getElementById('setupScriptTabs');
  cont.innerHTML = Object.entries(SCRIPT_LABELS).map(([id, label]) =>
    `<button type="button" class="setupScriptTab${currentSetupScript === id ? ' on' : ''}" data-script="${id}">${label}</button>`
  ).join('');
  cont.querySelectorAll('.setupScriptTab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSetupScript = btn.getAttribute('data-script');
      renderSetupScriptTabs();
      renderSetupRolePool();
      updateSetupRoleCounter();
    });
  });
}

function renderSetupRolePool() {
  const pool = document.getElementById('setupRolePool');
  const roleIds = getScriptRoleIds();
  const assigned = new Set(setupSeats.map(s => s.role).filter(Boolean));
  const script = SCRIPT_ROLES[currentSetupScript];
  if (!script) { pool.innerHTML = ''; return; }
  const teamDot = (t) => {
    const c = t === 'good' ? 'var(--good-hi)' : t === 'evil' ? 'var(--evil-hi)' : t === 'minion' ? 'var(--minion-hi)' : 'var(--outsider-hi)';
    return `<span class="dot" style="background:${c}"></span>`;
  };
  let html = '';
  ['townsfolk','outsiders','minions','demons','travelers'].forEach(key => {
    const ids = script[key] || [];
    if (!ids.length) return;
    const title = key === 'townsfolk' ? 'Townsfolk' : key === 'outsiders' ? 'Outsider' : key === 'minions' ? 'Minion' : key === 'travelers' ? 'Traveller' : 'Dämon';
    html += `<div class="setupRoleGroupLabel">${title}</div>`;
    ids.forEach(rid => {
      const r = ROLES[rid];
      const name = r ? (r.name || r.n) : rid;
      const team = r ? r.team : 'good';
      const used = assigned.has(rid);
      const esc = (v) => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      html += `<button type="button" class="setupRoleChip${used ? ' assigned' : ''}" data-role-id="${rid}">${teamDot(team)}<span>${esc(name)}</span>${used ? '<span class="check">✓</span>' : ''}</button>`;
    });
  });
  pool.innerHTML = html;
  pool.querySelectorAll('.setupRoleChip').forEach(btn => {
    btn.addEventListener('click', () => {
      const roleId = btn.getAttribute('data-role-id');
      if (!roleId) return;
      const target = setupFocusedSeatId != null ? setupSeats.find(s => s.id === setupFocusedSeatId) : setupSeats[0];
      if (target) { target.role = roleId; renderSetupPlayers(); renderSetupRolePool(); updateSetupRoleCounter(); }
    });
  });
}

function updateSetupRoleCounter() {
  const total = getScriptRoleIds().length;
  const assigned = setupSeats.filter(s => s.role).length;
  const el = document.getElementById('setupRoleCounter');
  el.textContent = `${assigned}/${total} Rollen vergeben`;
  const demons = setupSeats.filter(s => {
    const role = s.role && ROLES[s.role];
    return role && String(role.type).toLowerCase() === 'demon';
  }).length;
  const minions = setupSeats.filter(s => {
    const role = s.role && ROLES[s.role];
    return role && String(role.type).toLowerCase() === 'minion';
  }).length;
  const warn = (demons !== 1) || (setupSeats.length > 6 && minions < 1);
  el.classList.toggle('warn', !!warn);
}

function resetToDemo() {
  clearSavedState();

  dayNumber = 1;
  nightNumber = 1;
  currentScript = 'trouble_brewing';
  seats = [];
  nightSteps = [];
  setupSeats = [];
  if (typeof demonBluffRoleIds !== 'undefined') demonBluffRoleIds = [];
  if (typeof spyViewMode !== 'undefined') spyViewMode = false;

  const nightLabel = document.getElementById('nightLabel');
  if (nightLabel) nightLabel.textContent = '☀ Tag 1';

  const phaseBtn = document.getElementById('phaseToggleBtn');
  if (phaseBtn) {
    phaseBtn.textContent = '☀️';
    phaseBtn.title = 'Tag läuft - klick für Nacht';
  }
  closeSetupModal();
  closeSummaryModal();
  draw();
  if (typeof showToast === 'function') {
    showToast('Spielstand zurückgesetzt ✓', 2000);
  }
}
