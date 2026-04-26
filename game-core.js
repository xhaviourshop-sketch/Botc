function botcStoryLogSnapshot() {
  if (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.getEntries === 'function') {
    return window.BOTC.StoryLog.getEntries();
  }
  return [];
}
function botcStoryLogRestore(raw) {
  if (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.loadFromState === 'function') {
    var arr = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.storyLog) ? raw.storyLog : []);
    window.BOTC.StoryLog.loadFromState(arr);
  }
}
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    const fabledSnap = (typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) ? activeFabledIds.slice() : [];
    const storySnap = botcStoryLogSnapshot();
    const bluffSnap = (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(demonBluffRoleIds)) ? demonBluffRoleIds.slice(0, 8) : [];
    const state = {
      seats,
      nightNumber,
      panelOpen,
      script: currentScript,
      activeFabledIds: fabledSnap,
      storyLog: storySnap,
      demonBluffRoleIds: bluffSnap,
      spyViewMode: typeof spyViewMode !== 'undefined' ? !!spyViewMode : false
    };
    if (window.BOTC && window.BOTC.State && typeof window.BOTC.State.save === 'function') {
      window.BOTC.State.save({
        meta: { version: 2 },
        seats,
        nightOrder: { nightNumber },
        ui: { panelCollapsed: !panelOpen, spyViewMode: typeof spyViewMode !== 'undefined' ? !!spyViewMode : false },
        script: typeof currentScript !== 'undefined' ? currentScript : null,
        activeFabledIds: fabledSnap,
        storyLog: storySnap,
        demonBluffRoleIds: bluffSnap
      });
    } else {
      try { localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state)); } catch (_) {}
    }
  }, 300);
}
function loadSavedState() {
  if (window.BOTC && window.BOTC.State && typeof window.BOTC.State.load === 'function') {
    const s = window.BOTC.State.load();
    if (s && Array.isArray(s.seats) && s.seats.length) {
      seats = s.seats.map(seat => ({
        id: seat.id,
        name: seat.name || '',
        role: seat.role != null ? seat.role : (seat.roleId || null),
        alive: seat.alive !== false,
        markers: Array.isArray(seat.markers) ? seat.markers : [],
        notes: typeof seat.notes === 'string' ? seat.notes : '',
        claim: typeof seat.claim === 'string' ? seat.claim : '',
        reminder: Array.isArray(seat.reminder) ? seat.reminder : [],
        ghostVoteUsed: !!seat.ghostVoteUsed
      }));
      nightNumber = (s.nightOrder && s.nightOrder.nightNumber != null) ? s.nightOrder.nightNumber : 1;
      panelOpen = !(s.ui && s.ui.panelCollapsed);
      if (typeof spyViewMode !== 'undefined') {
        spyViewMode = (s.ui && typeof s.ui.spyViewMode === 'boolean') ? s.ui.spyViewMode : false;
      }
      if (typeof demonBluffRoleIds !== 'undefined') {
        demonBluffRoleIds = Array.isArray(s.demonBluffRoleIds) ? s.demonBluffRoleIds.filter(Boolean) : [];
      }
      if (s.script) {
        currentScript = s.script;
        if (typeof gameSetup !== 'undefined' && gameSetup) gameSetup.script = s.script;
      }
      updateScriptLabelFromCurrent();
      if (typeof setActiveFabledIdsFromArray === 'function') {
        setActiveFabledIdsFromArray(s.activeFabledIds);
      }
      botcStoryLogRestore(s.storyLog);
      // If a game was in progress, also restore gameSetup.seats from seats
      if (gameSetup.gameStarted && seats.length && !gameSetup.seats.length) {
        gameSetup.seats = seats.map(function(s) {
          return {
            id: s.id,
            name: s.name || '',
            roleId: s.role || s.roleId || null,
            team: s.team || 'good',
            alive: s.alive !== false
          };
        });
      }
      return true;
    }
    return false;
  }
  try {
    const raw = localStorage.getItem(DEMO_STATE_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (state && Array.isArray(state.seats) && state.seats.length) {
      seats = state.seats.map(seat => ({
        id: seat.id,
        name: seat.name || '',
        role: seat.role != null ? seat.role : (seat.roleId || null),
        alive: seat.alive !== false,
        markers: Array.isArray(seat.markers) ? seat.markers : [],
        notes: typeof seat.notes === 'string' ? seat.notes : '',
        claim: typeof seat.claim === 'string' ? seat.claim : '',
        reminder: Array.isArray(seat.reminder) ? seat.reminder : [],
        ghostVoteUsed: !!seat.ghostVoteUsed
      }));
      nightNumber = state.nightNumber != null ? state.nightNumber : 1;
      panelOpen = state.panelOpen !== false;
      if (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(state.demonBluffRoleIds)) {
        demonBluffRoleIds = state.demonBluffRoleIds.filter(Boolean);
      }
      if (typeof spyViewMode !== 'undefined') {
        spyViewMode = typeof state.spyViewMode === 'boolean' ? state.spyViewMode : false;
      }
      if (state.script) {
        currentScript = state.script;
        if (typeof gameSetup !== 'undefined' && gameSetup) gameSetup.script = state.script;
      }
      updateScriptLabelFromCurrent();
      if (typeof setActiveFabledIdsFromArray === 'function') {
        setActiveFabledIdsFromArray(state.activeFabledIds);
      }
      botcStoryLogRestore(state.storyLog);
      // If a game was in progress, also restore gameSetup.seats from seats
      if (gameSetup.gameStarted && seats.length && !gameSetup.seats.length) {
        gameSetup.seats = seats.map(function(s) {
          return {
            id: s.id,
            name: s.name || '',
            roleId: s.role || s.roleId || null,
            team: s.team || 'good',
            alive: s.alive !== false
          };
        });
      }
      return true;
    }
  } catch (_) {}
  return false;
}
function updateScriptLabelFromCurrent() {
  const el = document.getElementById('scriptLabel');
  if (el) el.textContent = SCRIPT_LABELS[currentScript] || currentScript;
}
function clearSavedState() {
  if (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.clear === 'function') {
    try { window.BOTC.StoryLog.clear(true); } catch (_) {}
  }
  if (window.BOTC && window.BOTC.State && typeof window.BOTC.State.clear === 'function') {
    try { window.BOTC.State.clear(); } catch (_) {}
  }
  try { localStorage.removeItem(DEMO_STATE_KEY); } catch (_) {}
  try { localStorage.removeItem('botc_state'); } catch (_) {}
  try { localStorage.removeItem('botc_game'); } catch (_) {}
  try { sessionStorage.clear(); } catch (_) {}
  if (typeof setActiveFabledIdsFromArray === 'function') setActiveFabledIdsFromArray([]);
  console.log('[RESET] State gelöscht');
}

function exportGame() {
  const payload = {
    exportedAt: new Date().toISOString(),
    script: currentScript,
    nightNumber,
    storyLog: botcStoryLogSnapshot(),
    activeFabledIds: (typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) ? activeFabledIds.slice() : [],
    demonBluffRoleIds: (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(demonBluffRoleIds)) ? demonBluffRoleIds.slice() : [],
    seats: seats.map(s => ({
      id: s.id, name: s.name || '', role: s.role || null, alive: s.alive !== false,
      markers: Array.isArray(s.markers) ? s.markers : [],
      reminder: Array.isArray(s.reminder) ? s.reminder : [],
      notes: typeof s.notes === 'string' ? s.notes : '',
      claim: typeof s.claim === 'string' ? s.claim : ''
    }))
  };
  const json = JSON.stringify(payload, null, 2);
  const now = new Date();
  const filename = 'botc-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0') + '-' + String(now.getHours()).padStart(2,'0') + String(now.getMinutes()).padStart(2,'0') + '.json';
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      const file = new File([json], filename, { type: 'application/json' });
      navigator.share({ title: 'BotC Grimoire', text: 'Spielstand', files: [file] }).catch(() => downloadTextFile(json, filename));
    } else {
      downloadTextFile(json, filename);
    }
  } catch (_) {
    downloadTextFile(json, filename);
  }
}
function downloadTextFile(content, filename) {
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
  a.download = filename;
  a.click();
}
function onImportFile(ev) {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const data = JSON.parse(r.result);
      if (!data || !Array.isArray(data.seats) || !data.seats.length) {
        alert('Ungültige Datei');
        ev.target.value = '';
        return;
      }
      seats = data.seats.map(seat => ({
        id: seat.id,
        name: seat.name || '',
        role: seat.role != null ? seat.role : (seat.roleId || null),
        alive: seat.alive !== false,
        markers: Array.isArray(seat.markers) ? seat.markers : [],
        notes: typeof seat.notes === 'string' ? seat.notes : '',
        claim: typeof seat.claim === 'string' ? seat.claim : '',
        reminder: Array.isArray(seat.reminder) ? seat.reminder : [],
        ghostVoteUsed: !!seat.ghostVoteUsed
      }));
      if (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(data.demonBluffRoleIds)) {
        demonBluffRoleIds = data.demonBluffRoleIds.filter(Boolean);
      }
      if (data.nightNumber != null) nightNumber = data.nightNumber;
      botcStoryLogRestore(data.storyLog);
      if (typeof setActiveFabledIdsFromArray === 'function') {
        setActiveFabledIdsFromArray(data.activeFabledIds);
      }
      if (data.script) {
        currentScript = data.script;
        if (typeof gameSetup !== 'undefined' && gameSetup) gameSetup.script = data.script;
      }
      const scriptLabelEl = document.getElementById('scriptLabel');
      if (scriptLabelEl && SCRIPT_LABELS[currentScript]) scriptLabelEl.textContent = SCRIPT_LABELS[currentScript];
      updateNightLabel();
      closePopup();
      selectedId = null;
      buildNightOrder();
      draw();
      renderPanel();
      if (typeof window.renderJournalPanel === 'function') window.renderJournalPanel();
      scheduleSave();
    } catch (_) {
      alert('Ungültige Datei');
    }
    ev.target.value = '';
  };
  r.readAsText(f);
}

