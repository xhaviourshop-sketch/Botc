function selectScript(scriptId) {
  gameSetup.script = scriptId;
  updatePhase0UI();
}

function selectPlayerCount(count) {
  gameSetup.playerCount = count;
  updatePhase0UI();
}

function updatePhase0UI() {
  // Update Script Card Styling
  document.querySelectorAll('[id^="scriptBtn_"]').forEach(btn => {
    btn.style.borderColor = '';
    btn.style.background = '';
    btn.classList.toggle('active', btn.id === 'scriptBtn_' + gameSetup.script);
  });

  // Update Player Count Button Styling
  document.querySelectorAll('[id^="playerBtn_"]').forEach(btn => {
    const n = parseInt(btn.id.replace('playerBtn_', ''), 10);
    btn.classList.toggle('active', n === gameSetup.playerCount);
  });

  // Update Summary Text
  const limits = gameSetup.playerCount ? TOKEN_LIMITS[gameSetup.playerCount] : null;
  const summaryEl = document.getElementById('setupPhase0Summary');
  if (summaryEl) {
    if (gameSetup.script && gameSetup.playerCount) {
      const scriptLabel = SCRIPT_LABELS[gameSetup.script] || gameSetup.script;
      summaryEl.innerHTML = `✓ ${scriptLabel} mit ${gameSetup.playerCount} Spielern<br>Tokens: ${limits.townsfolk}T, ${limits.outsider}O, ${limits.minion}M, ${limits.demon}D`;
    } else {
      summaryEl.innerHTML = 'Script und Spieler-Anzahl wählen';
    }
  }

  // Enable/Disable Next Button
  const btn = document.getElementById('phase0NextBtn');
  if (btn) {
    if (gameSetup.script && gameSetup.playerCount) {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.style.opacity = '1';
    } else {
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.5';
    }
  }
}

function startPhase1() {
  setupPhase = 1;

  // Initialize Seats with empty names
  gameSetup.seats = Array.from({length: gameSetup.playerCount}, (_, i) => ({
    id: i + 1,
    name: '',
    order: i
  }));

  // Modal BLEIBT sichtbar (Phase1 liegt als fixed-Overlay darüber).
  // display:none auf Modal würde alle Kinder unsichtbar machen.
  const phase0El = document.getElementById('setupPhase0');
  const phase1El = document.getElementById('setupPhase1');
  if (phase0El) phase0El.style.display = 'none';
  if (phase1El) phase1El.style.display = 'block';

  renderPhase1();
}

// ─────────────────────────────────────────────────────────────
// PHASE 1: Names on Seats
// ─────────────────────────────────────────────────────────────

function renderPhase1() {
  const titleEl = document.getElementById('setupPhase1Title');
  if (titleEl) titleEl.textContent = `Gib den Namen für jeden Spieler ein (${gameSetup.playerCount} Spieler)`;

  const container = document.getElementById('setupPhase1Seats');
  if (!container) return;
  container.innerHTML = '';

  const n = gameSetup.playerCount;
  if (!n) return;

  // ── Exakt dieselbe Spielfeld-Geometrie wie das Spiel ──────────────
  const pf = (typeof getPlayfieldRect === 'function') ? getPlayfieldRect() : null;
  if (!pf) return;

  // Sitzkreis-Radius: identische Berechnung wie game-draw.js
  const minDim = pf.minDim;
  let baseSeatR = Math.min(46, Math.max(24, minDim * 0.075));
  const circleScale = (typeof getCircleSizeScale === 'function') ? getCircleSizeScale() : 1.3;
  const baseRingR  = minDim * 0.46 * circleScale;
  const ringRForArc = Math.min(baseRingR, (pf.h / 2) - 18 - pf.margin, (pf.w / 2) - 18 - pf.margin);
  const arcLen = (2 * Math.PI * Math.max(1, ringRForArc)) / n;
  const maxR   = (arcLen - 16) / 2;
  if (baseSeatR > maxR) baseSeatR = Math.max(18, maxR);
  const seatR = Math.max(18, Math.min(baseSeatR, maxR));

  // Ellipsen-Radien: identisch mit getLayoutRxRy(), aber 30% nach innen gezogen
  const { rx: rxFull, ry: ryFull } = (typeof getLayoutRxRy === 'function')
    ? getLayoutRxRy(pf, seatR)
    : { rx: pf.w / 2 - seatR - pf.margin, ry: pf.h / 2 - seatR - pf.margin };
  const rx = rxFull * 0.7;
  const ry = ryFull * 0.7;

  const diameter  = seatR * 2;
  const inputW    = Math.min(Math.round(seatR * 1.55), 88);
  const fontSize  = Math.max(9, Math.min(12, Math.round(seatR * 0.26)));
  const numSize   = Math.max(7, Math.round(seatR * 0.2));

  gameSetup.seats.forEach((seat, idx) => {
    // Position: exakt wie game-draw.js (gleiche Formel)
    const angle = (idx / n) * Math.PI * 2 - Math.PI / 2;
    let x = pf.cx + Math.cos(angle) * rx;
    let y = pf.cy + Math.sin(angle) * ry;
    x = Math.max(pf.x0 + seatR, Math.min(pf.x0 + pf.w - seatR, x));
    y = Math.max(pf.y0 + seatR, Math.min(pf.y0 + pf.h - seatR, y));

    const seatEl = document.createElement('div');
    seatEl.style.cssText = `position:absolute;width:${diameter}px;height:${diameter}px;left:${x - seatR}px;top:${y - seatR}px;display:flex;flex-direction:column;align-items:center;justify-content:center;`;

    const circle = document.createElement('div');
    circle.style.cssText = `width:100%;height:100%;border:2px solid #c9a84c;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(20,18,42,.88);position:relative;box-sizing:border-box;`;

    const num = document.createElement('div');
    num.textContent = seat.id;
    num.style.cssText = `font-size:${numSize}px;opacity:.55;font-weight:700;position:absolute;top:4px;left:50%;transform:translateX(-50%);pointer-events:none;`;
    circle.appendChild(num);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = seat.name;
    input.placeholder = 'Name';
    input.dataset.seatId = seat.id;
    input.style.cssText = `width:${inputW}px;height:26px;background:#14122a;color:#f7f5ff;border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:3px 5px;font-size:${fontSize}px;text-align:center;outline:none;font-family:inherit;`;

    input.addEventListener('change', e => { seat.name = e.target.value; updatePhase1Counter(); });
    input.addEventListener('input',  e => { seat.name = e.target.value; });
    input.addEventListener('click',  e => e.stopPropagation());

    circle.appendChild(input);
    seatEl.appendChild(circle);
    container.appendChild(seatEl);
  });

  updatePhase1Counter();
}

function updatePhase1Counter() {
  const filled = gameSetup.seats.filter(s => s.name && s.name.trim()).length;
  const total = gameSetup.seats.length;

  const counterEl = document.getElementById('setupPhase1Counter');
  if (counterEl) {
    counterEl.textContent = `✓ ${filled}/${total} Namen eingegeben`;
  }

  const btn = document.getElementById('phase1NextBtn');
  if (btn) {
    if (filled === total) {
      btn.disabled = false;
      btn.style.cursor = 'pointer';
      btn.style.opacity = '1';
    } else {
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
      btn.style.opacity = '0.5';
    }
  }
}

function startPhase2() {
  setupPhase = 2;
  console.log('[SETUP] Starting Phase 2 - Token Draft');

  // Modal war die ganze Zeit sichtbar → einfach Phase 1 aus-, Phase 2 einblenden
  const phase1El = document.getElementById('setupPhase1');
  const phase2El = document.getElementById('setupPhase2');
  if (phase1El) phase1El.style.display = 'none';
  if (phase2El) phase2El.style.display = 'flex';

  // Get token limits for this player count
  const limits = TOKEN_LIMITS[gameSetup.playerCount];

  // WICHTIG: Speichere BASE Limits (einmalig!)
  if (!gameSetup.baseLimits) {
    gameSetup.baseLimits = {
      townsfolk: limits.townsfolk,
      outsider: limits.outsider,
      minion: limits.minion,
      demon: limits.demon
    };
    console.log('[SETUP] Base limits stored:', gameSetup.baseLimits);
  }
  console.log('[SETUP] Token limits:', limits);

  // Load all roles and group by team
  loadAndGroupRoles(gameSetup.script);

  // Render Phase 2
  recalculateEffectiveLimits();
  renderPhase2();
}

function loadAndGroupRoles(selectedScript) {
  const scriptDef = SCRIPTS[selectedScript] || SCRIPT_ROLES[selectedScript];
  if (!scriptDef) {
    console.error('Script not found:', selectedScript);
    return;
  }

  gameSetup.allRoles = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: []
  };

  (scriptDef.townsfolk || []).forEach(roleId => {
    const role = ROLES[roleId];
    if (role) gameSetup.allRoles.townsfolk.push({ ...role, id: role.id || roleId, name: role.name || role.n || roleId });
  });

  (scriptDef.outsiders || []).forEach(roleId => {
    const role = ROLES[roleId];
    if (role) gameSetup.allRoles.outsider.push({ ...role, id: role.id || roleId, name: role.name || role.n || roleId });
  });

  (scriptDef.minions || []).forEach(roleId => {
    const role = ROLES[roleId];
    if (role) gameSetup.allRoles.minion.push({ ...role, id: role.id || roleId, name: role.name || role.n || roleId });
  });

  (scriptDef.demons || []).forEach(roleId => {
    const role = ROLES[roleId];
    if (role) gameSetup.allRoles.demon.push({ ...role, id: role.id || roleId, name: role.name || role.n || roleId });
  });

  console.log('[GROUP] Loaded script:', selectedScript, gameSetup.allRoles);
}