// ═══════════════ DEMO DATA ═══════════════
function demo(mode, btn) {
  document.querySelectorAll('.demoBtn').forEach(b=>b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  if (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.clear === 'function') {
    try { window.BOTC.StoryLog.clear(true); } catch (_) {}
  }

  if (mode === 'empty') {
    seats = Array.from({length:8},(_,i)=>mk(i+1));
  } else if (mode === 'mid') {
    seats = [
      mk(1,'Anna',   'washerwoman',  true),
      mk(2,'Ben',    'empath',       true,  ['Poisoned']),
      mk(3,'Clara',  'imp',          true),
      mk(4,'David',  'poisoner',     true),
      mk(5,'Eva',    'fortune_teller',true, ['Protected']),
      mk(6,'Felix',  'saint',        true),
      mk(7,'Greta',  'monk',         true),
      mk(8,'Hans',   'drunk',        true,  ['Drunk']),
    ];
  } else if (mode === 'big') {
    seats = [
      mk(1,'Anna',  'washerwoman', true),
      mk(2,'Ben',   'empath',      true,  ['Poisoned']),
      mk(3,'Clara', 'imp',         true),
      mk(4,'David', 'poisoner',    true),
      mk(5,'Eva',   'fortune_teller',true,['Protected']),
      mk(6,'Felix', 'saint',       false),
      mk(7,'Greta', 'monk',        true),
      mk(8,'Hans',  'drunk',       true,  ['Drunk']),
      mk(9,'Ida',   'chef',        true),
      mk(10,'Jan',  'spy',         true),
      mk(11,'Klara','undertaker',  true),
      mk(12,'Leo',  'scarlet_woman',true),
    ];
  } else if (mode === 'night') {
    seats = [
      mk(1,'Anna',  'washerwoman', true),
      mk(2,'Ben',   'empath',      true),
      mk(3,'Clara', 'imp',         true),
      mk(4,'David', 'poisoner',    true),
      mk(5,'Eva',   'fortune_teller',true),
      mk(6,'Felix', 'mayor',       true),
    ];
    nightNumber = 2;
  }

  selectedId = null;
  popupId = null;
  closePopup();
  buildNightOrder();
  draw();
  renderPanel();
  updateNightLabel();
  if (typeof setActiveFabledIdsFromArray === 'function') setActiveFabledIdsFromArray([]);
  scheduleSave();
}

function mk(id, name='', role=null, alive=true, markers=[], notes='', reminder=[], claim='') {
  return { id, name, role, alive, markers: [...markers], notes: notes || '', claim: claim || '', reminder: Array.isArray(reminder) ? [...reminder] : [] };
}

// Execution & conditional night-order tracking
if (typeof window.BOTC_executedToday === 'undefined') window.BOTC_executedToday = false;
if (typeof window.BOTC_executedSeatId === 'undefined') window.BOTC_executedSeatId = null;

// ═══════════════ NIGHT ORDER ═══════════════
function generateNightOrderForSeats(seats, isFirstNight) {
  const steps = [];

  if (!Array.isArray(seats) || seats.length === 0) {
    return steps;
  }

  // 1. Sammle alle Rollen die tatsächlich zugewiesen sind
  const assignedRoleIds = seats
    .map(s => s.roleId || s.role)
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // Nur unique

  if (typeof window !== 'undefined' && window.BOTC_DEBUG_NIGHT_ORDER) {
    console.log('[NIGHT-ORDER] Assigned roles:', assignedRoleIds);
  }

  // 2. Für jede zugewiesene Rolle
  for (const roleId of assignedRoleIds) {
    const role = ROLES[roleId] || null;
    if (!role) {
      console.warn('[NIGHT-ORDER] Role not found:', roleId);
      continue;
    }

    // Hole die Night Order für diese Rolle
    const nightOrders = isFirstNight
      ? (role.nightOrder && role.nightOrder.firstNight ? role.nightOrder.firstNight : [])
      : (role.nightOrder && role.nightOrder.otherNights ? role.nightOrder.otherNights : []);

    // Conditional roles: skip if their trigger condition is not met
    if (!isFirstNight) {
      // Undertaker: only wakes if someone was executed today
      if (roleId === 'undertaker' && !window.BOTC_executedToday) {
        continue;
      }
      // Ravenkeeper: only wakes the night they die (check if their seat is dead)
      if (roleId === 'ravenkeeper') {
        const rkSeat = seats.find(s => (s.roleId || s.role) === 'ravenkeeper');
        if (!rkSeat || rkSeat.alive !== false) continue;
      }
    }

    // 3. Für jeden Night-Order-Eintrag dieser Rolle
    for (const noEntry of nightOrders) {
      if (!noEntry) continue;

      const seatWithRole = seats.find(s => (s.roleId || s.role) === roleId);

      steps.push({
        id: roleId + '_' + (noEntry.key || noEntry.order),
        label: noEntry.label || roleId,
        roleId: roleId,
        order: noEntry.order || 100,
        phase: noEntry.phase || 'other',
        seatId: seatWithRole ? seatWithRole.id : null,
        type: noEntry.type || 'ability',
        done: false,
        note: ''
      });
    }
  }

  // 4. Sortiere nach 'order' Feld
  steps.sort((a, b) => a.order - b.order);

  if (typeof window !== 'undefined' && window.BOTC_DEBUG_NIGHT_ORDER) {
    console.log('[NIGHT-ORDER] Final steps:', steps);
  }

  return steps;
}

/**
 * Entwurfs-JSON für Nachspiel / Clocktracker (kein offizieller API-Vertrag — manuell importieren oder Felder übernehmen).
 */
function botcExportClocktrackerDraft() {
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const gr = (typeof seats !== 'undefined' && Array.isArray(seats)) ? seats.map(function (s) {
    const rid = s.role || s.roleId || null;
    const r = rid && typeof ROLES !== 'undefined' ? ROLES[rid] : null;
    return {
      seatOrder: s.id,
      playerName: s.name || '',
      roleId: rid,
      roleName: r ? (r.name || r.n || rid) : null,
      alive: s.alive !== false,
      claim: typeof s.claim === 'string' ? s.claim : ''
    };
  }) : [];
  const bl = (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(demonBluffRoleIds)) ? demonBluffRoleIds.filter(Boolean) : [];
  const payload = {
    format: 'botc-storyteller-clocktracker-draft',
    version: 1,
    exportedAt: new Date().toISOString(),
    note: 'Kein garantiertes Clocktracker-Format — Daten in clocktracker.app / eigenes Log übernehmen.',
    script: typeof currentScript !== 'undefined' ? currentScript : null,
    scriptLabel: typeof SCRIPT_LABELS !== 'undefined' && currentScript ? (SCRIPT_LABELS[currentScript] || currentScript) : null,
    playerCount: gr.length,
    nightNumber: typeof nightNumber !== 'undefined' ? nightNumber : 1,
    demonBluffRoleIds: bl,
    demonBluffLabels: bl.map(function (id) {
      var R = typeof ROLES !== 'undefined' ? ROLES[id] : null;
      return R ? (R.name || R.n || id) : id;
    }),
    grimoire: gr,
    storyLogPlain: (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.toPlainText === 'function') ? window.BOTC.StoryLog.toPlainText() : ''
  };
  var json = JSON.stringify(payload, null, 2);
  var fn = 'botc-clocktracker-draft-' + new Date().toISOString().slice(0, 10) + '.json';
  if (typeof downloadTextFile === 'function') downloadTextFile(json, fn);
  else {
    try {
      var a = document.createElement('a');
      a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
      a.download = fn;
      a.click();
    } catch (_) {}
  }
  if (typeof showToast === 'function') showToast('Clocktracker-Entwurf exportiert: ' + fn, 3500);
}
window.botcExportClocktrackerDraft = botcExportClocktrackerDraft;

function buildNightOrder() {
  const isFirst = nightNumber === 1;
  const steps = generateNightOrderForSeats(seats, isFirst);
  const dusk = { id: 'dusk', label: '☽  Dusk – Nacht beginnt', system: true, done: false };
  const dawn = { id: 'dawn', label: '☀  Dawn – Ergebnisse bekannt geben', system: true, done: false };
  nightSteps = [dusk, ...steps, dawn];
}

function nextStep() {
  const current = nightSteps.find(s => !s.done);
  if (!current) return;
  current.done = true;
  const next = nightSteps.find(s => !s.done);
  if (next && next.seatId) {
    selectedId = next.seatId;
    if (typeof closePopup === 'function') closePopup();
    draw();

    // Trigger ability popup if available
    const roleKey = next.roleId || next.id;
    if (roleKey && window.BOTC_ABILITIES && window.BOTC_ABILITIES[roleKey]) {
      try {
        const ctx = window.BOTC_buildCtx ? window.BOTC_buildCtx(next.seatId) : null;
        if (ctx) {
          window.BOTC_ABILITIES[roleKey](ctx);
        }
      } catch(e) {
        console.warn('[ABILITY] Fehler bei', roleKey, e);
      }
    }
  } else if (next && !next.seatId && !next.system) {
    draw();
  } else {
    draw();
    if (popupId && next && !next.seatId) closePopup();
  }
  renderNightOrder();
  if (assistantMode) {
    updateTopBarForAssistant();
    scrollNightOrderToCurrent();
    if (next && next.id === 'dawn') showNightCompleteToast();
  }
}

function prevStep() {
  if (!assistantMode) return;
  const idx = nightSteps.map(s => s.done).lastIndexOf(true);
  if (idx < 0) return;
  nightSteps[idx].done = false;
  const st = nightSteps[idx];
  if (st.seatId) {
    selectedId = st.seatId;
    if (typeof closePopup === 'function') closePopup();
    draw();
  } else {
    selectedId = null;
    closePopup();
    draw();
  }
  renderNightOrder();
  updateTopBarForAssistant();
  scrollNightOrderToCurrent();
}

function newNight() {
  // Reset per-night ability state (monk protection, poisoner target, demon kill, etc.)
  // "once" flags (slayer, virgin, etc.) intentionally NOT reset — they are once per game
  if (window.BOTC_STATE && window.BOTC_STATE.night) {
    window.BOTC_STATE.night.tb  = {};
    window.BOTC_STATE.night.bmr = {};
  }

  // Reset per-night seat flags (drunkUntilDusk, protectedUntilDusk, exorcistTargetTonight)
  if (Array.isArray(seats)) {
    seats.forEach(function(s) {
      if (s.flags) {
        delete s.flags.drunkUntilDusk;
        delete s.flags.protectedUntilDusk;
        delete s.flags.exorcistTargetTonight;
        delete s.flags.cannotDieAtNight;
        delete s.flags.markedToDieTonight;
        // Per-Nacht Fähigkeits-Flags: laufen bei Morgengrauen ab
        delete s.flags.poisoned;           // Giftmischer: nur eine Nacht gültig
        delete s.flags.protected;          // Mönch: visuell (Check via monkProtectedSeatId)
        delete s.flags.witched;            // Hexe: Fluch endet nach einem Tag
        delete s.flags.madAsMinion;        // Cerenovus: endet nach einem Tag
        delete s.flags.daProtectedTomorrow; // Teufelsadvokat: endet nach einem Tag
      }
    });
  }

  // Reset execution tracking for new night (Undertaker only sees today's execution)
  window.BOTC_executedToday = false;
  window.BOTC_executedSeatId = null;

  nightNumber++;
  if (typeof window.botcStoryLogAppend === 'function') {
    window.botcStoryLogAppend('Nacht ' + nightNumber + ' beginnt (Neue Nacht / Zusammenfassung)');
  }
  if (assistantMode) showToast(`Nacht ${nightNumber} beginnt`, 3000);
  nightSteps.forEach(s => { s.done = false; });
  buildNightOrder();
  updateNightLabel();
  updatePhaseBackground(currentScript, 'night');
  draw();
  renderNightOrder();
  if (assistantMode) {
    updateTopBarForAssistant();
    scrollNightOrderToCurrent();
  }
  scheduleSave();
}

function updateNightLabel() {
  const nl = document.getElementById('nightLabel');
  nl.textContent = `☽ Nacht ${nightNumber}`;
  nl.classList.remove('pulse');
  void nl.offsetWidth; // reflow to restart animation
  nl.classList.add('pulse');
  const pb = document.getElementById('panelNightBadge');
  if (pb) pb.textContent = `Nacht ${nightNumber}`;
}

var _phaseToggleBusy = false;
function togglePhase() {
  if (_phaseToggleBusy) return;
  _phaseToggleBusy = true;
  setTimeout(function() { _phaseToggleBusy = false; }, 600);

  const btn = document.getElementById('phaseToggleBtn');
  if (!btn) return;

  const isNight = btn.textContent.includes('🌙');

  if (isNight) {
    // Nacht → Tag: neue Tag → Nominierungen zurücksetzen
    if (typeof nominationLog !== 'undefined') nominationLog = [];
    if (typeof renderNominationPanel === 'function') renderNominationPanel();
    if (typeof updateNominationBanner === 'function') updateNominationBanner();
    btn.textContent = '☀️';
    btn.title = 'Tag läuft - klick für Nacht';
    dayNumber++;
    if (typeof window.botcStoryLogAppend === 'function') {
      window.botcStoryLogAppend('Tag ' + dayNumber + ' (Phasen-Umschalter)');
    }
    updatePhaseBackground(currentScript, 'day');
    document.getElementById('nightLabel').textContent = `☀ Tag ${dayNumber}`;
    scheduleSave();
  } else {
    // Tag → Nacht: reset execution tracking + per-Nacht Flags
    window.BOTC_executedToday = false;
    window.BOTC_executedSeatId = null;
    if (Array.isArray(seats)) {
      seats.forEach(function(s) {
        if (s.flags) {
          delete s.flags.poisoned;
          delete s.flags.protected;
          delete s.flags.witched;
          delete s.flags.madAsMinion;
          delete s.flags.daProtectedTomorrow;
          delete s.flags.drunkUntilDusk;
          delete s.flags.protectedUntilDusk;
          delete s.flags.exorcistTargetTonight;
          delete s.flags.cannotDieAtNight;
          delete s.flags.markedToDieTonight;
        }
      });
    }
    // Tag → Nacht
    btn.textContent = '🌙';
    btn.title = 'Nacht läuft - klick für Tag';
    nightNumber++;
    if (typeof window.botcStoryLogAppend === 'function') {
      window.botcStoryLogAppend('Nacht ' + nightNumber + ' (Phasen-Umschalter)');
    }
    updatePhaseBackground(currentScript, 'night');
    document.getElementById('nightLabel').textContent = `☽ Nacht ${nightNumber}`;
    nightSteps.forEach(s => { s.done = false; });
    buildNightOrder();
    draw();
    renderNightOrder();
    if (assistantMode) {
      updateTopBarForAssistant();
      scrollNightOrderToCurrent();
    }
    scheduleSave();
  }
}

function newNightWithoutPhaseChange() {
  // Reset per-night ability state (monk protection, poisoner target, demon kill, etc.)
  // "once" flags (slayer, virgin, etc.) intentionally NOT reset — they are once per game
  if (window.BOTC_STATE && window.BOTC_STATE.night) {
    window.BOTC_STATE.night.tb  = {};
    window.BOTC_STATE.night.bmr = {};
  }

  // Reset per-night seat flags (drunkUntilDusk, protectedUntilDusk, exorcistTargetTonight)
  if (Array.isArray(seats)) {
    seats.forEach(function(s) {
      if (s.flags) {
        delete s.flags.drunkUntilDusk;
        delete s.flags.protectedUntilDusk;
        delete s.flags.exorcistTargetTonight;
        delete s.flags.cannotDieAtNight;
        delete s.flags.markedToDieTonight;
        // Per-Nacht Fähigkeits-Flags: laufen bei Morgengrauen ab
        delete s.flags.poisoned;           // Giftmischer: nur eine Nacht gültig
        delete s.flags.protected;          // Mönch: visuell (Check via monkProtectedSeatId)
        delete s.flags.witched;            // Hexe: Fluch endet nach einem Tag
        delete s.flags.madAsMinion;        // Cerenovus: endet nach einem Tag
        delete s.flags.daProtectedTomorrow; // Teufelsadvokat: endet nach einem Tag
      }
    });
  }

  nightSteps.forEach(s => { s.done = false; });
  buildNightOrder();
  draw();
  renderNightOrder();
  if (assistantMode) {
    updateTopBarForAssistant();
    scrollNightOrderToCurrent();
  }
  scheduleSave();
}

// Update Phase Background
function updatePhaseBackground(script, phase) {
  const bgMap = {
    'trouble_brewing': {
      day: 'TB-Day.png',
      night: 'TB-Night.png'
    },
    'bad_moon_rising': {
      day: 'BMR-Day.png',
      night: 'BMR-Night.png'
    },
    'sects_and_violets': {
      day: 'S&V-Day.png',
      night: 'S&V-Night.png'
    },
    'custom': {
      day: 'Custom-Day.png',
      night: 'Custom-Night.png'
    }
  };

  const scriptInfo = bgMap[script] || bgMap.custom;
  const phaseKey = (phase || 'day').toLowerCase();
  const fileName = scriptInfo[phaseKey];

  if (!fileName) {
    document.documentElement.style.setProperty('--phase-bg', 'none');
    return;
  }

  const bgUrl = 'url(./icons/' + fileName + ')';
  document.documentElement.style.setProperty('--phase-bg', bgUrl);
  console.log('[BG UPDATE]', script, phase, bgUrl);
}

function showToast(message, durationMs) {
  durationMs = durationMs != null ? durationMs : 3000;
  const el = document.getElementById('toast');
  if (!el) return;
  if (toastTimer) clearTimeout(toastTimer);
  el.textContent = message || '';
  el.classList.add('show');
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    el.textContent = '';
    toastTimer = null;
  }, durationMs);
}

function showNightCompleteToast() {
  const el = document.getElementById('toast');
  if (!el) return;
  if (toastTimer) clearTimeout(toastTimer);
  el.innerHTML = 'Nacht abgeschlossen · <button type="button" class="toastDetailsBtn" onclick="openSummaryModal(); event.stopPropagation();">Details</button>';
  el.classList.add('show');
  toastTimer = setTimeout(() => {
    el.classList.remove('show');
    el.textContent = '';
    toastTimer = null;
  }, 5000);
}

function openSummaryModal() {
  document.getElementById('summaryModalTitle').textContent = 'Nacht ' + nightNumber + ' Zusammenfassung';
  const content = document.getElementById('summaryContent');
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  content.innerHTML = seats.map(s => {
    const roleName = (s.role && ROLES[s.role]) ? (ROLES[s.role].name || ROLES[s.role].n) : '—';
    const markersStr = (s.markers && s.markers.length) ? s.markers.join(', ') : '';
    const reminderStr = (s.reminder && s.reminder.length) ? s.reminder.join(', ') : '';
    const meta = [s.alive ? '✦ Lebt' : '✝ Tot', roleName, markersStr, reminderStr].filter(Boolean).join(' · ');
    return `<div class="summaryRow${s.alive?'':' dead'}"><span class="sName">${esc(s.name || 'Sitz ' + s.id)}</span><div class="sMeta">${esc(meta)}</div></div>`;
  }).join('');
  document.getElementById('summaryBackdrop').classList.add('open');
  document.getElementById('summaryModal').classList.add('open');
}