function renderPhase2() {
  const limits = gameSetup.effectiveLimits || TOKEN_LIMITS[gameSetup.playerCount];
  const baseLim = gameSetup.baseLimits || limits;

  const title = document.getElementById('setupPhase2Title');
  if (title) {
    title.textContent = `${SCRIPT_LABELS[gameSetup.script] || gameSetup.script} - ${gameSetup.playerCount} Spieler`;
  }

  const summaryEl = document.getElementById('setupPhase2Summary');
  if (summaryEl) {
    summaryEl.innerHTML = `Effective Limits: <strong>${limits.townsfolk}T, ${limits.outsider}O, ${limits.minion}M, ${limits.demon}D</strong> (von ${baseLim.townsfolk}T, ${baseLim.outsider}O, ${baseLim.minion}M, ${baseLim.demon}D)`;
  }

  const container = document.getElementById('setupPhase2Container');
  if (!container) return;
  if (!document.getElementById('modifier-panel')) createModifierPanel(container);
  container.querySelectorAll('[data-team]').forEach(el => el.remove());
  container.querySelectorAll('.marionette-warning').forEach(el => el.remove());

  const hasMarionetteNoDemon = hasRole('marionette', 'minion') && (gameSetup.selectedTokens.demon || []).length === 0;
  if (hasMarionetteNoDemon) {
    const warningBox = document.createElement('div');
    warningBox.className = 'marionette-warning';
    warningBox.innerHTML = '<p>⚠️ Marionette braucht Demon!</p>';
    container.insertBefore(warningBox, container.firstChild.nextSibling);
  }

  // Initialize selectedTokens if not exists
  if (!gameSetup.selectedTokens) {
    gameSetup.selectedTokens = {
      townsfolk: [],
      outsider: [],
      minion: [],
      demon: []
    };
  }

  // Render each team section
  const teams = ['townsfolk', 'outsider', 'minion', 'demon'];
  teams.forEach(team => {
    const allTeamRoles = gameSetup.allRoles[team] || [];
    const roles = allTeamRoles;
    const limit = limits[team];
    const selected = (gameSetup.selectedTokens[team] || []).length;

    const teamSection = document.createElement('div');
    teamSection.dataset.team = team;
    teamSection.style.cssText = `
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 10px;
      padding: 10px;
      background: rgba(20,18,42,.3);
    `;

    const teamTitle = document.createElement('div');
    teamTitle.style.cssText = `
      text-transform: uppercase;
      font-size: 11px;
      font-weight: 700;
      opacity: .7;
      margin-bottom: 10px;
      letter-spacing: .1em;
    `;
    teamTitle.textContent = `${team === 'townsfolk' ? '👥' : team === 'outsider' ? '🔵' : team === 'minion' ? '🔴' : '👿'} ${team.toUpperCase()} (${roles.length} verfügbar - ${limit} zu wählen)`;
    teamSection.appendChild(teamTitle);

    const rolesGrid = document.createElement('div');
    rolesGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
      margin-bottom: 10px;
    `;

    roles.forEach(role => {
      const btn = document.createElement('button');
      const sel = gameSetup.selectedTokens[team] || [];
      const isSelected = sel.includes(role.id);

      btn.style.cssText = `
        position: relative;
        padding: 8px 10px;
        border: 2px solid ${isSelected ? '#c9a84c' : 'rgba(255,255,255,.15)'};
        background: ${isSelected ? 'rgba(201,168,76,.2)' : 'rgba(20,18,42,.3)'};
        color: #f7f5ff;
        border-radius: 8px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 700;
        text-align: center;
        transition: all .2s;
        ${isSelected ? 'box-shadow: 0 0 10px rgba(201,168,76,.3);' : ''}
      `;

      btn.textContent = role.name;
      btn.dataset.roleId = role.id;
      btn.dataset.team = team;

      if (team === 'demon' && gameSetup.specialRoles && gameSetup.specialRoles.summoner_active) {
        btn.disabled = true;
        btn.title = 'Demon ist bei Summoner nicht erlaubt';
      } else if (team === 'demon' && gameSetup.specialRoles && gameSetup.specialRoles.legion_active) {
        btn.disabled = true;
        btn.title = 'Bei Legion fest (nur Legion)';
      }
      if (team === 'minion' && gameSetup.specialRoles && (gameSetup.specialRoles.legion_active || gameSetup.specialRoles.lot_active)) {
        btn.disabled = true;
        btn.title = gameSetup.specialRoles.lot_active ? 'Bei LoT sind Nachbarn die Minions (Phase 3)' : 'Bei Legion gibt es keine Minions';
      }

      if (team === 'townsfolk' && gameSetup.specialRoles && (gameSetup.specialRoles.bounty_hunter_evil_townsfolk + '').toLowerCase() === (role.id + '').toLowerCase()) {
        const evilBadge = document.createElement('span');
        evilBadge.className = 'evil-badge';
        evilBadge.textContent = '👁️ EVIL';
        btn.appendChild(evilBadge);
      }

      btn.addEventListener('click', () => handleRoleClick(role.id, team, role.name));
      rolesGrid.appendChild(btn);
    });

    teamSection.appendChild(rolesGrid);

    // Extra Village Idiots (wenn Village Idiot + Extras gewählt)
    if (team === 'townsfolk' && gameSetup.specialRoles && (gameSetup.specialRoles.village_idiot_extra_count || 0) > 0) {
      const extraVICount = gameSetup.specialRoles.village_idiot_extra_count;
      const extraContainer = document.createElement('div');
      extraContainer.className = 'extra-vi-container';
      const label = document.createElement('p');
      label.style.cssText = 'color: #fbbf24; font-size: 12px; margin: 0 0 8px 0;';
      label.textContent = 'Extra Village Idiots:';
      extraContainer.appendChild(label);
      for (let i = 0; i < extraVICount; i++) {
        const extraId = 'village_idiot_extra_' + (i + 1);
        const isDrunk = gameSetup.specialRoles.village_idiot_drunk_id === extraId;
        const sel = gameSetup.selectedTokens.townsfolk || [];
        const isSelected = sel.includes(extraId);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'role-button extra-vi-btn' + (isDrunk ? ' drunk' : '');
        btn.style.cssText = `
          position: relative;
          padding: 8px 10px;
          border: 2px solid ${isSelected ? '#c9a84c' : 'rgba(255,255,255,.15)'};
          background: ${isSelected ? 'rgba(201,168,76,.2)' : 'rgba(20,18,42,.3)'};
          color: #f7f5ff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          transition: all .2s;
          ${isDrunk ? 'border-color: #fbbf24; background: rgba(251,191,36,0.1);' : ''}
        `;
        btn.textContent = isDrunk ? 'Village Idiot (Drunk)' : 'Village Idiot Extra';
        btn.dataset.roleId = extraId;
        btn.dataset.team = 'townsfolk';
        if (isDrunk) {
          const drunkBadge = document.createElement('span');
          drunkBadge.className = 'drunk-badge';
          drunkBadge.textContent = '🍺';
          btn.appendChild(drunkBadge);
        }
        btn.addEventListener('click', () => handleRoleClick(extraId, 'townsfolk', isDrunk ? 'Village Idiot (Drunk)' : 'Village Idiot Extra'));
        extraContainer.appendChild(btn);
      }
      teamSection.appendChild(extraContainer);
    }

    const counter = document.createElement('div');
    counter.id = `counter_${team}`;
    counter.style.cssText = `
      text-align: right;
      font-size: 12px;
      opacity: .8;
      font-weight: 700;
    `;
    counter.textContent = `Gewählt: ${selected}/${limit}`;
    teamSection.appendChild(counter);

    container.appendChild(teamSection);
  });

  updatePhase2Counter();
}

function handleRoleClick(roleId, team, roleName) {
  if (!gameSetup.selectedTokens[team]) gameSetup.selectedTokens[team] = [];
  recalculateEffectiveLimits();
  const limits = gameSetup.effectiveLimits || TOKEN_LIMITS[gameSetup.playerCount];
  const limit = limits[team];
  const selected = gameSetup.selectedTokens[team];
  const isCurrentlySelected = selected.includes(roleId);
  var roleIdLo = (roleId + '').toLowerCase();

  if (!isCurrentlySelected && team === 'demon' && gameSetup.specialRoles && gameSetup.specialRoles.summoner_active) {
    showSummonerBlockerPopup();
    return;
  }
  if (!isCurrentlySelected && team === 'minion' && gameSetup.specialRoles && gameSetup.specialRoles.lot_active) {
    showLoTMinionBlockerPopup();
    return;
  }

  if (isCurrentlySelected) {
    selected.splice(selected.indexOf(roleId), 1);
    console.log(`[SETUP] Deselected ${roleName} from ${team}`);
    // Cleanup: King entfernt → Choirboy auch entfernen
    if (roleIdLo === 'king' && team === 'townsfolk') {
      const tf = gameSetup.selectedTokens.townsfolk || [];
      const choirboyIdx = tf.findIndex(id => (id + '').toLowerCase() === 'choirboy');
      if (choirboyIdx >= 0) {
        console.log('[CHOIRBOY] King entfernt → Choirboy auch entfernen');
        gameSetup.selectedTokens.townsfolk.splice(choirboyIdx, 1);
      }
    }
    // Cleanup: Damsel entfernt → Huntsman auch entfernen
    if (roleIdLo === 'damsel' && team === 'outsider') {
      const tf = gameSetup.selectedTokens.townsfolk || [];
      const huntsmanIdx = tf.findIndex(id => (id + '').toLowerCase() === 'huntsman');
      if (huntsmanIdx >= 0) {
        console.log('[HUNTSMAN] Damsel entfernt → Huntsman auch entfernen');
        gameSetup.selectedTokens.townsfolk.splice(huntsmanIdx, 1);
      }
    }
    // Cleanup: Village Idiot deselected → Extras entfernen
    var isVillageIdiot = (roleIdLo === 'village_idiot' || roleIdLo === 'village idiot' || roleIdLo.replace(/\s+/g, '_') === 'village_idiot' || roleIdLo === 'villageidiot');
    if (isVillageIdiot && team === 'townsfolk') {
      gameSetup.selectedTokens.townsfolk = (gameSetup.selectedTokens.townsfolk || []).filter(function(id) { return !String(id).startsWith('village_idiot_extra_'); });
      gameSetup.specialRoles.village_idiot_extra_count = undefined;
      gameSetup.specialRoles.village_idiot_drunk_id = null;
      console.log('[VILLAGE_IDIOT] Deselected → Extras entfernt');
    }
    // Cleanup: Demon entfernt → Marionette auch entfernen
    if (team === 'demon') {
      const minionArr = gameSetup.selectedTokens.minion || [];
      const marionetteIdx = minionArr.findIndex(id => (id + '').toLowerCase() === 'marionette');
      if (marionetteIdx >= 0) {
        console.log('[MARIONETTE] Demon entfernt → Marionette auch entfernen');
        gameSetup.selectedTokens.minion.splice(marionetteIdx, 1);
      }
      if (roleIdLo === 'kazali') {
        gameSetup.specialRoles.kazali_active = false;
        gameSetup.specialRoles.kazali_outsider_delta = null;
        console.log('[KAZALI] Deselected - reset');
      }
    }
    // Cleanup: Summoner abgewählt
    if (roleIdLo === 'summoner' && team === 'minion') {
      if (gameSetup.specialRoles) gameSetup.specialRoles.summoner_active = false;
      console.log('[SUMMONER] Deselected - reset');
    }
    // Cleanup: Legion abgewählt
    if (roleIdLo === 'legion' && team === 'demon') {
      if (gameSetup.specialRoles) {
        gameSetup.specialRoles.legion_active = false;
        gameSetup.specialRoles.legion_count = 0;
        gameSetup.specialRoles.legion_good_count = 0;
      }
      console.log('[LEGION] Deselected');
    }
    // Cleanup: Lord of Typhon abgewählt
    if ((roleIdLo === 'lord_of_typhon' || roleIdLo === 'lord of typhon') && team === 'demon') {
      if (gameSetup.specialRoles) {
        gameSetup.specialRoles.lot_active = false;
        gameSetup.specialRoles.lot_good_count = 0;
      }
      console.log('[LOT] Deselected - reset');
    }
  } else {
    if (gameSetup.specialRoles && gameSetup.specialRoles.lot_active && (team === 'townsfolk' || team === 'outsider')) {
      var goodSelected = (gameSetup.selectedTokens.townsfolk || []).length + (gameSetup.selectedTokens.outsider || []).length;
      if (goodSelected >= (gameSetup.specialRoles.lot_good_count || 0)) {
        showToast('Max ' + gameSetup.specialRoles.lot_good_count + ' Good (T+O) bei LoT!', 2000);
        return;
      }
    }
    if (selected.length < limit) {
      selected.push(roleId);
      console.log(`[SETUP] Selected ${roleName} (${team})`);
      if (roleIdLo === 'kazali' && team === 'demon') {
        gameSetup.specialRoles.kazali_outsider_delta = null;
      }
    } else {
      showToast(`Max ${limit} ${team} möglich!`, 2000);
      return;
    }
  }

  recalculateEffectiveLimits();

  if (!isCurrentlySelected && roleIdLo === 'atheist' && hasAnyEvilSelected()) {
    showAtheistPopup();
  }
  if (!isCurrentlySelected && roleIdLo === 'balloonist' && gameSetup.modifiers.balloonist_outsider_bonus === undefined) {
    showBalloonistPopup();
  }
  if (!isCurrentlySelected && roleIdLo === 'hermit' && gameSetup.modifiers.hermit_counts_as_outsider === undefined) {
    showHermitPopup();
  }

  renderPhase2();
}

// ─── Modifier Helpers ─────────────────────────────────────────
function hasRole(roleId, team) {
  const arr = gameSetup.selectedTokens[team];
  if (!arr) return false;
  return arr.some(id => (id + '').toLowerCase() === (roleId + '').toLowerCase());
}
function hasVillageIdiotSelected() {
  const arr = gameSetup.selectedTokens.townsfolk;
  if (!arr) return false;
  return arr.some(id => {
    const norm = (id + '').toLowerCase().replace(/\s+/g, '_').replace(/_+/g, '_');
    return norm === 'village_idiot' || norm === 'villageidiot';
  });
}
function getDemon() {
  const arr = gameSetup.selectedTokens.demon;
  if (!arr || arr.length === 0) return null;
  return (arr[0] + '').toLowerCase();
}
function getMaxOutsiders() {
  return (gameSetup.allRoles && gameSetup.allRoles.outsider) ? gameSetup.allRoles.outsider.length : 0;
}
function getSelectedEvilRoles() {
  const out = [];
  const d = gameSetup.selectedTokens.demon || [];
  const m = gameSetup.selectedTokens.minion || [];
  const o = gameSetup.selectedTokens.outsider || [];
  const allRoles = gameSetup.allRoles;
  d.forEach(id => {
    const r = (allRoles.demon || []).find(x => (x.id + '') === (id + ''));
    if (r) out.push(r.name || id);
  });
  m.forEach(id => {
    const r = (allRoles.minion || []).find(x => (x.id + '') === (id + ''));
    if (r) out.push(r.name || id);
  });
  o.forEach(id => {
    const r = (allRoles.outsider || []).find(x => (x.id + '') === (id + ''));
    if (r) out.push(r.name || id);
  });
  return out;
}
function hasAnyEvilSelected() {
  const d = (gameSetup.selectedTokens.demon || []).length;
  const m = (gameSetup.selectedTokens.minion || []).length;
  const o = (gameSetup.selectedTokens.outsider || []).length;
  return d > 0 || m > 0 || o > 0;
}
function removeEvilRoles() {
  gameSetup.selectedTokens.demon = [];
  gameSetup.selectedTokens.minion = [];
  gameSetup.selectedTokens.outsider = [];
  recalculateEffectiveLimits();
  renderPhase2();
}
function deselectRole(roleId) {
  const id = (roleId + '').toLowerCase();
  for (const team of ['townsfolk', 'outsider', 'minion', 'demon']) {
    const arr = gameSetup.selectedTokens[team];
    if (!arr) continue;
    const idx = arr.findIndex(x => (x + '').toLowerCase() === id);
    if (idx >= 0) {
      arr.splice(idx, 1);
      break;
    }
  }
  recalculateEffectiveLimits();
  renderPhase2();
}
function goToDemonSelection() {
  const container = document.getElementById('setupPhase2Container');
  if (!container) return;
  const demonSection = container.querySelector('[data-team="demon"]');
  if (demonSection) {
    demonSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    demonSection.style.border = '2px solid #ffaa00';
    demonSection.style.boxShadow = '0 0 12px rgba(255,170,0,0.4)';
    setTimeout(function() {
      demonSection.style.border = '';
      demonSection.style.boxShadow = '';
    }, 2000);
  }
}

function closeModal(modalId) {
  if (modalId) {
    var el = document.getElementById(modalId);
    if (el) el.remove();
  } else {
    var overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  }
  renderPhase2();
}

function updatePhase2Counter() {
  // Nutze effectiveLimits (mit Special Rules)
  const limits = gameSetup.effectiveLimits || TOKEN_LIMITS[gameSetup.playerCount];
  const teams = ['townsfolk', 'outsider', 'minion', 'demon'];

  let allFilled = true;
  if (gameSetup.specialRoles && gameSetup.specialRoles.lot_active) {
    const t = (gameSetup.selectedTokens.townsfolk || []).length;
    const o = (gameSetup.selectedTokens.outsider || []).length;
    const m = (gameSetup.selectedTokens.minion || []).length;
    const d = (gameSetup.selectedTokens.demon || []).length;
    const goodCount = gameSetup.specialRoles.lot_good_count || 0;
    allFilled = (t + o) === goodCount && m === 0 && d === 1;
  }
  teams.forEach(team => {
    const selected = (gameSetup.selectedTokens[team] || []).length;
    const limit = limits[team];
    const counter = document.getElementById(`counter_${team}`);
    if (counter) {
      counter.textContent = `Gewählt: ${selected}/${limit} ${selected === limit ? '✓' : ''}`;
    }
    if (!gameSetup.specialRoles || !gameSetup.specialRoles.lot_active) {
      if (selected !== limit) allFilled = false;
    } else if (team === 'townsfolk' || team === 'outsider') {
      // Bei LoT: T+O gemeinsam prüfen, nicht pro Team
    } else if (team === 'minion' || team === 'demon') {
      if (selected !== limit) allFilled = false;
    }
  });

  const btn = document.getElementById('phase2NextBtn');
  if (btn) {
    btn.disabled = !allFilled;
    btn.style.cursor = allFilled ? 'pointer' : 'not-allowed';
    btn.style.opacity = allFilled ? '1' : '0.5';
  }
}

function startPhase3() {
  setupPhase = 3;
  console.log('[SETUP] Phase 3 started. Selected tokens:', gameSetup.selectedTokens);
  // Auto-distribute tokens and transition to game
  var result = distributeTokensAutomatic();
  if (result.success) {
    showToast('✅ Tokens verteilt – Spiel wird gestartet…', 2000);
    setTimeout(function() { handleStartGameClick(); }, 400);
  } else {
    showToast('⚠ ' + (result.error || 'Verteilung fehlgeschlagen'), 3000);
  }
}

function hidePhase2UI() {
  console.log('[hidePhase2UI] called');
  try {
  // Hide all Phase 2 elements
  var phase2Els = [
    document.getElementById('dealBackdrop'),
    document.getElementById('deal'),
    document.getElementById('sheetBackdrop'),
    document.getElementById('sheet'),
    document.getElementById('quickBackdrop'),
    document.getElementById('quick')
  ];
  phase2Els.forEach(function(el) {
    if (el) {
      el.classList.add('hidden');
      el.style.display = 'none';
    }
  });
  // Hide any setup/phase UI containers
  var setupContainer = document.getElementById('setupContainer') ||
                       document.getElementById('phase2Container') ||
                       document.querySelector('[data-phase="2"]');
  if (setupContainer) {
    setupContainer.classList.add('hidden');
    setupContainer.style.display = 'none';
  }
  } catch (e) {
    console.error('[hidePhase2UI] error', e);
    throw e;
  }
}

function showFirstNightUI() {
  console.log('[showFirstNightUI] called');
  try {
  // Make sure the town circle is visible and rendered
  var town = document.getElementById('town');
  if (town) {
    town.style.display = '';
    town.classList.remove('hidden');
  }

  // Show the side panel if it was hidden
  var sidePanel = document.getElementById('sidePanel');
  if (sidePanel) {
    sidePanel.classList.remove('hidden');
    sidePanel.style.display = '';
  }

  // Show the top bar
  var topBar = document.getElementById('topBar');
  if (topBar) {
    topBar.classList.remove('hidden');
    topBar.style.display = '';
  }

  // Set night to 1 and build night order from the now-synced seats
  nightNumber = 1;
  buildNightOrder();
  renderPanel();
  draw();

  showToast('🎮 Spiel gestartet! Nacht 1 beginnt…', 3000);
  updateNightLabel();
  } catch (e) {
    console.error('[showFirstNightUI] error', e);
    throw e;
  }
}

function handleStartGameClick() {
  try {
  var validation = validateGameStart();

  if (!validation.valid) {
    showValidationErrorModal({
      title: '❌ Setup nicht vollständig',
      errors: validation.errors,
      onCancel: function() { closeModal(); }
    });
    return;
  }

  console.log('[START GAME] Validierung OK');
  gameSetup.gameStarted = true;

  if (gameSetup.script && typeof currentScript !== 'undefined') {
    currentScript = gameSetup.script;
    if (typeof updateScriptLabelFromCurrent === 'function') updateScriptLabelFromCurrent();
  }

  // Ensure global seats is always in sync at game start
  if (gameSetup.seats && gameSetup.seats.length) {
    seats = gameSetup.seats.map(function(s) {
      return {
        id: s.id,
        name: s.name || ('Spieler ' + s.id),
        role: s.roleId || s.role || null,
        roleId: s.roleId || s.role || null,
        team: s.team || 'good',
        alive: s.alive !== false,
        markers: [],
        notes: '',
        reminder: []
      };
    });
  }

  if (typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) {
    gameSetup.activeFabledIds = activeFabledIds.slice();
  }
  if (window.BOTC && window.BOTC.State && typeof window.BOTC.State.save === 'function') {
    try {
      window.BOTC.State.save(gameSetup);
    } catch (e) {
      console.warn('[START GAME] State.save failed', e);
    }
  }

  hidePhase2UI();
  showFirstNightUI();

  // Force close the setup modal
  var modal = document.getElementById('setupModal');
  var backdrop = document.getElementById('setupBackdrop');
  if (modal) { modal.style.display = 'none'; modal.classList.remove('open'); }
  if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('open'); }

  // Also hide the phase containers
  var phase0 = document.getElementById('setupPhase0');
  var phase1 = document.getElementById('setupPhase1');
  var phase2 = document.getElementById('setupPhase2');
  if (phase0) phase0.style.display = 'none';
  if (phase1) phase1.style.display = 'none';
  if (phase2) phase2.style.display = 'none';

  showToast('🎮 Spiel gestartet! First Night wird vorbereitet...', 3000);
  } catch (err) {
    console.error('[START GAME ERROR]', err);
    throw err;
  }
}

function selfPlayMode() {
  if (gameSetup.script && typeof currentScript !== 'undefined') {
    currentScript = gameSetup.script;
    if (typeof updateScriptLabelFromCurrent === 'function') updateScriptLabelFromCurrent();
  }

  gameSetup.gameStarted = true;

  // Seats mit Namen, aber ohne Rollen
  if (gameSetup.seats && gameSetup.seats.length) {
    seats = gameSetup.seats.map(function(s) {
      return {
        id: s.id,
        name: s.name || ('Spieler ' + s.id),
        role: null,
        roleId: null,
        team: 'good',
        alive: true,
        markers: [],
        notes: '',
        reminder: []
      };
    });
  }

  hidePhase2UI();

  var modal = document.getElementById('setupModal');
  var backdrop = document.getElementById('setupBackdrop');
  if (modal) { modal.style.display = 'none'; modal.classList.remove('open'); }
  if (backdrop) { backdrop.style.display = 'none'; backdrop.classList.remove('open'); }

  var phase0 = document.getElementById('setupPhase0');
  var phase1 = document.getElementById('setupPhase1');
  var phase2 = document.getElementById('setupPhase2');
  if (phase0) phase0.style.display = 'none';
  if (phase1) phase1.style.display = 'none';
  if (phase2) phase2.style.display = 'none';

  var town = document.getElementById('town');
  if (town) { town.style.display = ''; town.classList.remove('hidden'); }
  var sidePanel = document.getElementById('sidePanel');
  if (sidePanel) { sidePanel.classList.remove('hidden'); sidePanel.style.display = ''; }
  var topBar = document.getElementById('topBar');
  if (topBar) { topBar.classList.remove('hidden'); topBar.style.display = ''; }

  nightNumber = 1;
  if (typeof buildNightOrder === 'function') buildNightOrder();
  if (typeof renderPanel === 'function') renderPanel();
  if (typeof draw === 'function') draw();
  if (typeof updateNightLabel === 'function') updateNightLabel();
  if (typeof scheduleSave === 'function') scheduleSave();

  showToast('📓 Notizbuch-Modus – Tokens leer, viel Spaß!', 3000);
}

function showValidationErrorModal(opts) {
  opts = opts || {};
  var title = String(opts.title || '❌ Fehler').replace(/</g, '&lt;');
  var errors = opts.errors || [];
  var errorsHtml = errors.map(function(e, i) {
    var text = String(e).replace(/</g, '&lt;');
    return '<div style="padding: 8px; background: rgba(255,100,100,.1); border-left: 3px solid #ff6464; margin-bottom: 8px;">' + (i + 1) + '. ' + text + '</div>';
  }).join('');

  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content">' +
    '<h2>' + title + '</h2>' +
    '<div style="margin: 15px 0;">' + errorsHtml + '</div>' +
    '<div class="modal-buttons"><button type="button">OK</button></div></div>';

  modal.querySelector('.modal-buttons button').onclick = function() {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
    if (typeof closeModal === 'function') closeModal();
  };

  document.body.appendChild(modal);
}

function renderTokenDistPreview() {
  var preview = document.getElementById('tokenDistPreview');
  var list = document.getElementById('tokenDistPreviewList');
  if (!preview || !list) return;
  var seatsArr = gameSetup && gameSetup.seats ? gameSetup.seats : [];
  var assigned = seatsArr.filter(function(s) { return s.roleId || s.role; });
  if (!assigned.length) { preview.style.display = 'none'; return; }
  var esc = function(v) { return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var teamColor = { townsfolk: 'var(--good-hi)', outsider: 'var(--outsider-hi)', minion: 'var(--minion-hi)', demon: 'var(--evil-hi)', traveler: '#aaa' };
  list.innerHTML = assigned.map(function(s) {
    var rid = s.roleId || s.role;
    var r = typeof ROLES !== 'undefined' ? ROLES[rid] : null;
    var roleName = r ? (r.name || r.n || rid) : rid;
    var rType = r ? String(r.type || '').toLowerCase() : 'townsfolk';
    var col = teamColor[rType] || 'var(--text)';
    var playerName = s.name || ('Sitz ' + s.id);
    return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">' +
      '<span style="opacity:.45;min-width:18px;text-align:right;">' + esc(s.id) + '</span>' +
      '<span style="flex:1;font-weight:600;">' + esc(playerName) + '</span>' +
      '<span style="color:' + col + ';font-family:Cinzel,serif;font-size:11px;">' + esc(roleName) + '</span>' +
      '</div>';
  }).join('');
  preview.style.display = 'block';
}

function handleDistributeTokensClick() {
  var result = distributeTokensAutomatic();
  if (result.success) {
    console.log('[DISTRIBUTE]', result);
    showToast('✅ ' + result.message, 3000);
    if (typeof renderSeatCircleWithTokens === 'function') {
      renderSeatCircleWithTokens();
    }
    renderTokenDistPreview();
    // HOOK Private Info: Für Rollen-Selbstanzeige pro Sitz: showPrivateInfoOverlay({ type: 'self_role_reveal', seatId }) aufrufen (z. B. beim Tipp auf Sitz oder nacheinander).
  } else {
    if (result.retry) {
      showMarionetteFixModal({
        error: result.error,
        suggestion: result.suggestion,
        seats: gameSetup.seats,
        onRetry: function() {
          handleDistributeTokensClick();
        },
        onManualFix: function() {
          if (typeof enterManualAdjustmentMode === 'function') {
            enterManualAdjustmentMode();
          } else {
            showToast('Manuell anpassen kommt bald.', 2000);
          }
        }
      });
    } else {
      showToast('❌ ' + result.error, 3000);
    }
  }
}

function showMarionetteFixModal(opts) {
  var error = (opts && opts.error) || 'Marionette muss neben dem Demon sitzen.';
  var suggestion = (opts && opts.suggestion) || 'Erneut verteilen oder manuell anpassen.';
  var onRetry = typeof (opts && opts.onRetry) === 'function' ? opts.onRetry : function() {};
  var onManualFix = typeof (opts && opts.onManualFix) === 'function' ? opts.onManualFix : function() {};

  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.setAttribute('data-marionette-fix', '1');
  modal.innerHTML = '<div class="modal-content">' +
    '<h2>⚠️ Marionette – Position ungültig</h2>' +
    '<p>' + (error.replace(/</g, '&lt;')) + '</p>' +
    '<p style="opacity:.85; font-size:13px;">' + (suggestion.replace(/</g, '&lt;')) + '</p>' +
    '<div class="modal-buttons">' +
    '<button type="button">🎲 Erneut verteilen</button>' +
    '<button type="button">✏️ Manuell anpassen</button>' +
    '</div></div>';

  var close = function() {
    if (modal.parentNode) modal.parentNode.removeChild(modal);
  };

  modal.querySelector('.modal-buttons button:nth-child(1)').onclick = function() {
    close();
    onRetry();
  };
  modal.querySelector('.modal-buttons button:nth-child(2)').onclick = function() {
    close();
    onManualFix();
  };

  document.body.appendChild(modal);
}

function getTeamForRoleId(roleId) {
  if (!gameSetup.allRoles) return 'good';
  const id = (roleId + '').toLowerCase();
  for (const team of ['townsfolk', 'outsider', 'minion', 'demon']) {
    const arr = gameSetup.allRoles[team];
    if (!arr) continue;
    const role = arr.find(function(r) { return (r.id + '').toLowerCase() === id; });
    if (role) return role.team || (team === 'townsfolk' || team === 'outsider' ? 'good' : 'evil');
  }
  return 'good';
}

function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function distributeTokensAutomatic() {
  var playerCount = gameSetup.playerCount;
  if (playerCount == null || playerCount < 1) {
    return { success: false, error: 'playerCount nicht gesetzt' };
  }

  if (!gameSetup.seats || gameSetup.seats.length === 0) {
    gameSetup.seats = [];
    for (var i = 0; i < playerCount; i++) {
      gameSetup.seats.push({
        id: i,
        name: 'Player ' + i,
        roleId: null,
        team: null,
        alive: true
      });
    }
  }

  var st = gameSetup.selectedTokens || {};
  // Filter out 'drunk' from outsider tokens - Drunk is modifier only, not a real token
  var outsiderTokens = (st.outsider || []).filter(function(id) {
    return (id + '').toLowerCase() !== 'drunk';
  });
  var tokens = []
    .concat(st.townsfolk || [])
    .concat(outsiderTokens)
    .concat(st.minion || [])
    .concat(st.demon || []);

  var hasDrunkSelected = (st.outsider || []).some(function(id) { return (id + '').toLowerCase() === 'drunk'; });
  var expectedTokenCount = playerCount;
  if (tokens.length !== expectedTokenCount) {
    return {
      success: false,
      error: 'Token count (' + tokens.length + ') != player count (' + playerCount + ')'
    };
  }

  tokens = shuffleArray(tokens);
  gameSetup.tokenDistribution = {};
  var tokensToAssign = tokens;

  for (var i = 0; i < gameSetup.seats.length; i++) {
    var seat = gameSetup.seats[i];
    var roleId = tokensToAssign[i];
    gameSetup.tokenDistribution[seat.id] = roleId;
    seat.roleId = roleId;
    seat.team = getTeamForRoleId(roleId);
  }

  var marionetteCheck = validateMarionettePosition(gameSetup.seats);
  if (!marionetteCheck.valid) {
    console.warn('[MARIONETTE VALIDATION FAILED]', marionetteCheck);
    return {
      success: false,
      error: marionetteCheck.error,
      suggestion: marionetteCheck.suggestion,
      retry: true
    };
  }

  var lotResult = applyLordOfTyphonNeighbors(gameSetup.seats);
  if (lotResult.applied) {
    console.log('[LOT] Nachbarn markiert als Minions');
  }

  // Sync gameSetup.seats → global seats[] so the town circle and game UI see the distributed roles
  seats = gameSetup.seats.map(function(s) {
    return {
      id: s.id,
      name: s.name || ('Spieler ' + s.id),
      role: s.roleId || null,
      roleId: s.roleId || null,
      team: s.team || 'good',
      alive: true,
      markers: [],
      notes: '',
      reminder: []
    };
  });

  return {
    success: true,
    distribution: gameSetup.tokenDistribution,
    seats: gameSetup.seats,
    message: tokens.length + ' Tokens verteilt auf ' + playerCount + ' Spieler'
  };
}

function getRoleNameById(roleId) {
  if (!roleId) return '';
  var id = (roleId + '').toLowerCase();

  // Primary: search gameSetup.allRoles (populated in Phase 2)
  if (gameSetup.allRoles) {
    for (var team of ['townsfolk', 'outsider', 'minion', 'demon']) {
      var arr = gameSetup.allRoles[team];
      if (!arr) continue;
      var role = arr.find(function(r) { return (r.id + '').toLowerCase() === id; });
      if (role) return (role.name || role.n || roleId) + '';
    }
  }

  // Fallback: search global ROLES (always available, 156+ roles from roles-master.json)
  if (typeof ROLES !== 'undefined' && ROLES[id]) {
    return (ROLES[id].n || ROLES[id].name || roleId) + '';
  }

  return roleId + '';
}

function validateMarionettePosition(seats) {
  if (!seats || !seats.length) return { valid: true };

  var marionetteIndex = -1;
  var demonIndex = -1;
  var allRoles = gameSetup.allRoles || {};
  var demonIds = (allRoles.demon || []).map(function(r) { return (r.id + '').toLowerCase(); });

  for (var i = 0; i < seats.length; i++) {
    var roleId = seats[i].roleId;
    if (!roleId) continue;
    var name = getRoleNameById(roleId).toLowerCase();
    var idLo = (roleId + '').toLowerCase();
    if (idLo === 'marionette') marionetteIndex = i;
    if (demonIds.indexOf(idLo) !== -1 || name.indexOf('demon') !== -1) demonIndex = i;
  }

  if (marionetteIndex === -1) return { valid: true };
  if (demonIndex === -1) return { valid: false, error: 'Marionette da, aber kein Demon!' };

  var n = seats.length;
  var leftNeighbor = (demonIndex - 1 + n) % n;
  var rightNeighbor = (demonIndex + 1) % n;
  var isBeside = (marionetteIndex === leftNeighbor || marionetteIndex === rightNeighbor);

  if (isBeside) {
    return { valid: true, message: 'Marionette sitzt neben Demon ✅' };
  }
  return {
    valid: false,
    error: 'Marionette sitzt NICHT neben Demon! Marionette: Seat ' + marionetteIndex + ', Demon: Seat ' + demonIndex,
    suggestion: 'Bitte erneut verteilen oder manuell anpassen'
  };
}

function applyLordOfTyphonNeighbors(seats) {
  if (!seats || !seats.length) return { applied: false, message: 'Keine Seats' };

  var lotIndex = -1;
  for (var i = 0; i < seats.length; i++) {
    var idLo = (seats[i].roleId + '').toLowerCase();
    var nameLo = getRoleNameById(seats[i].roleId).toLowerCase();
    if (idLo === 'lord_of_typhon' || nameLo === 'lord of typhon') {
      lotIndex = i;
      break;
    }
  }

  if (lotIndex === -1) return { applied: false, message: 'Kein LoT' };

  var n = seats.length;
  var leftIndex  = (lotIndex - 1 + n) % n;
  var rightIndex = (lotIndex + 1) % n;

  // Backup original roleId before overwriting
  if (!seats[leftIndex].originalRoleId) {
    seats[leftIndex].originalRoleId = seats[leftIndex].roleId;
  }
  if (!seats[rightIndex].originalRoleId) {
    seats[rightIndex].originalRoleId = seats[rightIndex].roleId;
  }

  var leftRole  = seats[leftIndex].roleId;
  var rightRole = seats[rightIndex].roleId;

  seats[leftIndex].roleId  = 'lot_minion_1';
  seats[leftIndex].team    = 'minion';
  seats[rightIndex].roleId = 'lot_minion_2';
  seats[rightIndex].team   = 'minion';

  // Also sync to global seats[]
  var leftSeat  = seats.find(function(s) { return s.id === seats[leftIndex].id; });
  var rightSeat = seats.find(function(s) { return s.id === seats[rightIndex].id; });
  if (leftSeat)  { leftSeat.originalRoleId  = leftRole;  leftSeat.team  = 'minion'; }
  if (rightSeat) { rightSeat.originalRoleId = rightRole; rightSeat.team = 'minion'; }

  console.log('[LOT NEIGHBORS]', {
    lotSeat: lotIndex,
    leftMinion:  { seat: leftIndex,  originalRole: leftRole  },
    rightMinion: { seat: rightIndex, originalRole: rightRole }
  });

  return {
    applied: true,
    message: 'LoT Nachbarn (' + leftIndex + ', ' + rightIndex + ') sind jetzt Minions',
    minions: [leftIndex, rightIndex]
  };
}

function undoLordOfTyphonNeighbors(seats) {
  if (!seats) return;
  seats.forEach(function(s) {
    if (s.originalRoleId && (s.roleId === 'lot_minion_1' || s.roleId === 'lot_minion_2')) {
      s.roleId = s.originalRoleId;
      s.team   = getTeamForRoleId(s.originalRoleId);
      delete s.originalRoleId;
    }
  });
}

function validateGameStart() {
  var errors = [];

  var noNames = (gameSetup.seats || []).filter(function(s) {
    return !s.name || String(s.name).trim() === '';
  });
  if (noNames.length > 0) {
    errors.push(noNames.length + ' Spieler ohne Namen');
  }

  var noRoles = (gameSetup.seats || []).filter(function(s) { return !s.roleId && !s.role; });
  if (noRoles.length > 0) {
    errors.push(noRoles.length + ' Spieler ohne Rollen');
  }

  if ((gameSetup.seats || []).length !== gameSetup.playerCount) {
    errors.push('Seat-Count (' + (gameSetup.seats || []).length + ') !== Player-Count (' + gameSetup.playerCount + ')');
  }

  var marionette = validateMarionettePosition(gameSetup.seats || []);
  if (!marionette.valid) {
    errors.push('Marionette-Validierung: ' + marionette.error);
  }

  var lotHas = (gameSetup.seats || []).some(function(s) {
    return getRoleNameById(s.roleId).toLowerCase() === 'lord of typhon';
  });
  if (lotHas) {
    var lotMinions = (gameSetup.seats || []).filter(function(s) {
      return s.roleId && String(s.roleId).indexOf('lot_minion') !== -1;
    });
    if (lotMinions.length !== 2) {
      errors.push('LoT: Nachbarn nicht als Minions markiert');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors,
    message: errors.length === 0 ? '✅ Alles validiert!' : '❌ ' + errors.length + ' Fehler'
  };
}

function validateEffectiveLimits() {
  const limits = gameSetup.effectiveLimits || {};
  const sel = gameSetup.selectedTokens || {};
  const t = (sel.townsfolk || []).length;
  const o = (sel.outsider || []).length;
  const m = (sel.minion || []).length;
  const d = (sel.demon || []).length;
  if (gameSetup.specialRoles && gameSetup.specialRoles.lot_active) {
    const goodCount = gameSetup.specialRoles.lot_good_count || 0;
    return (t + o) === goodCount && m === 0 && d === 1;
  }
  const ok = t === (limits.townsfolk || 0) && o === (limits.outsider || 0) && m === (limits.minion || 0) && d === (limits.demon || 0);
  return ok;
}

function createModifierPanel(container) {
  if (document.getElementById('modifier-panel')) return document.getElementById('modifier-panel');
  const panel = document.createElement('div');
  panel.id = 'modifier-panel';
  panel.className = 'modifier-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="modifier-header"><h3>⚠️ Aktive Modifier</h3></div>
    <div id="modifier-list"></div>
    <div id="modifier-status" class="modifier-status"></div>
  `;
  (container || document.getElementById('setupPhase2Container')).insertBefore(panel, (container || document.getElementById('setupPhase2Container')).firstChild);
  return panel;
}

function renderModifierPanel(activeModifiers) {
  const container = document.getElementById('setupPhase2Container');
  const panel = document.getElementById('modifier-panel') || createModifierPanel(container);
  const list = panel.querySelector('#modifier-list');
  const statusEl = panel.querySelector('#modifier-status');
  if (!list) return;
  list.innerHTML = '';
  if (activeModifiers.length === 0) {
    panel.style.display = 'none';
    if (statusEl) statusEl.innerHTML = '';
    return;
  }
  panel.style.display = 'block';
  activeModifiers.forEach(function(mod) {
    const item = document.createElement('div');
    item.className = 'modifier-item modifier-' + (mod.severity || 'ok');
    item.innerHTML = '<span class="modifier-name">' + (mod.name || '') + '</span><span class="modifier-effect">' + (mod.effect || '') + '</span><span class="modifier-type">' + (mod.type === 'auto' ? '🔄' : '👤') + '</span>' + (mod.note ? '<span class="modifier-note">' + mod.note + '</span>' : '');
    list.appendChild(item);
  });
  if (statusEl) {
    const isValid = validateEffectiveLimits();
    statusEl.className = 'modifier-status ' + (isValid ? 'status-valid' : 'status-warning');
    statusEl.textContent = isValid ? '✅ Setup ist gültig!' : '⚠️ Limits nicht erfüllt!';
  }
}

function recalculateEffectiveLimits() {
  if (!gameSetup.baseLimits) return;
  var activeModifiers = [];

  function validateOutsiderAvailable() {
    var need = gameSetup.effectiveLimits.outsider;
    var have = (gameSetup.allRoles.outsider || []).length;
    return have >= need;
  }

  gameSetup.effectiveLimits = {
    townsfolk: gameSetup.baseLimits.townsfolk,
    outsider: gameSetup.baseLimits.outsider,
    minion: gameSetup.baseLimits.minion,
    demon: gameSetup.baseLimits.demon
  };

  if (hasRole('baron', 'minion')) {
    gameSetup.modifiers.baron_active = true;
    gameSetup.effectiveLimits.townsfolk -= 2;
    gameSetup.effectiveLimits.outsider += 2;
    activeModifiers.push({ name: 'Baron', effect: '-2T +2O', type: 'auto', severity: validateOutsiderAvailable() ? 'ok' : 'warning' });
  } else {
    gameSetup.modifiers.baron_active = false;
  }

  var demon = getDemon();

  var hasKazali = demon === 'kazali';
  if (gameSetup.specialRoles) gameSetup.specialRoles.kazali_active = hasKazali;
  if (hasKazali) {
    if (gameSetup.specialRoles.kazali_outsider_delta === null) {
      showKazaliOutsiderPopup();
      return;
    }
  } else {
    if (gameSetup.specialRoles) {
      gameSetup.specialRoles.kazali_active = false;
      gameSetup.specialRoles.kazali_outsider_delta = null;
    }
  }

  if (demon === 'fang_gu') {
    gameSetup.modifiers.fang_gu_active = true;
    gameSetup.effectiveLimits.townsfolk -= 1;
    gameSetup.effectiveLimits.outsider += 1;
    activeModifiers.push({ name: 'Fang Gu', effect: '-1T +1O', type: 'auto', severity: 'ok' });
  } else {
    gameSetup.modifiers.fang_gu_active = false;
  }
  if (demon === 'vigormortis') {
    gameSetup.modifiers.vigormortis_active = true;
    gameSetup.effectiveLimits.outsider -= 1;
    gameSetup.effectiveLimits.townsfolk += 1;
    activeModifiers.push({ name: 'Vigormortis', effect: '-1O +1T', type: 'auto', severity: 'ok' });
  } else {
    gameSetup.modifiers.vigormortis_active = false;
  }
  if (demon === 'lil_monsta') {
    gameSetup.modifiers.lil_monsta_active = true;
    gameSetup.effectiveLimits.minion += 1;
    activeModifiers.push({ name: "Lil' Monsta", effect: '+1M (Demon zählt nicht!)', type: 'auto', severity: 'ok', note: 'Demon-Slot wird nicht mitgezählt' });
  } else {
    gameSetup.modifiers.lil_monsta_active = false;
  }

  const hasMarionette = hasRole('marionette', 'minion');
  const hasDemon = (gameSetup.selectedTokens.demon || []).length > 0;
  gameSetup.specialRoles.marionette_active = hasMarionette;

  if (hasMarionette) {
    if (!hasDemon) {
      showMarionettePopup();
    } else {
      gameSetup.effectiveLimits.townsfolk += 1;
      activeModifiers.push({
        name: 'Marionette',
        effect: '➕ +1 Townsfolk (neben Demon)',
        type: 'auto',
        severity: 'ok'
      });
    }
    gameSetup.modifiers.marionette_demon_present = hasDemon;
  } else {
    gameSetup.specialRoles.marionette_active = false;
    gameSetup.modifiers.marionette_demon_present = null;
  }

  if (hasRole('atheist', 'townsfolk')) {
    if (!hasAnyEvilSelected()) {
      gameSetup.modifiers.atheist_confirmed = true;
      activeModifiers.push({ name: 'Atheist', effect: '✅ Nur good characters', type: 'validation', severity: 'ok' });
    }
  } else {
    gameSetup.modifiers.atheist_confirmed = null;
  }

  if (hasRole('balloonist', 'townsfolk')) {
    var balloonistBonus = gameSetup.modifiers.balloonist_outsider_bonus;
    if (balloonistBonus === undefined) balloonistBonus = 0;
    gameSetup.effectiveLimits.outsider += balloonistBonus;
    activeModifiers.push({ name: 'Balloonist', effect: balloonistBonus > 0 ? '+' + balloonistBonus + 'O' : 'Standard', type: 'popup', severity: 'ok' });
  } else {
    gameSetup.modifiers.balloonist_outsider_bonus = undefined;
  }

  if (hasRole('hermit', 'outsider')) {
    var hermitCounts = gameSetup.modifiers.hermit_counts_as_outsider;
    if (hermitCounts === undefined) hermitCounts = true;
    if (hermitCounts) {
      gameSetup.effectiveLimits.outsider -= 1;
      activeModifiers.push({ name: 'Hermit', effect: 'Zählt als Outsider', type: 'popup', severity: 'ok' });
    } else {
      gameSetup.effectiveLimits.outsider += 1;
      activeModifiers.push({ name: 'Hermit', effect: 'Extra Outsider', type: 'popup', severity: 'ok' });
    }
  } else {
    gameSetup.modifiers.hermit_counts_as_outsider = undefined;
  }

  // GODFATHER: +/-1O (bei +1O auch -1T, bei -1O auch +1T)
  if (hasRole('godfather', 'minion')) {
    if (gameSetup.modifiers.godfather_outsider_effect === undefined) {
      showGodfatherPopup();
    } else if (gameSetup.modifiers.godfather_outsider_effect !== null) {
      var effect = gameSetup.modifiers.godfather_outsider_effect;
      gameSetup.effectiveLimits.outsider += effect;
      if (effect === 1) {
        gameSetup.effectiveLimits.townsfolk -= 1;
      } else if (effect === -1) {
        gameSetup.effectiveLimits.townsfolk += 1;
      }
      activeModifiers.push({
        name: 'Godfather',
        effect: effect === 1 ? '+1O -1T' : '-1O +1T',
        type: 'popup',
        severity: 'ok'
      });
    }
  } else {
    gameSetup.modifiers.godfather_outsider_effect = undefined;
  }

  // ===== SPECIAL ROLES: Token-Adder =====
  if (!gameSetup.specialRoles) {
    gameSetup.specialRoles = {
      choirboy_requires_king: false,
      huntsman_requires_damsel: false,
      bounty_hunter_evil_townsfolk: null,
      village_idiot_extra_count: undefined,
      village_idiot_drunk_id: null,
      marionette_active: false,
      kazali_active: false,
      kazali_outsider_delta: null,
      summoner_active: false,
      legion_active: false,
      legion_count: 0,
      legion_good_count: 0,
      lot_active: false,
      lot_good_count: 0
    };
  }

  // CHOIRBOY: braucht King
  const hasChoirboy = hasRole('choirboy', 'townsfolk');
  const hasKing = hasRole('king', 'townsfolk');
  gameSetup.specialRoles.choirboy_requires_king = hasChoirboy;

  if (hasChoirboy && !hasKing) {
    console.log('[CHOIRBOY] King fehlt → Auto-add');
    const kingRole = (gameSetup.allRoles.townsfolk || []).find(r => (r.id + '').toLowerCase() === 'king');
    if (kingRole) {
      if (!gameSetup.selectedTokens.townsfolk) gameSetup.selectedTokens.townsfolk = [];
      gameSetup.selectedTokens.townsfolk.push(kingRole.id);
    }
    activeModifiers.push({
      name: 'Choirboy',
      effect: '➕ King hinzugefügt',
      type: 'auto',
      severity: 'ok'
    });
  }

  // HUNTSMAN: braucht Damsel
  const hasHuntsman = hasRole('huntsman', 'townsfolk');
  const hasDamsel = hasRole('damsel', 'outsider');
  gameSetup.specialRoles.huntsman_requires_damsel = hasHuntsman;

  if (hasHuntsman && !hasDamsel) {
    console.log('[HUNTSMAN] Damsel fehlt → Auto-add');
    const damselRole = (gameSetup.allRoles.outsider || []).find(r => (r.id + '').toLowerCase() === 'damsel');
    if (damselRole) {
      if (!gameSetup.selectedTokens.outsider) gameSetup.selectedTokens.outsider = [];
      gameSetup.selectedTokens.outsider.push(damselRole.id);
    }
    gameSetup.effectiveLimits.outsider += 1;
    activeModifiers.push({
      name: 'Huntsman',
      effect: '➕ Damsel hinzugefügt (+1O)',
      type: 'auto',
      severity: 'ok'
    });
  }

  // BOUNTY HUNTER: 1 Townsfolk wird evil
  const hasBountyHunter = hasRole('bounty_hunter', 'townsfolk');

  if (hasBountyHunter) {
    const availableTownsfolk = (gameSetup.allRoles.townsfolk || [])
      .filter(r => (r.id + '').toLowerCase() !== 'bounty_hunter')
      .map(r => r.id);

    if (availableTownsfolk.length > 0) {
      if (!gameSetup.specialRoles.bounty_hunter_evil_townsfolk) {
        const randomIndex = Math.floor(Math.random() * availableTownsfolk.length);
        gameSetup.specialRoles.bounty_hunter_evil_townsfolk = availableTownsfolk[randomIndex];
        console.log('[BOUNTY_HUNTER] Evil Townsfolk:', gameSetup.specialRoles.bounty_hunter_evil_townsfolk);
      }
      activeModifiers.push({
        name: 'Bounty Hunter',
        effect: '👁️ 1 Townsfolk ist evil',
        type: 'auto',
        severity: 'ok'
      });
    }
  } else {
    gameSetup.specialRoles.bounty_hunter_evil_townsfolk = null;
  }

  // VILLAGE IDIOT: +0 to +2 Extra, 1 davon Drunk
  const hasVillageIdiot = hasRole('village_idiot', 'townsfolk') || hasRole('village idiot', 'townsfolk') || hasVillageIdiotSelected();
  if (hasVillageIdiot) {
    if (gameSetup.specialRoles.village_idiot_extra_count === undefined) {
      showVillageIdiotPopup();
      activeModifiers.push({
        name: 'Village Idiot',
        effect: '🤡 Wähle Anzahl Extras (Popup)',
        type: 'popup',
        severity: 'ok'
      });
    } else if (gameSetup.specialRoles.village_idiot_extra_count !== null) {
      const extraCount = gameSetup.specialRoles.village_idiot_extra_count;
      // Extras füllen bestehende Townsfolk-Slots, erhöhen das Limit NICHT

      if (extraCount > 0) {
        if (!gameSetup.selectedTokens.townsfolk) gameSetup.selectedTokens.townsfolk = [];
        for (let i = 0; i < extraCount; i++) {
          const extraId = 'village_idiot_extra_' + (i + 1);
          if (!gameSetup.selectedTokens.townsfolk.includes(extraId)) {
            gameSetup.selectedTokens.townsfolk.push(extraId);
            console.log('[VILLAGE_IDIOT] Extra Token hinzugefügt:', extraId);
          }
          if (i === 0) {
            gameSetup.specialRoles.village_idiot_drunk_id = extraId;
            console.log('[VILLAGE_IDIOT] Drunk marked:', extraId);
          }
        }
        activeModifiers.push({
          name: 'Village Idiot',
          effect: '➕ +' + extraCount + ' Extra Village Idiot' + (extraCount > 1 ? 's' : '') + ' (1 ist Drunk)',
          type: 'popup',
          severity: 'ok'
        });
      } else {
        gameSetup.selectedTokens.townsfolk = (gameSetup.selectedTokens.townsfolk || []).filter(function(id) { return !String(id).startsWith('village_idiot_extra_'); });
        gameSetup.specialRoles.village_idiot_drunk_id = null;
        activeModifiers.push({
          name: 'Village Idiot',
          effect: '✅ Keine Extras',
          type: 'popup',
          severity: 'ok'
        });
      }
    }
  } else {
    gameSetup.specialRoles.village_idiot_extra_count = undefined;
    gameSetup.specialRoles.village_idiot_drunk_id = null;
    gameSetup.selectedTokens.townsfolk = (gameSetup.selectedTokens.townsfolk || []).filter(function(id) { return !String(id).startsWith('village_idiot_extra_'); });
  }
  // ===== END SPECIAL ROLES =====

  if (gameSetup.specialRoles.kazali_active && gameSetup.specialRoles.kazali_outsider_delta !== null) {
    var delta = gameSetup.specialRoles.kazali_outsider_delta;
    var baseLimits = gameSetup.baseLimits;
    var baseT = baseLimits.townsfolk || 0;
    var baseM = baseLimits.minion || 0;
    var baseO = baseLimits.outsider || 0;
    gameSetup.effectiveLimits.townsfolk = Math.max(0, baseT + baseM - delta);
    gameSetup.effectiveLimits.outsider = Math.max(0, baseO + delta);
    gameSetup.effectiveLimits.minion = 0;
    gameSetup.effectiveLimits.demon = 1;
    console.log('[KAZALI] Applied delta=' + delta, { T: gameSetup.effectiveLimits.townsfolk, O: gameSetup.effectiveLimits.outsider, M: 0, D: 1 });
    var effectLabel = delta === 0 ? 'Keine Modifikation (Minions 0/0)' : (delta > 0 ? '+' + delta + 'O (-' + delta + 'T)' : delta + 'O (+' + (-delta) + 'T)') + ' (Minions 0/0)';
    activeModifiers.push({
      name: 'Kazali',
      effect: '🔮 ' + effectLabel,
      type: 'auto',
      severity: 'ok'
    });
  }

  // SUMMONER: Kein Demon im Setup, +1 Townsfolk
  const hasSummoner = hasRole('summoner', 'minion');
  if (gameSetup.specialRoles) gameSetup.specialRoles.summoner_active = hasSummoner;
  if (hasSummoner) {
    gameSetup.effectiveLimits.townsfolk += 1;
    gameSetup.effectiveLimits.demon = 0;
    gameSetup.selectedTokens.demon = [];
    activeModifiers.push({
      name: 'Summoner',
      effect: '⚡ Kein Demon im Setup, +1T',
      type: 'auto',
      severity: 'ok'
    });
    console.log('[SUMMONER] Active: +1T, Demon=0');
  } else {
    if (gameSetup.specialRoles) gameSetup.specialRoles.summoner_active = false;
  }

  // DRUNK: Als Outsider gewählt → +1 Townsfolk (Deckungstoken). Phase 3: Einen Townsfolk als Drunk markieren.
  if (!gameSetup.specialRules) gameSetup.specialRules = { drunk_active: false, drunk_townsfolk_id: null };
  const hasDrunkSelected = gameSetup.selectedTokens && gameSetup.selectedTokens.outsider &&
    gameSetup.selectedTokens.outsider.some(function(id) { return (id + '').toLowerCase() === 'drunk'; });
  gameSetup.specialRules.drunk_active = !!hasDrunkSelected;
  if (!hasDrunkSelected && gameSetup.specialRules) gameSetup.specialRules.drunk_townsfolk_id = null;
  if (hasDrunkSelected) {
    gameSetup.effectiveLimits.townsfolk += 1;
    activeModifiers.push({
      name: 'Drunk',
      effect: '🍺 +1T (Deckungstoken, Drunk wird nicht verteilt)',
      type: 'auto',
      severity: 'ok',
      note: '⏰ Phase 3: Einen Townsfolk als DRUNK markieren (sieht sich als anderer Charakter).'
    });
    console.log('[DRUNK] Selected as Outsider: +1T');
  }

  // LEGION CHECK
  const hasLegion = hasRole('legion', 'demon');
  if (gameSetup.specialRoles) gameSetup.specialRoles.legion_active = hasLegion;
  if (hasLegion) {
    const playerCount = gameSetup.playerCount;
    const legionData = LEGION_DISTRIBUTION[playerCount];
    if (legionData) {
      gameSetup.specialRoles.legion_count = legionData.legions;
      gameSetup.specialRoles.legion_good_count = legionData.good;
      gameSetup.effectiveLimits.minion = 0;
      gameSetup.effectiveLimits.demon = legionData.legions;
      gameSetup.effectiveLimits.townsfolk = legionData.good;
      gameSetup.effectiveLimits.outsider = 0;
      gameSetup.selectedTokens.demon = Array(legionData.legions).fill('legion');
      gameSetup.selectedTokens.minion = [];
      activeModifiers.push({
        name: 'Legion',
        effect: '⚔️ ' + legionData.legions + ' Legions, ' + legionData.good + ' Gute (T+O frei)',
        type: 'auto',
        severity: 'ok'
      });
      console.log('[LEGION] Active:', legionData);
    }
  } else {
    if (gameSetup.specialRoles) {
      gameSetup.specialRoles.legion_active = false;
      gameSetup.specialRoles.legion_count = 0;
      gameSetup.specialRoles.legion_good_count = 0;
    }
  }

  // LORD OF TYPHON: Demon = LoT selbst, +1M versteckt, T+O frei
  const hasLoT = !hasLegion && hasRole('lord_of_typhon', 'demon');
  if (gameSetup.specialRoles) gameSetup.specialRoles.lot_active = hasLoT;
  if (hasLoT) {
    const playerCount = gameSetup.playerCount;
    gameSetup.effectiveLimits.minion = 0;
    gameSetup.effectiveLimits.demon = 1;
    // lot_good_count = total players minus the demon slot
    // Townsfolk + Outsider slots are freely selectable by the user
    if (gameSetup.playerCount) {
      var minionCount = gameSetup.effectiveLimits.minion || 0;
      gameSetup.specialRoles.lot_good_count = gameSetup.playerCount - 1 - minionCount;
    }
    var goodCount = gameSetup.specialRoles.lot_good_count || 0;
    gameSetup.effectiveLimits.townsfolk = goodCount;
    gameSetup.effectiveLimits.outsider = goodCount;
    gameSetup.selectedTokens.minion = [];
    activeModifiers.push({
      name: 'Lord of Typhon',
      effect: '👑 ' + goodCount + ' Good (T+O frei), +1M versteckt, Nachbarn = Minions',
      type: 'auto',
      severity: 'ok'
    });
    console.log('[LOT] Active:', { playerCount: playerCount, goodCount: goodCount, townsfolk: gameSetup.effectiveLimits.townsfolk, outsider: gameSetup.effectiveLimits.outsider, minion: 0, demon: 1 });
  } else {
    if (gameSetup.specialRoles) {
      gameSetup.specialRoles.lot_active = false;
      gameSetup.specialRoles.lot_good_count = 0;
    }
  }

  gameSetup.effectiveLimits.townsfolk = Math.max(0, gameSetup.effectiveLimits.townsfolk);
  gameSetup.effectiveLimits.outsider = Math.max(0, gameSetup.effectiveLimits.outsider);
  gameSetup.effectiveLimits.minion = Math.max(0, gameSetup.effectiveLimits.minion);
  gameSetup.effectiveLimits.demon = Math.max(0, gameSetup.effectiveLimits.demon);

  console.log('[MODIFIER] Active Modifiers:', activeModifiers);
  console.log('[MODIFIER] Base Limits:', gameSetup.baseLimits);
  console.log('[MODIFIER] Effective Limits:', gameSetup.effectiveLimits);

  validateEffectiveLimits();
  renderModifierPanel(activeModifiers);
  renderPhase2();
}

function showGodfatherPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>👑 Godfather</h2><p>Welcher Outsider-Effekt?</p><div class="modal-buttons"><button type="button">+1 Outsider</button><button type="button">-1 Outsider (+1 Townsfolk)</button></div></div>';
  modal.querySelectorAll('button')[0].onclick = function() { setGodfather(1); closeModal(); };
  modal.querySelectorAll('button')[1].onclick = function() { setGodfather(-1); closeModal(); };
  document.body.appendChild(modal);
}

function setGodfather(effect) {
  gameSetup.modifiers.godfather_outsider_effect = effect;
  recalculateEffectiveLimits();
}
function showMarionettePopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>⚠️ Marionette braucht Demon!</h2><p>Marionette <strong>muss neben dem Demon</strong> im Setup sein.</p><p>Es ist kein Demon ausgewählt.</p><div class="modal-buttons"><button type="button">Zum Demon wechseln</button><button type="button">Marionette abwählen</button></div></div>';
  modal.querySelector('button').onclick = function() { closeModal(); goToDemonSelection(); recalculateEffectiveLimits(); };
  modal.querySelectorAll('button')[1].onclick = function() { closeModal(); deselectRole('marionette'); };
  document.body.appendChild(modal);
}
function showSummonerBlockerPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>⚠️ Summoner – Kein Demon erlaubt</h2><p>Summoner schafft erst auf Night 3 einen Demon.</p><p>Im Setup gibt es <strong>keinen</strong> Demon!</p><div class="modal-buttons"><button type="button">OK</button></div></div>';
  modal.querySelector('button').onclick = function() { closeModal(); };
  document.body.appendChild(modal);
}
function showLoTMinionBlockerPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>⚠️ Lord of Typhon – Keine Minions wählbar</h2><p>Bei LoT sind die <strong>Nachbarn</strong> des LoT-Spielers die Minions (Phase 3).</p><p>Im Setup werden keine Minion-Tokens gewählt!</p><div class="modal-buttons"><button type="button">OK</button></div></div>';
  modal.querySelector('button').onclick = function() { closeModal(); };
  document.body.appendChild(modal);
}
function showAtheistPopup() {
  var evilRoles = getSelectedEvilRoles();
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>⚠️ Atheist + Evil Rollen unvereinbar!</h2><p>Atheist kann <strong>KEINE</strong> evil Characters haben (Demon/Minion/Outsider).</p><p>Aktuell im Setup: ' + (evilRoles.length ? evilRoles.join(', ') : '–') + '</p><div class="modal-buttons"><button type="button">Evil Rollen entfernen</button><button type="button">Atheist abwählen</button></div></div>';
  modal.querySelector('button').onclick = function() { closeModal(); removeEvilRoles(); };
  modal.querySelectorAll('button')[1].onclick = function() { closeModal(); deselectRole('atheist'); };
  document.body.appendChild(modal);
}

function showKazaliOutsiderPopup() {
  var baseLimits = gameSetup.baseLimits || {};
  var baseO = baseLimits.outsider || 0;
  var baseT = baseLimits.townsfolk || 0;
  var baseM = baseLimits.minion || 0;

  var options = [
    { delta: 2, label: '+2 Outsider (-2 Townsfolk)' },
    { delta: 1, label: '+1 Outsider (-1 Townsfolk)' },
    { delta: 0, label: 'Keine Modifikationen' }
  ];
  if (baseO >= 1) options.push({ delta: -1, label: '-1 Outsider (+1 Townsfolk)' });
  if (baseO >= 2) options.push({ delta: -2, label: '-2 Outsider (+2 Townsfolk)' });

  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'kazali-modal';
  var buttonsHtml = options.map(function(o) {
    return '<button type="button" data-delta="' + o.delta + '">' + o.label + '</button>';
  }).join('');
  modal.innerHTML = '<div class="modal-content"><h2>🔮 Kazali – Outsider-Effekt</h2><p>Minions = 0/0. Townsfolk = ' + (baseT + baseM) + ' (Basis + ' + baseM + ' von Minion-Slots).</p><p>Wähle die Outsider-Modifikation:</p><div class="modal-buttons kazali-buttons">' + buttonsHtml + '</div><button type="button" class="btn-cancel">Abwählen</button></div>';
  modal.querySelectorAll('.kazali-buttons button').forEach(function(btn) {
    var delta = parseInt(btn.getAttribute('data-delta'), 10);
    btn.onclick = function() { setKazaliDelta(delta); closeModal(); };
  });
  modal.querySelector('.btn-cancel').onclick = function() { deselectRole('kazali'); closeModal(); };
  document.body.appendChild(modal);
}

function showKazaliNoValidOptionPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>⚠️ Kazali - Keine gültigen Optionen</h2><p>T + O + M + D = ' + (gameSetup.playerCount || 0) + '</p><p style="color: #ff6464;">Kazali funktioniert nicht mit diesem Script!</p><button type="button">Abwählen</button></div>';
  modal.querySelector('button').onclick = function() { deselectRole('kazali'); closeModal(); };
  document.body.appendChild(modal);
}

function setKazaliDelta(delta) {
  console.log('[KAZALI] User chose delta:', delta);
  gameSetup.specialRoles.kazali_outsider_delta = delta;
  recalculateEffectiveLimits();
}

function showBalloonistPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>🎈 Balloonist Outsider Bonus</h2><p>Balloonist kann optional einen Outsider-Slot nehmen.</p><div class="modal-buttons"><button type="button">+0 Outsider (Standard)</button><button type="button">+1 Outsider</button></div></div>';
  modal.querySelector('button').onclick = function() { gameSetup.modifiers.balloonist_outsider_bonus = 0; closeModal(); recalculateEffectiveLimits(); };
  modal.querySelectorAll('button')[1].onclick = function() { gameSetup.modifiers.balloonist_outsider_bonus = 1; closeModal(); recalculateEffectiveLimits(); };
  document.body.appendChild(modal);
}
function showHermitPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>🧙 Hermit zählt als Outsider?</h2><p>Standard: Ja (zählt als Outsider).</p><div class="modal-buttons"><button type="button">Ja, zählt als Outsider (-1O)</button><button type="button">Nein, extra Outsider (+1O)</button></div></div>';
  modal.querySelector('button').onclick = function() { gameSetup.modifiers.hermit_counts_as_outsider = true; closeModal(); recalculateEffectiveLimits(); };
  modal.querySelectorAll('button')[1].onclick = function() { gameSetup.modifiers.hermit_counts_as_outsider = false; closeModal(); recalculateEffectiveLimits(); };
  document.body.appendChild(modal);
}

function showVillageIdiotPopup() {
  var modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = '<div class="modal-content"><h2>🤡 Village Idiot</h2><p>Village Idiot kann 0–2 extra Village Idiots erzeugen.</p><p>Wie viele Extras?</p><div class="modal-buttons"><button type="button">+0 Extras (nur 1 VI)</button><button type="button">+1 Extra (2 VI, 1 ist Drunk)</button><button type="button">+2 Extras (3 VI, 1 ist Drunk)</button></div></div>';
  modal.querySelectorAll('button')[0].onclick = function() { setVillageIdiotExtra(0); closeModal(); };
  modal.querySelectorAll('button')[1].onclick = function() { setVillageIdiotExtra(1); closeModal(); };
  modal.querySelectorAll('button')[2].onclick = function() { setVillageIdiotExtra(2); closeModal(); };
  document.body.appendChild(modal);
}

function setVillageIdiotExtra(count) {
  console.log('[VILLAGE_IDIOT] Extra count chosen:', count);
  gameSetup.specialRoles.village_idiot_extra_count = count;
  recalculateEffectiveLimits();
}

// Diese Funktion wird nicht mehr gebraucht, aber lass sie für Rückwärts-Kompatibilität
function handleBaronSelected() {
  // Wird jetzt durch recalculateEffectiveLimits() gehandelt
}

function handleDrunkSelected(team) {
  showDrunkSelectionModal();
}

function confirmDrunkSelected() {
  if (!gameSetup.specialRules) gameSetup.specialRules = { drunk_active: false, drunk_townsfolk_id: null };
  gameSetup.specialRules.drunk_active = true;
  gameSetup.specialRules.drunk_townsfolk_id = null;
  console.log('[DRUNK] Confirmed in modal');
}

function showDrunkSelectionModal() {
  const modal = document.getElementById('drunkSelectionModal');
  if (!modal) {
    console.error('[SETUP] Drunk modal not found!');
    return;
  }

  const phase2 = document.getElementById('setupPhase2');
  if (phase2) phase2.style.display = 'none';

  modal.style.display = 'flex';
  console.log('[SETUP] Drunk modal opened (simplified)');
}

function selectDrunkTownsfolk(townsfolkId, townsfolkName) {
  var name = townsfolkName;
  if (name == null && townsfolkId != null) {
    var role = (gameSetup.allRoles.townsfolk || []).find(function(r) { return (r.id + '') === (townsfolkId + ''); });
    name = role ? (role.name || role.n || townsfolkId) : townsfolkId;
  }
  if (!gameSetup.specialRules) gameSetup.specialRules = { drunk_active: false, drunk_townsfolk_id: null };
  gameSetup.specialRules.drunk_active = true;
  gameSetup.specialRules.drunk_townsfolk_id = townsfolkId || null;

  console.log('[SETUP] Drunk townsfolk selected:', name);

  closeDrunkModal();

  showToast((name || 'Drunk') + ' ist verdunkelt! 🍺', 2000);
}

function closeDrunkModal() {
  const modal = document.getElementById('drunkSelectionModal');
  const phase2 = document.getElementById('setupPhase2');

  if (modal) modal.style.display = 'none';
  if (phase2) phase2.style.display = 'flex';

  recalculateEffectiveLimits();
  renderPhase2();
}

function handleMarionetteSelected(team) {
  console.log('[SETUP] MARIONETTE selected - modal for Minion selection');
}

function handleAtheistSelected(team) {
  console.log('[SETUP] ATHEIST selected - modal for real Demon');
}

function closeSummaryModal() {
  document.getElementById('summaryBackdrop').classList.remove('open');
  document.getElementById('summaryModal').classList.remove('open');
}

function openSetupModalPhase0() {
  console.log('[SETUP] openSetupModalPhase0 called');

  // Reset gameSetup
  gameSetup = {
    script: null,
    playerCount: null,
    gameStarted: false,
    seats: [], // [{ id, name, roleId, team, alive, drunk?, bluff? }]
    selectedTokens: {},
    baseLimits: null,
    effectiveLimits: null,
    allRoles: { townsfolk: [], outsider: [], minion: [], demon: [] },
    demonBluffs: [],
    tokenDistribution: {}, // { seatId: roleId, ... }
    specialRules: {
      drunk_active: false,
      drunk_townsfolk_id: null
    },
    modifiers: {
      baron_active: false,
      fang_gu_active: false,
      vigormortis_active: false,
      lil_monsta_active: false,
      godfather_outsider_effect: undefined,
      marionette_demon_present: null,
      atheist_confirmed: null,
      balloonist_outsider_bonus: undefined,
      hermit_counts_as_outsider: undefined
    },
    specialRoles: {
      choirboy_requires_king: false,
      huntsman_requires_damsel: false,
      bounty_hunter_evil_townsfolk: null,
      village_idiot_extra_count: undefined,
      village_idiot_drunk_id: null,
      marionette_active: false,
      kazali_active: false,
      kazali_outsider_delta: null,
      summoner_active: false,
      legion_active: false,
      legion_count: 0,
      legion_good_count: 0,
      lot_active: false,
      lot_good_count: 0
    }
  };
  setupPhase = 0;

  console.log('[SETUP] gameSetup reset');

  // Show Phase 0, hide Phase 1
  const phase0 = document.getElementById('setupPhase0');
  const phase1 = document.getElementById('setupPhase1');
  const modal = document.getElementById('setupModal');

  console.log('[SETUP] Elements:', { phase0, phase1, modal });

  if (phase0) {
    phase0.style.display = 'flex';
    console.log('[SETUP] Phase 0 shown');
  }
  if (phase1) {
    phase1.style.display = 'none';
    console.log('[SETUP] Phase 1 hidden');
  }

  // Show modal with both display flex AND removeAttribute hidden
  if (modal) {
    modal.removeAttribute('style');
    modal.style.display = 'flex';
    modal.style.zIndex = '1000';
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.backgroundColor = 'rgba(8,6,20,.97)';
    console.log('[SETUP] Modal shown with styles');
  } else {
    console.error('[SETUP] Modal element NOT FOUND!');
    return;
  }

  console.log('[SETUP] About to update Phase 0 UI');
  updatePhase0UI();
  console.log('[SETUP] Phase 0 UI updated - COMPLETE');
}
