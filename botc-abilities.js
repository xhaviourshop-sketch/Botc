/**
 * Blood on the Clocktower – Trouble Brewing abilities (Night Order integration).
 * Requires: global seats, nightNumber, draw, ROLES, and (optional) seat markup with team/role.
 */
(function () {
  'use strict';

  var DE_ALIAS = {
    giftmischer: 'poisoner',
    moench: 'monk',
    wahrsagerin: 'fortune_teller',
    scharlachrotefrau: 'scarletwoman',
    scharlachrote: 'scarletwoman',
    spion: 'spy',
    baron: 'baron',
    imp: 'imp',
    soldat: 'soldier',
    buergermeister: 'mayor',
    jaeger: 'slayer',
    daemonenjaeger: 'slayer',
    jungfrau: 'virgin',
    totengraeber: 'undertaker',
    koch: 'chef',
    waescherfrau: 'washerwoman',
    waschweib: 'washerwoman',
    bibliothekar: 'librarian',
    ermittler: 'investigator',
    detektiv: 'investigator',
    rabenhueter: 'ravenkeeper',
    heilige: 'saint',
    heiliger: 'saint',
    butler: 'butler',
    trunkenbold: 'drunk',
    eingaenger: 'recluse'
  };

  function normalizeRoleKey(s) {
    if (s == null) return '';
    var t = String(s).toLowerCase().trim()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    t = t.replace(/[^a-z0-9]/g, '');
    if (window.ROLE_KEY_ALIASES) {
      var aliases = window.ROLE_KEY_ALIASES;
      if (Object.prototype.hasOwnProperty.call(aliases, t)) {
        var mapped = aliases[t];
        if (mapped === null) return '';
        if (mapped) return mapped;
      }
    }
    return DE_ALIAS[t] || t;
  }

  function getState() {
    if (!window.BOTC_STATE) {
      window.BOTC_STATE = {
        once: { tb: {}, bmr: {} },
        night: { tb: {}, bmr: {} },
        log: []
      };
    }
    if (!window.BOTC_STATE.once) window.BOTC_STATE.once = { tb: {}, bmr: {} };
    if (!window.BOTC_STATE.once.tb) window.BOTC_STATE.once.tb = {};
    if (!window.BOTC_STATE.once.bmr) window.BOTC_STATE.once.bmr = {};
    if (!window.BOTC_STATE.night) window.BOTC_STATE.night = { tb: {}, bmr: {} };
    if (!window.BOTC_STATE.night.tb) window.BOTC_STATE.night.tb = {};
    if (!window.BOTC_STATE.night.bmr) window.BOTC_STATE.night.bmr = {};
    if (!Array.isArray(window.BOTC_STATE.log)) window.BOTC_STATE.log = [];
    return window.BOTC_STATE;
  }

  function getSeats() {
    return (typeof seats !== 'undefined' && Array.isArray(seats)) ? seats : [];
  }

  function getSeatById(id) {
    var list = getSeats();
    for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i];
    return null;
  }

  function getNeighbors(seatId) {
    var list = getSeats();
    var n = list.length;
    if (!n) return [];
    var idx = -1;
    for (var i = 0; i < n; i++) if (String(list[i].id) === String(seatId)) { idx = i; break; }
    if (idx < 0) return [];
    var left = list[(idx - 1 + n) % n];
    var right = list[(idx + 1) % n];
    return [left, right];
  }

  function getAliveNeighbors(seatId) {
    return getNeighbors(seatId).filter(function (s) { return s.alive !== false; });
  }

  function abilityScriptKey() {
    if (typeof getActiveScriptKey === 'function') return getActiveScriptKey();
    if (typeof currentScript !== 'undefined' && currentScript) return currentScript;
    if (typeof gameSetup !== 'undefined' && gameSetup && gameSetup.script) return gameSetup.script;
    return 'trouble_brewing';
  }

  /**
   * Rollen-IDs auf dem aktiven Script mit einem dieser type-Werte (lowercase).
   */
  function scriptRoleIdsByTypes(scriptKey, typesLower) {
    var sk = scriptKey || abilityScriptKey();
    var set = typeof expandScriptRoleIds === 'function' ? expandScriptRoleIds(sk) : null;
    if (!set || !set.size) return [];
    var types = typesLower || [];
    var out = [];
    set.forEach(function (id) {
      var r = typeof ROLES !== 'undefined' ? ROLES[id] : null;
      if (!r || String(r.type || '').toLowerCase() === 'fabled') return;
      var t = String(r.type || '').toLowerCase();
      if (types.indexOf(t) >= 0) out.push(id);
    });
    out.sort();
    return out;
  }

  function poolForFirstNightInfo(metaType) {
    var mt = String(metaType || '').toLowerCase();
    var fromSeats = getSeats()
      .filter(function (s) {
        var rk = s.role || s.roleId;
        if (!rk || !ROLES[rk]) return false;
        return String(ROLES[rk].type || '').toLowerCase() === mt;
      })
      .map(function (s) { return s.role || s.roleId; })
      .filter(function (v, i, a) { return v && a.indexOf(v) === i; });
    if (fromSeats.length) return fromSeats;
    return scriptRoleIdsByTypes(abilityScriptKey(), [mt]);
  }

  function isDemonSeat(s) {
    var rk = s && (s.role || s.roleId);
    if (!rk || typeof ROLES === 'undefined' || !ROLES[rk]) return false;
    return String(ROLES[rk].type || '').toLowerCase() === 'demon';
  }

  function isTownsfolkRoleId(roleId) {
    if (!roleId || typeof ROLES === 'undefined' || !ROLES[roleId]) return false;
    return String(ROLES[roleId].type || '').toLowerCase() === 'townsfolk';
  }

  function isGoodAliveSeat(s) {
    if (!s || s.alive === false) return false;
    var rk = s.role || s.roleId;
    if (!rk || typeof ROLES === 'undefined' || !ROLES[rk]) return false;
    return String(ROLES[rk].team || '').toLowerCase() === 'good';
  }

  function gamblerGuessRoleKeys() {
    var sk = abilityScriptKey();
    var ids = typeof expandScriptRoleIds === 'function'
      ? Array.from(expandScriptRoleIds(sk))
      : Object.keys(typeof ROLES !== 'undefined' ? ROLES : {});
    return ids.filter(function (k) {
      var r = ROLES[k];
      return r && String(r.type || '').toLowerCase() !== 'fabled';
    });
  }

  function isEvilTeam(seat) {
    if (!seat) return false;
    var t = (seat.team || '').toLowerCase();
    if (t === 'evil' || t === 'minion' || t === 'demon') return true;
    var rk = seat.role || seat.roleId;
    if (rk && typeof ROLES !== 'undefined' && ROLES[rk]) {
      var ty = String(ROLES[rk].type || '').toLowerCase();
      if (ty === 'minion' || ty === 'demon') return true;
      var tm = String(ROLES[rk].team || '').toLowerCase();
      if (tm === 'evil') return true;
    }
    return false;
  }

  function botcNotifyFallback(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg, 4500);
    else if (typeof console !== 'undefined' && console.warn) console.warn('[BotC]', msg);
  }

  function center(title, body, copyBtn) {
    if (typeof window.showToast === 'function') {
      window.showToast((title || '') + (body ? ' — ' + body : ''), 5000);
    } else {
      botcNotifyFallback((title || '') + (body ? '\n' + body : ''));
    }
  }

  function flash(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg, 2000);
  }

  function log(event) {
    var st = getState();
    st.log.push({ t: Date.now(), msg: String(event) });
    if (st.log.length > 500) st.log.shift();
  }

  function setReminder(seatId, r) { /* optional: set seat.reminder push */ }
  function clearReminder(seatId, r) { /* optional */ }

  function save() {
    if (typeof scheduleSave === 'function') scheduleSave();
  }
  function draw() {
    if (typeof window.draw === 'function') window.draw();
  }

  // Pick one seat: show overlay with seat list; resolve with selected seat id (async via callback).
  function getAliveSeats() {
    return getSeats().filter(function (s) { return s.alive !== false; });
  }

  function buildCtx() {
    var st = getState();
    var openOverlay = typeof window.openOverlay === 'function' ? window.openOverlay : function (t, b, btns) { botcNotifyFallback(t); };
    var beginPick = typeof window.beginPick === 'function' ? window.beginPick : function (opts) { if (opts && opts.onDone) opts.onDone([]); };
    var setFlagFn = typeof window.setFlag === 'function' ? window.setFlag : function () {};
    var clearFlagFn = typeof window.clearFlag === 'function' ? window.clearFlag : function () {};
    var toast = typeof window.showToast === 'function' ? window.showToast : function (m) { botcNotifyFallback(m); };
    return {
      state: st,
      seats: getSeats(),
      openOverlay: openOverlay,
      toast: toast,
      beginPick: beginPick,
      setFlag: setFlagFn,
      clearFlag: clearFlagFn,
      getNeighbors: getNeighbors,
      getAliveNeighbors: getAliveNeighbors,
      getAliveSeats: getAliveSeats,
      getSeatById: getSeatById,
      getSeat: getSeatById,
      save: function () { if (typeof scheduleSave === 'function') scheduleSave(); },
      draw: function () { if (typeof window.draw === 'function') window.draw(); },
      log: log
    };
  }

  function isAlive(s) { return s && s.alive !== false; }
  function seatName(s) { return (s && (s.name || s.id)) ? (s.name || 'Sitz ' + s.id) : '?'; }
  function big(ctx, title, main, sub) {
    var html = '<div style="font-size:1.5rem;font-weight:700;margin:0.5em 0;">' + (main || '') + '</div>' + (sub ? '<div style="font-size:0.95rem;opacity:.85;">' + sub + '</div>' : '');
    ctx.openOverlay(title || '', html);
  }
  function choice(ctx, title, html, buttons) {
    ctx.openOverlay(title || '', html || '', buttons || []);
  }

  // ——— Trouble Brewing abilities ———

  function chef(ctx) {
    var list = ctx.seats;
    var n = list.length;
    if (n < 2) { ctx.openOverlay('Chef', 'Zu wenig Spieler im Kreis.'); return; }
    var pairs = [];
    for (var i = 0; i < n; i++) {
      var a = list[i], b = list[(i + 1) % n];
      if (isEvilTeam(a) && isEvilTeam(b)) pairs.push([a, b]);
    }
    var pairNames = pairs.map(function (p) { return (p[0].name || p[0].id) + ' – ' + (p[1].name || p[1].id); }).join(', ');
    ctx.log('Chef sieht: ' + pairs.length + ' Paare');
    ctx.openOverlay('Koch sieht: ' + pairs.length + ' Paare', pairs.length ? pairNames : 'Keine evil Paare nebeneinander.');
  }

  function roleLabel(roleId) {
    if (typeof ROLES !== 'undefined' && ROLES[roleId]) return ROLES[roleId].name || ROLES[roleId].n || roleId;
    return roleId;
  }

  function washerwoman(ctx) {
    var inPlayRoles = poolForFirstNightInfo('townsfolk');
    if (!inPlayRoles.length) { ctx.openOverlay('Waschweib', 'Keine Townsfolk im Script gefunden.', [{label:'OK', onClick:function(){}}]); return; }
    var btns = inPlayRoles.map(function(r) {
      return { label: roleLabel(r), onClick: function() { pickTwoAndShow(ctx, r, 'Waschweib'); } };
    });
    ctx.openOverlay('Waschweib: Welche Rolle wird gezeigt?', 'Wähle die Rolle (ST zeigt sie dem Spieler).', btns);
  }

  function librarian(ctx) {
    var inPlayRoles = poolForFirstNightInfo('outsider');
    if (!inPlayRoles.length) { ctx.openOverlay('Bibliothekar', 'Keine Outsider im Script gefunden.', [{label:'OK', onClick:function(){}}]); return; }
    var btns = inPlayRoles.map(function(r) {
      return { label: roleLabel(r), onClick: function() { pickTwoAndShow(ctx, r, 'Bibliothekar'); } };
    });
    ctx.openOverlay('Bibliothekar: Welche Rolle wird gezeigt?', 'Wähle Outsider-Rolle (ST).', btns);
  }

  function investigator(ctx) {
    var inPlayRoles = poolForFirstNightInfo('minion');
    if (!inPlayRoles.length) { ctx.openOverlay('Detektiv', 'Keine Minions im Script gefunden.', [{label:'OK', onClick:function(){}}]); return; }
    var btns = inPlayRoles.map(function(r) {
      return { label: roleLabel(r), onClick: function() { pickTwoAndShow(ctx, r, 'Detektiv'); } };
    });
    ctx.openOverlay('Detektiv: Welche Rolle wird gezeigt?', 'Wähle Minion-Rolle (ST).', btns);
  }

  function pickTwoAndShow(ctx, chosenRoleKey, abilityName) {
    ctx.beginPick({
      title: abilityName + ': Wähle die 2 Spieler',
      count: 2,
      filterFn: function () { return true; },
      onDone: function (selected) {
        if (!selected || selected.length < 2) return;
        ctx.state.night.tb = ctx.state.night.tb || {};
        ctx.state.night.tb.lastShown = { role: chosenRoleKey, seatIds: [selected[0].id, selected[1].id] };
        var seatA = selected[0];
        var seatB = selected[1];
        var nameA = seatA ? (seatA.name || seatA.id) : '';
        var nameB = seatB ? (seatB.name || seatB.id) : '';
        var roleName = roleLabel(chosenRoleKey);
        ctx.log(abilityName + ' zeigt „Einer von diesen ist ' + roleName + '“: ' + nameA + ', ' + nameB);

        var existing = document.getElementById('privateInfoOverlay');
        if (existing) existing.remove();

        var overlay = document.createElement('div');
        overlay.id = 'privateInfoOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;';

        var iconFn = (typeof window !== 'undefined' && typeof window.BOTC_iconHref === 'function') ? window.BOTC_iconHref : null;
        var iconSrc = iconFn ? iconFn(chosenRoleKey) : '';

        var html =
          '<div style="max-width:1100px;width:100%;display:flex;flex-direction:column;align-items:center;gap:32px;">' +
            '<div style="display:flex;flex-direction:row;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;">' +
              '<div style="flex:1;min-width:200px;text-align:center;font-family:\'Cinzel\',serif;font-size:48px;color:var(--gold,#c9a84c);">' + String(nameA || '') + '</div>' +
              '<div style="flex:0 0 auto;display:flex;flex-direction:column;align-items:center;gap:16px;">' +
                (iconSrc ? '<div style="width:220px;height:220px;border-radius:50%;border:4px solid var(--gold,#c9a84c);overflow:hidden;box-shadow:0 0 40px rgba(0,0,0,.9);"><img src="' + String(iconSrc) + '" alt="" style="width:100%;height:100%;object-fit:cover;"></div>' : '') +
                '<div style="font-size:36px;color:#f5f0e6;font-family:\'Cinzel\',serif;text-align:center;">' + String(roleName || '') + '</div>' +
              '</div>' +
              '<div style="flex:1;min-width:200px;text-align:center;font-family:\'Cinzel\',serif;font-size:48px;color:var(--gold,#c9a84c);">' + String(nameB || '') + '</div>' +
            '</div>' +
            '<button type="button" id="privateInfoOverlayClose" style="margin-top:8px;min-width:260px;min-height:60px;font-size:24px;border:2px solid var(--gold,#c9a84c);border-radius:999px;background:transparent;color:var(--gold,#c9a84c);padding:8px 32px;cursor:pointer;">FERTIG</button>' +
          '</div>';

        overlay.innerHTML = html;

        overlay.addEventListener('click', function (ev) {
          if (ev.target === overlay) overlay.remove();
        });
        var closeBtn = overlay.querySelector('#privateInfoOverlayClose');
        if (closeBtn) {
          closeBtn.addEventListener('click', function () {
            overlay.remove();
          });
        }

        document.body.appendChild(overlay);
      }
    });
  }

  function empath(ctx) {
    var list = ctx.seats.filter(function (s) { return (s.role || s.roleId || '').toLowerCase() === 'empath'; });
    var seat;
    if (list.length === 0) {
      ctx.toast('Kein Empath im Spiel');
      return;
    }
    if (list.length > 1) {
      ctx.beginPick({
        title: 'Wähle den Empath',
        count: 1,
        filterFn: function (s) { return (s.role || s.roleId || '').toLowerCase() === 'empath'; },
        onDone: function (sel) {
          if (!sel || !sel[0]) return;
          runEmpath(ctx, sel[0]);
        }
      });
      return;
    }
    seat = list[0];
    runEmpath(ctx, seat);
  }

  function runEmpath(ctx, seat) {
    var poisoned = seat.flags && seat.flags.poisoned;
    var drunk = seat.flags && seat.flags.drunk;
    if (poisoned || drunk) {
      ctx.openOverlay('Empath (drunk/poisoned)', 'Ergebnis frei wählbar.', [
        { label: '0', onClick: function () { ctx.openOverlay('Empath sieht', '0'); } },
        { label: '1', onClick: function () { ctx.openOverlay('Empath sieht', '1'); } },
        { label: '2', onClick: function () { ctx.openOverlay('Empath sieht', '2'); } }
      ]);
      return;
    }
    var neigh = ctx.getAliveNeighbors(seat.id);
    var evilCount = 0;
    neigh.forEach(function (s) { if (isEvilTeam(s)) evilCount++; });
    ctx.log('Empath ' + seat.id + ' sieht ' + evilCount + ' böse Nachbarn');
    ctx.openOverlay('Empath sieht', String(evilCount));
  }

  function fortune_teller(ctx) {
    var st = ctx.state.once.tb;
    if (!st.redHerringSeatId) {
      ctx.beginPick({
        title: 'Wahrsagerin: Red Herring setzen (einmalig)',
        count: 1,
        filterFn: function () { return true; },
        onDone: function (selected) {
          if (!selected || !selected[0]) return;
          st.redHerringSeatId = selected[0].id;
          ctx.toast('Red Herring: ' + (selected[0].name || selected[0].id));
          fortune_teller(ctx);
        }
      });
      return;
    }
    ctx.beginPick({
      title: 'Wahrsagerin: Wähle 2 Spieler',
      count: 2,
      filterFn: function () { return true; },
      onDone: function (picked) {
        if (!picked || picked.length < 2) return;
        var demon = picked.some(function (s) { return isDemonSeat(s); });
        var redHerr = picked.some(function (s) { return s.id === st.redHerringSeatId; });
        var yes = demon || redHerr;
        var seat = ctx.seats.find(function (s) { return (s.role || s.roleId || '').toLowerCase() === 'fortune_teller' || (s.role || '').toLowerCase() === 'fortuneteller'; });
        var poisoned = seat && seat.flags && (seat.flags.poisoned || seat.flags.drunk);
        if (poisoned) {
          ctx.openOverlay('Wahrsagerin (drunk/poisoned)', 'Ergebnis frei wählbar.', [
            { label: 'JA', onClick: function () { ctx.openOverlay('Wahrsagerin', 'JA'); } },
            { label: 'NEIN', onClick: function () { ctx.openOverlay('Wahrsagerin', 'NEIN'); } }
          ]);
          return;
        }
        ctx.log('FT fragt ' + picked.map(function (s) { return s.id; }).join(', ') + ' → ' + (yes ? 'Ja' : 'Nein'));
        ctx.openOverlay('Wahrsagerin', yes ? 'JA' : 'NEIN');
      }
    });
  }

  function dreamer(ctx) {
    ctx.beginPick({
      title: 'Träumer: Wähle 1 Spieler',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var sk = abilityScriptKey();
        var goodIds = scriptRoleIdsByTypes(sk, ['townsfolk', 'outsider']);
        var evilIds = scriptRoleIdsByTypes(sk, ['minion', 'demon']);
        if (!goodIds.length || !evilIds.length) {
          ctx.openOverlay('Träumer', 'Script hat keine passenden guten/bösen Rollen.', [{label:'OK', onClick:function(){}}]);
          return;
        }
        var btnsGood = goodIds.map(function (gid) {
          return {
            label: roleLabel(gid),
            onClick: function () {
              var btnsEvil = evilIds.map(function (eid) {
                return {
                  label: roleLabel(eid),
                  onClick: function () {
                    ctx.log('Dreamer → ' + seatName(target) + ': Tokens ' + gid + ' + ' + eid);
                    big(ctx, 'Träumer (ST)', seatName(target) + ' sieht: ' + roleLabel(gid) + ' und ' + roleLabel(eid) + ' (genau eines ist korrekt).');
                  }
                };
              });
              ctx.openOverlay('Träumer: Zweites Token (böse)', 'Wähle das gezeigte Minion-/Dämon-Token.', btnsEvil);
            }
          };
        });
        ctx.openOverlay('Träumer: Erstes Token (gut)', 'Wähle das gezeigte Townsfolk-/Outsider-Token für ' + seatName(target) + '.', btnsGood);
      }
    });
  }

  function undertaker(ctx) {
    // Undertaker sieht nur die heute HINGERICHTETE Person (nicht nacht-tote)
    var execId = typeof window.BOTC_executedSeatId !== 'undefined' ? window.BOTC_executedSeatId : null;
    if (!execId) {
      ctx.openOverlay(
        'Totenbestatter',
        'Heute wurde niemand hingerichtet.',
        [{ label: 'OK', onClick: function() {} }]
      );
      return;
    }
    var execSeat = getSeats().find(function(s) { return String(s.id) === String(execId); });
    if (!execSeat || !execSeat.role) {
      ctx.openOverlay(
        'Totenbestatter',
        'Hingerichteter Sitz nicht gefunden.',
        [{ label: 'OK', onClick: function() {} }]
      );
      return;
    }
    var rName = (typeof ROLES !== 'undefined' && ROLES[execSeat.role])
      ? (ROLES[execSeat.role].name || ROLES[execSeat.role].n || execSeat.role)
      : execSeat.role;
    ctx.openOverlay(
      'Totenbestatter',
      (execSeat.name || 'Sitz ' + execSeat.id) + ' war: <strong>' + rName + '</strong>',
      [{ label: 'OK', onClick: function() {} }]
    );
  }

  function monk(ctx) {
    ctx.beginPick({
      title: 'Mönch: Wähle Schutz-Ziel',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var seat = selected[0];
        ctx.state.night.tb.monkProtectedSeatId = seat.id;
        ctx.setFlag(seat.id, 'protected', true);
        ctx.log('Monk schützt ' + seat.id);
        ctx.toast('Geschützt: ' + (seat.name || seat.id));
        ctx.save();
        ctx.draw();
      }
    });
  }

  function ravenkeeper(ctx) {
    // Ravenkeeper only acts the night they die
    var rkSeat = ctx.seats.find(function(s) {
      return (s.role || s.roleId || '').toLowerCase() === 'ravenkeeper';
    });
    if (rkSeat && rkSeat.alive !== false) {
      ctx.openOverlay('Rabenhüter', 'Ist noch am Leben – erwacht erst wenn er diese Nacht stirbt.');
      return;
    }
    ctx.beginPick({
      title: 'Rabenhüter: Wähle einen Spieler (zeige dessen Rolle)',
      count: 1,
      filterFn: function() { return true; },
      onDone: function(selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var rid = target.role || target.roleId;
        var roleName = (typeof ROLES !== 'undefined' && rid && ROLES[rid])
          ? (ROLES[rid].name || ROLES[rid].n || rid)
          : (rid || '?');
        ctx.log('Rabenhüter sieht: ' + (target.name || target.id) + ' = ' + roleName);
        // Show the role to the (now dead) Ravenkeeper player
        var existing = document.getElementById('privateInfoOverlay');
        if (existing) existing.remove();
        var overlay = document.createElement('div');
        overlay.id = 'privateInfoOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;';
        var iconFn = (typeof window !== 'undefined' && typeof window.BOTC_iconHref === 'function') ? window.BOTC_iconHref : null;
        var iconSrc = iconFn ? iconFn(rid) : '';
        var html =
          '<div style="max-width:600px;width:100%;display:flex;flex-direction:column;align-items:center;gap:32px;">' +
            '<div style="font-size:20px;color:rgba(255,255,255,.6);font-family:\'Cinzel\',serif;">Rabenhüter sieht:</div>' +
            '<div style="font-size:48px;color:#c9a84c;font-family:\'Cinzel\',serif;">' + String(target.name || 'Sitz ' + target.id) + '</div>' +
            (iconSrc ? '<div style="width:180px;height:180px;border-radius:50%;border:4px solid #c9a84c;overflow:hidden;"><img src="' + iconSrc + '" alt="" style="width:100%;height:100%;object-fit:cover;"></div>' : '') +
            '<div style="font-size:36px;color:#f5f0e6;font-family:\'Cinzel\',serif;">' + String(roleName) + '</div>' +
            '<button type="button" id="privateInfoOverlayClose" style="min-width:200px;min-height:52px;font-size:20px;border:2px solid #c9a84c;border-radius:999px;background:transparent;color:#c9a84c;cursor:pointer;">FERTIG</button>' +
          '</div>';
        overlay.innerHTML = html;
        overlay.addEventListener('click', function(ev) { if (ev.target === overlay) overlay.remove(); });
        var closeBtn = overlay.querySelector('#privateInfoOverlayClose');
        if (closeBtn) closeBtn.addEventListener('click', function() { overlay.remove(); });
        document.body.appendChild(overlay);
      }
    });
  }

  function virgin(ctx) {
    if (ctx.state.once.tb.virginUsed) {
      ctx.openOverlay('Jungfrau', 'Bereits ausgelöst.');
      return;
    }
    ctx.beginPick({
      title: 'Jungfrau: Wähle Nominierenden',
      count: 1,
      filterFn: function () { return true; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var nominator = selected[0];
        var nomRole = nominator.role || nominator.roleId;
        var dies = isTownsfolkRoleId(nomRole);
        if (dies) {
          ctx.state.once.tb.virginUsed = true;
          ctx.setFlag(nominator.id, 'dead', true);
          ctx.log('Virgin: Nominierender ' + nominator.id + ' stirbt');
          ctx.openOverlay('Jungfrau', 'Nominierender stirbt.');
        } else {
          ctx.openOverlay('Jungfrau', 'Nichts passiert.');
        }
        ctx.save();
        ctx.draw();
      }
    });
  }

  function slayer(ctx) {
    if (ctx.state.once.tb.slayerUsed) {
      ctx.openOverlay('Dämonenjäger', 'Bereits geschossen.');
      return;
    }
    ctx.beginPick({
      title: 'Dämonenjäger schießt',
      count: 1,
      filterFn: function () { return true; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        ctx.state.once.tb.slayerUsed = true;
        var demon = isDemonSeat(target);
        var poisoned = ctx.seats.some(function (s) { return (s.role || s.roleId || '').toLowerCase() === 'slayer' && s.flags && (s.flags.poisoned || s.flags.drunk); });
        if (poisoned) {
          ctx.openOverlay('Dämonenjäger (drunk/poisoned)', 'ST entscheidet.', [
            { label: 'Stirbt', onClick: function () { ctx.setFlag(target.id, 'dead', true); ctx.save(); ctx.draw(); ctx.toast('Ziel tot'); } },
            { label: 'Nichts', onClick: function () { ctx.toast('Nichts passiert'); } }
          ]);
          return;
        }
        if (demon) {
          ctx.setFlag(target.id, 'dead', true);
          ctx.log('Slayer trifft Demon ' + target.id);
          if (typeof window.BOTC_checkScarletWomanTrigger === 'function') {
            window.BOTC_checkScarletWomanTrigger(target.id);
          }
          ctx.openOverlay('Dämonenjäger', 'Demon getroffen – tot.');
        } else {
          ctx.log('Slayer verfehlt ' + target.id);
          ctx.openOverlay('Dämonenjäger', 'Verfehlt.');
        }
        ctx.save();
        ctx.draw();
      }
    });
  }

  function soldier(ctx) {
    ctx.openOverlay('Soldat', 'Passiv: Ist immun gegen Nacht-Kills des Dämons (solange nicht drunk/poisoned).', [
      { label: 'Soldat ist drunk/poisoned → Kill geht durch', onClick: function() { big(ctx, 'Soldat', 'ST-Entscheid: Kill geht durch.'); }},
      { label: 'OK', onClick: function() {} }
    ]);
  }

  function mayor(ctx) {
    var alive = ctx.seats.filter(function (s) { return s.alive !== false; }).length;
    var goodWin = alive <= 3;
    ctx.openOverlay('Bürgermeister', 'Lebende: ' + alive + (goodWin ? ' → ⚠ Nur 3 lebend! Bei Dämon-Kill auf Mayor: Good gewinnt.' : '. Noch nicht relevant.'), [
      { label: 'Good gewinnt jetzt', onClick: function() { big(ctx, 'Bürgermeister: Sieg!', 'Good gewinnt!'); }},
      { label: 'OK', onClick: function() {} }
    ]);
  }

  function butler(ctx) {
    var once = ctx.state.once.tb;
    if (!once.butlerMasterId) {
      ctx.beginPick({
        title: 'Butler: Master wählen (1. Nacht)',
        count: 1,
        filterFn: function(s) { return s.alive !== false; },
        onDone: function(selected) {
          if (!selected || !selected[0]) return;
          once.butlerMasterId = selected[0].id;
          ctx.toast('Butler: Master ist ' + (selected[0].name || 'Sitz ' + selected[0].id), 3000);
          ctx.save();
        }
      });
    } else {
      var master = ctx.getSeatById(once.butlerMasterId);
      var masterName = master ? (master.name || 'Sitz ' + master.id) : '?';
      ctx.openOverlay('Butler',
        'Master: <strong>' + masterName + '</strong><br>Butler darf nur abstimmen wenn der Master abstimmt.',
        [
          { label: 'Master wechseln', onClick: function() { delete once.butlerMasterId; butler(ctx); } },
          { label: 'OK', onClick: function() {} }
        ]
      );
    }
  }

  function drunk(ctx) {
    ctx.openOverlay('Trunkenbold', 'Glaubt eine Townsfolk-Rolle zu sein — aber ist immer drunk. Alle Fähigkeiten schlagen fehl.', [{label: 'OK', onClick: function() {}}]);
  }

  function recluse(ctx) {
    ctx.openOverlay('Eingänger', 'Kann als Minion/Dämon/Evil registrieren — ST entscheidet von Fall zu Fall.', [{label: 'OK', onClick: function() {}}]);
  }

  function saint(ctx) {
    ctx.openOverlay('Heilige', '⚠ Wenn die Heilige exekutiert wird: Evil gewinnt sofort!', [{label: 'OK', onClick: function() {}}]);
  }

  function poisoner(ctx) {
    ctx.beginPick({
      title: 'Giftmischer: Wähle Ziel',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var seat = selected[0];
        ctx.state.night.tb.poisonedByPoisoner = seat.id;
        ctx.setFlag(seat.id, 'poisoned', true);
        ctx.log('Poisoner vergiftet ' + seat.id);
        ctx.toast('Vergiftet: ' + (seat.name || seat.id));
        ctx.save();
        ctx.draw();
      }
    });
  }

  function spy(ctx) {
    ctx.openOverlay('Spion', 'Sieht das Grimoire jede Nacht. Registriert als Good. Kann als Townsfolk/Outsider lesen.', [{label: 'OK', onClick: function() {}}]);
  }

  function scarletwoman(ctx) {
    ctx.openOverlay('Scharlachrote Frau', 'Triggert automatisch wenn Dämon stirbt und ≥5 Spieler leben. Schau ins Grimoire.', [
      { label: 'SW wird jetzt Dämon', onClick: function() {
        var deadDemon = ctx.seats.find(function(s) { return s.alive === false && isDemonSeat(s); });
        if (deadDemon && typeof window.BOTC_checkScarletWomanTrigger === 'function') {
          window.BOTC_checkScarletWomanTrigger(deadDemon.id);
        } else {
          big(ctx, 'Scharlachrote Frau', 'Kein toter Dämon gefunden — prüfe manuell im Grimoire.');
        }
      }},
      { label: 'OK', onClick: function() {} }
    ]);
  }

  // ——— Scharlachrote Frau: automatischer Dämon-Übergang ———
  // Wird aufgerufen wenn ein Sitz stirbt (von imp, slayer, triggerLynch etc.)
  window.BOTC_checkScarletWomanTrigger = function(diedSeatId) {
    var allSeats = getSeats();
    var diedSeat = allSeats.find(function(s) { return String(s.id) === String(diedSeatId); });
    if (!diedSeat) return;
    if (!isDemonSeat(diedSeat)) return; // nur wenn ein Dämon gestorben ist
    // ≥5 lebende Spieler erforderlich (den gerade gestorbenen Dämon nicht mitzählen)
    var alive = allSeats.filter(function(s) { return s.alive !== false; }).length;
    if (alive < 5) return;
    // Lebende Scharlachrote Frau suchen
    var sw = allSeats.find(function(s) {
      if (s.alive === false) return false;
      return (s.role || s.roleId || '').toLowerCase().replace(/_/g, '') === 'scarletwoman';
    });
    if (!sw) return;
    // SW bekommt die Dämon-Rolle
    var demonRole = diedSeat.role || diedSeat.roleId || 'imp';
    sw.role = demonRole;
    sw.roleId = demonRole;
    var demonRoleName = (typeof ROLES !== 'undefined' && ROLES[demonRole])
      ? (ROLES[demonRole].name || ROLES[demonRole].n || demonRole) : demonRole;
    var swName = sw.name || ('Sitz ' + sw.id);
    if (typeof window.botcStoryLogAppend === 'function') {
      window.botcStoryLogAppend('Scharlachrote Frau (' + swName + ') wird ' + demonRoleName + '!');
    }
    if (typeof window.openOverlay === 'function') {
      window.openOverlay('⚠ Scharlachrote Frau!',
        '<strong>' + swName + '</strong> wird jetzt <strong>' + demonRoleName + '</strong>!<br><br>Rolle im Grimoire aktualisiert.');
    }
    if (typeof scheduleSave === 'function') scheduleSave();
    if (typeof window.draw === 'function') window.draw();
    if (typeof window.buildNightOrder === 'function') window.buildNightOrder();
    if (typeof window.renderNightOrder === 'function') window.renderNightOrder();
  };

  function baron(ctx) {
    ctx.openOverlay('Baron', 'Setup-Effekt: +2 Outsider im Spiel. Keine Nacht-Aktion.', [{label: 'OK', onClick: function() {}}]);
  }

  function imp(ctx) {
    // Imp-Sitz vorab finden (für Suizid-Erkennung)
    var impSeat = ctx.seats.find(function(s) {
      return (s.role || s.roleId || '').toLowerCase() === 'imp' && s.alive !== false;
    });
    ctx.beginPick({
      title: 'Dämon: Wähle Nacht-Kill',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        ctx.state.night.tb.demonKillTargetId = target.id;

        // ——— Imp tötet sich selbst (Suizid) → zufälliger Minion wird neuer Imp ———
        if (impSeat && String(target.id) === String(impSeat.id)) {
          ctx.setFlag(target.id, 'dead', true);
          ctx.log('Imp: Suizid');
          var livingMinions = ctx.seats.filter(function(s) {
            if (s.alive === false) return false;
            var rk = s.role || s.roleId;
            if (!rk || typeof ROLES === 'undefined' || !ROLES[rk]) return false;
            return String(ROLES[rk].type || '').toLowerCase() === 'minion';
          });
          if (livingMinions.length) {
            var newImp = livingMinions[Math.floor(Math.random() * livingMinions.length)];
            var newImpName = newImp.name || ('Sitz ' + newImp.id);
            var oldRole = newImp.role || newImp.roleId;
            var oldRoleName = (typeof ROLES !== 'undefined' && ROLES[oldRole])
              ? (ROLES[oldRole].name || ROLES[oldRole].n || oldRole) : (oldRole || '?');
            newImp.role = 'imp'; newImp.roleId = 'imp';
            ctx.log('Neuer Imp: ' + newImpName + ' (war ' + oldRoleName + ')');
            ctx.openOverlay('Imp: Suizid',
              (target.name || 'Imp') + ' stirbt.<br><br>Neuer Imp: <strong>' + newImpName +
              '</strong> (war ' + oldRoleName + ').<br>Token im Grimoire tauschen!');
          } else {
            ctx.openOverlay('Imp: Suizid',
              (target.name || 'Imp') + ' stirbt.<br><br>Keine lebenden Minions vorhanden.<br>Prüfe Scharlachrote Frau!');
            if (typeof window.BOTC_checkScarletWomanTrigger === 'function') {
              window.BOTC_checkScarletWomanTrigger(target.id);
            }
          }
          ctx.save(); ctx.draw();
          if (typeof window.buildNightOrder === 'function') window.buildNightOrder();
          if (typeof window.renderNightOrder === 'function') window.renderNightOrder();
          return;
        }

        var targetRoleKey = (target.role || target.roleId || '').toLowerCase();
        // Soldier only blocks kill when NOT drunk/poisoned
        var soldierActive = targetRoleKey === 'soldier' && !(target.flags && (target.flags.poisoned || target.flags.drunk));
        var monkProt = ctx.state.night.tb.monkProtectedSeatId === target.id;
        if (soldierActive) {
          ctx.toast('Kill geblockt (Soldier)');
          ctx.log('Imp zielt auf Soldier ' + target.id + ' — blockiert');
          ctx.openOverlay('Dämon-Kill', 'Geblockt: Soldier.');
          return;
        }
        if (monkProt) {
          ctx.toast('Kill geblockt (Monk)');
          ctx.log('Imp zielt auf ' + target.id + ' — von Monk geschützt');
          ctx.openOverlay('Dämon-Kill', 'Geblockt: Monk-Schutz.');
          return;
        }
        ctx.setFlag(target.id, 'dead', true);
        ctx.log('Imp tötet ' + target.id);
        ctx.toast('Dämon-Ziel: ' + (target.name || target.id));
        ctx.openOverlay('Dämon-Kill', (target.name || target.id));
        ctx.save();
        ctx.draw();
      }
    });
  }

  // ——— Bad Moon Rising abilities ———

  function findSingleSeat(ctx, roleId) {
    var list = ctx.seats.filter(function (s) {
      return (s.role || s.roleId || '').toLowerCase() === roleId;
    });
    return list.length === 1 ? list[0] : null;
  }

  // Sailor – "Each night, choose an alive player: either you or they are drunk until dusk. You can't die."
  function sailor(ctx) {
    var sailorSeat = findSingleSeat(ctx, 'sailor');
    ctx.beginPick({
      title: 'Seegler: Wähle einen lebenden Spieler',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var sailorName = sailorSeat ? (sailorSeat.name || sailorSeat.id) : 'Seegler';
        var targetName = target.name || target.id;
        ctx.openOverlay('Seegler: Wer ist drunk bis Dusk?', 'Einer von Seegler oder Ziel ist drunk bis Dusk. Seegler kann diese Nacht nicht sterben.', [
          { label: sailorName + ' drunk', onClick: function () {
            if (sailorSeat) { ctx.setFlag(sailorSeat.id, 'drunkUntilDusk', true); }
            if (sailorSeat) { ctx.setFlag(sailorSeat.id, 'cannotDieAtNight', true); }
            ctx.state.night.bmr.sailorTargetId = target.id;
            big(ctx, 'Seegler: OK', sailorName + ' ist drunk bis Dusk');
            ctx.save(); ctx.draw();
          }},
          { label: targetName + ' drunk', onClick: function () {
            ctx.setFlag(target.id, 'drunkUntilDusk', true);
            if (sailorSeat) { ctx.setFlag(sailorSeat.id, 'cannotDieAtNight', true); }
            ctx.state.night.bmr.sailorTargetId = target.id;
            big(ctx, 'Seegler: OK', targetName + ' ist drunk bis Dusk');
            ctx.save(); ctx.draw();
          }},
          { label: 'Niemand', onClick: function () {
            if (sailorSeat) { ctx.setFlag(sailorSeat.id, 'cannotDieAtNight', true); }
            big(ctx, 'Seegler: OK', 'Niemand drunk (nur Schutz).');
            ctx.save(); ctx.draw();
          }}
        ]);
      }
    });
  }

  // Chambermaid – "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability."
  function chambermaid(ctx) {
    var owner = findSingleSeat(ctx, 'chambermaid');
    function filterFn(s) {
      if (s.alive === false) return false;
      if (!owner) return true;
      return s.id !== owner.id;
    }
    ctx.beginPick({
      title: 'Kammerzofe: Wähle 2 lebende Spieler (nicht dich selbst)',
      count: 2,
      filterFn: filterFn,
      onDone: function (selected) {
        if (!selected || selected.length < 2) return;
        var a = selected[0], b = selected[1];
        var names = seatName(a) + ', ' + seatName(b);
        ctx.openOverlay('Kammerzofe: Wie viele wachten auf?', names, [
          { label: '0', onClick: function () {
            ctx.state.night.bmr.chambermaidLast = { a: a.id, b: b.id, result: 0 };
            big(ctx, 'Kammerzofe', '0');
            ctx.save(); ctx.draw();
          }},
          { label: '1', onClick: function () {
            ctx.state.night.bmr.chambermaidLast = { a: a.id, b: b.id, result: 1 };
            big(ctx, 'Kammerzofe', '1');
            ctx.save(); ctx.draw();
          }},
          { label: '2', onClick: function () {
            ctx.state.night.bmr.chambermaidLast = { a: a.id, b: b.id, result: 2 };
            big(ctx, 'Kammerzofe', '2');
            ctx.save(); ctx.draw();
          }}
        ]);
      }
    });
  }

  // Exorcist – "Each night*, choose a player (different to last night): the Demon, if chosen, does not wake tonight; otherwise, they learn who you are."
  function exorcist(ctx) {
    var once = ctx.state.once.bmr;
    var lastId = once.exorcistLastTargetId || null;
    ctx.beginPick({
      title: 'Exorcist: Wähle einen Spieler (anders als letzte Nacht)',
      count: 1,
      filterFn: function (s) {
        if (s.alive === false) return false;
        if (!lastId) return true;
        return s.id !== lastId;
      },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        once.exorcistLastTargetId = target.id;
        ctx.setFlag(target.id, 'exorcistTargetTonight', true);
        ctx.openOverlay('Exorcist', 'Falls ' + (target.name || target.id) + ' der Dämon ist, wacht er diese Nacht nicht auf.<br>Sonst erfährt der Dämon, wer der Exorcist ist.');
        ctx.log('Exorcist wählt ' + (target.name || target.id) + ' (lebend, != letzte Nacht).');
        ctx.save(); ctx.draw();
      }
    });
  }

  // Innkeeper – "Each night, choose 2 players: they can’t die tonight, but 1 is drunk."
  function innkeeper(ctx) {
    ctx.beginPick({
      title: 'Gastwirt: Wähle 2 lebende Spieler',
      count: 2,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || selected.length < 2) return;
        var a = selected[0], b = selected[1];
        ctx.setFlag(a.id, 'protectedUntilDusk', true);
        ctx.setFlag(b.id, 'protectedUntilDusk', true);
        ctx.state.night.bmr.innkeeperProtectedIds = [a.id, b.id];
        ctx.openOverlay('Gastwirt: Wer wird drunk?', seatName(a) + ' und ' + seatName(b) + ' sind geschützt. Einer ist drunk.', [
          { label: seatName(a) + ' drunk', onClick: function () {
            ctx.setFlag(a.id, 'drunkUntilDusk', true);
            big(ctx, 'Gastwirt: OK', 'Geschützt: ' + seatName(a) + ', ' + seatName(b) + '; drunk: ' + seatName(a));
            ctx.save(); ctx.draw();
          }},
          { label: seatName(b) + ' drunk', onClick: function () {
            ctx.setFlag(b.id, 'drunkUntilDusk', true);
            big(ctx, 'Gastwirt: OK', 'Geschützt: ' + seatName(a) + ', ' + seatName(b) + '; drunk: ' + seatName(b));
            ctx.save(); ctx.draw();
          }}
        ]);
      }
    });
  }

  // Gambler – "Each night, choose a player & guess their character: if you are wrong, you die."
  function gambler(ctx) {
    var gamblerSeat = findSingleSeat(ctx, 'gambler');
    var drunkOrPoisoned = gamblerSeat && gamblerSeat.flags && (gamblerSeat.flags.poisoned || gamblerSeat.flags.drunk);
    ctx.beginPick({
      title: 'Glücksspieler: Wähle Ziel',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var roleKeys = gamblerGuessRoleKeys();
        var btns = roleKeys.map(function (k) {
          var label = (ROLES[k] && (ROLES[k].name || ROLES[k].n)) ? (ROLES[k].name || ROLES[k].n) : k;
          return {
            label: label,
            onClick: function () {
              var guessKey = (k || '').toLowerCase().replace(/_/g, '');
              var actualKey = (target.role || target.roleId || '').toLowerCase().replace(/_/g, '');
              var correct = actualKey === guessKey;
              if (drunkOrPoisoned) {
                ctx.openOverlay('Glücksspieler (drunk/poisoned)', 'Ergebnis frei wählbar.', [
                  { label: 'RICHTIG', onClick: function () { big(ctx, 'Glücksspieler', 'RICHTIG'); ctx.save(); ctx.draw(); }},
                  { label: 'FALSCH', onClick: function () {
                    ctx.openOverlay('Glücksspieler: Gambler stirbt?', '', [
                      { label: 'Stirbt', onClick: function () { if (gamblerSeat) ctx.setFlag(gamblerSeat.id, 'dead', true); big(ctx, 'Glücksspieler', 'FALSCH (Gambler stirbt)'); ctx.save(); ctx.draw(); }},
                      { label: 'Leben', onClick: function () { big(ctx, 'Glücksspieler', 'FALSCH (lebt)'); ctx.save(); ctx.draw(); }}
                    ]);
                  }}
                ]);
                return;
              }
              if (!correct && gamblerSeat) ctx.setFlag(gamblerSeat.id, 'dead', true);
              big(ctx, 'Glücksspieler', correct ? 'RICHTIG' : 'FALSCH (Gambler stirbt)');
              ctx.save(); ctx.draw();
            }
          };
        });
        ctx.openOverlay('Glücksspieler: Geratene Rolle für ' + seatName(target), '', btns);
      }
    });
  }

  // Minstrel – on minion execution, all townsfolk are drunk next day until dusk.
  function minstrel(ctx) {
    choice(ctx, 'Minnesänger', 'Wenn ein Minion heute hingerichtet wird: Alle Townsfolk sind morgen drunk bis Dusk.', [
      { label: 'Minion hingerichtet → Townsfolk drunk setzen', onClick: function() { big(ctx, 'Minnesänger', 'Alle Townsfolk sind morgen drunk bis Dusk. Im Grimoire markieren.'); }},
      { label: 'Kein Minion hingerichtet', onClick: function() { big(ctx, 'Minnesänger', 'Kein Effekt.'); }}
    ]);
  }

  function gossip(ctx) {
    choice(ctx, 'Schwätzer', 'War die öffentliche Aussage wahr?', [
      { label: 'Aussage war wahr', onClick: function () {
        ctx.state.night.bmr.gossipTrue = true;
        big(ctx, 'Gossip', 'Gesetzt: wahr');
        ctx.save();
      }},
      { label: 'Aussage war falsch', onClick: function () {
        ctx.state.night.bmr.gossipTrue = false;
        big(ctx, 'Gossip', 'Gesetzt: falsch');
        ctx.save();
      }}
    ]);
  }

  function courtier(ctx) {
    var once = ctx.state.once.bmr;
    if (once.courtierUsed) {
      big(ctx, 'Hofdame', 'Bereits genutzt.');
      return;
    }
    var scriptId = abilityScriptKey();
    var scriptDef = (typeof SCRIPTS !== 'undefined' && scriptId && SCRIPTS[scriptId])
      ? SCRIPTS[scriptId]
      : (typeof SCRIPT_ROLES !== 'undefined' && scriptId && SCRIPT_ROLES[scriptId])
        ? SCRIPT_ROLES[scriptId]
        : null;
    var allowedIds = [];
    if (scriptDef) {
      ['townsfolk', 'outsiders', 'minions', 'demons', 'travelers'].forEach(function (key) {
        var arr = scriptDef[key] || [];
        arr.forEach(function (rid) {
          if (allowedIds.indexOf(rid) === -1) allowedIds.push(rid);
        });
      });
    }
    if (!allowedIds.length) {
      big(ctx, 'Hofdame', 'Kein Script geladen – bitte Script wählen oder Setup abschließen.');
      return;
    }
    var btns = allowedIds.map(function (k) {
      var label = (ROLES[k] && (ROLES[k].name || ROLES[k].n)) ? (ROLES[k].name || ROLES[k].n) : k;
      return {
        label: label,
        onClick: function () {
          once.courtierUsed = true;
          once.courtier = { roleKey: k, startNight: typeof nightNumber !== 'undefined' ? nightNumber : 1 };
          big(ctx, 'Hofdame', k + ' ist drunk (3 Nächte + 3 Tage)');
          ctx.save(); ctx.draw();
        }
      };
    });
    btns.push({
      label: 'Keinen (Fähigkeit aufheben)',
      onClick: function () {
        big(ctx, 'Hofdame', 'Du hebst deine Fähigkeit für später auf.');
      }
    });
    choice(ctx, 'Hofdame: Welche Rolle wird drunk (3 Nächte + 3 Tage)?', '', btns);
  }

  function professor(ctx) {
    var once = ctx.state.once.bmr;
    if (once.professorUsed) {
      big(ctx, 'Professor', 'Bereits genutzt.');
      return;
    }
    ctx.beginPick({
      title: 'Professor: Wähle 1 toten Spieler',
      count: 1,
      filterFn: function (s) { return !isAlive(s); },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        choice(ctx, 'Professor', 'Ist Ziel Townsfolk?', [
          { label: 'Ja → beleben', onClick: function () {
            ctx.setFlag(target.id, 'dead', false);
            once.professorUsed = true;
            big(ctx, 'Professor', 'Belebt: ' + seatName(target));
            ctx.save(); ctx.draw();
          }},
          { label: 'Nein → nichts', onClick: function () {
            once.professorUsed = true;
            big(ctx, 'Professor', 'Nichts (kein Townsfolk).');
            ctx.save(); ctx.draw();
          }}
        ]);
      }
    });
  }

  function devilsadvocate(ctx) {
    ctx.beginPick({
      title: 'Teufelsadvokat: Wähle 1 lebenden Spieler',
      count: 1,
      filterFn: function (s) { return isAlive(s); },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        ctx.setFlag(target.id, 'daProtectedTomorrow', true);
        big(ctx, 'Teufelsadvokat', 'Schützt ' + seatName(target) + ' vor Exekution morgen.');
        ctx.save(); ctx.draw();
      }
    });
  }

  function godfather(ctx) {
    // Godfather: each night* choose an Outsider to die
    var outsiderSeats = ctx.seats.filter(function(s) {
      if (s.alive === false) return false;
      var rk = s.role || s.roleId;
      if (!rk || typeof ROLES === 'undefined' || !ROLES[rk]) return false;
      return String(ROLES[rk].type || '').toLowerCase() === 'outsider';
    });
    if (!outsiderSeats.length) {
      ctx.openOverlay('Pate', 'Keine lebenden Außenseiter im Spiel – kein Kill.', [{ label: 'OK', onClick: function() {} }]);
      return;
    }
    var btns = outsiderSeats.map(function(s) {
      var rk = s.role || s.roleId;
      var rn = (typeof ROLES !== 'undefined' && ROLES[rk]) ? (ROLES[rk].name || ROLES[rk].n || rk) : (rk || '?');
      return {
        label: (s.name || 'Sitz ' + s.id) + ' (' + rn + ')',
        onClick: function() {
          ctx.setFlag(s.id, 'dead', true);
          big(ctx, 'Pate – Kill', (s.name || 'Sitz ' + s.id) + ' (' + rn + ') stirbt.');
          ctx.log('Godfather tötet Outsider ' + s.id);
          ctx.save(); ctx.draw();
        }
      };
    });
    btns.push({ label: 'Kein Kill diese Nacht', onClick: function() { big(ctx, 'Pate', 'Kein Kill.'); } });
    ctx.openOverlay('Pate: Welcher Außenseiter stirbt?', outsiderSeats.length + ' lebende Außenseiter verfügbar.', btns);
  }

  function grandmother(ctx) {
    ctx.beginPick({
      title: 'Großmutter: Wähle 1 guten Spieler (Start-Info)',
      count: 1,
      filterFn: function (s) {
        return isGoodAliveSeat(s);
      },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var s = selected[0];
        var role = (s.role || s.roleId || '?');
        big(ctx, 'Großmutter', seatName(s) + ' ist ' + (typeof ROLES !== 'undefined' && ROLES[role] ? ROLES[role].n : role));
        ctx.save(); ctx.draw();
      }
    });
  }

  function tea_lady(ctx) {
    var tl = ctx.seats.find(function (s) { return (s.role || s.roleId || '').toLowerCase().replace(/_/g, '') === 'tealady'; });
    var neighbors = tl && ctx.getNeighbors ? ctx.getNeighbors(tl.id) : [];
    var neighborInfo = (!neighbors || neighbors.length < 2) ? '—' :
      seatName(neighbors[0]) + (neighbors[0].alive === false ? ' ✝' : ' ✓') + ', ' +
      seatName(neighbors[1]) + (neighbors[1].alive === false ? ' ✝' : ' ✓');
    ctx.openOverlay('Teedame', 'Solange beide Nachbarn leben, kann die Teedame nicht sterben.<br>Nachbarn: ' + neighborInfo, [{label: 'OK', onClick: function() {}}]);
  }

  function pacifist(ctx) {
    choice(ctx, 'Pazifist', 'Du wirst exekutiert — könntest du überleben?', [
      { label: 'Überlebt (ST entscheidet)', onClick: function() { big(ctx, 'Pazifist', 'Überlebt die Exekution (ST-Entscheid).'); }},
      { label: 'Stirbt normal', onClick: function() { big(ctx, 'Pazifist', 'Stirbt.'); }}
    ]);
  }

  function zombuul(ctx) {
    ctx.beginPick({
      title: 'Zombuul: Wähle 1 Opfer',
      count: 1,
      filterFn: function (s) { return isAlive(s); },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        ctx.setFlag(selected[0].id, 'markedToDieTonight', true);
        big(ctx, 'Zombuul', 'Opfer: ' + seatName(selected[0]));
        ctx.save(); ctx.draw();
      }
    });
  }

  function shabaloth(ctx) {
    var once = ctx.state.once.bmr;
    if (!once.shabalothKilled) once.shabalothKilled = [];

    function doKill() {
      ctx.beginPick({
        title: 'Shabaloth: Wähle 2 Opfer',
        count: 2,
        filterFn: function (s) { return isAlive(s); },
        onDone: function (selected) {
          if (!selected || selected.length < 2) return;
          ctx.setFlag(selected[0].id, 'markedToDieTonight', true);
          ctx.setFlag(selected[1].id, 'markedToDieTonight', true);
          once.shabalothKilled.push(selected[0].id, selected[1].id);
          big(ctx, 'Shabaloth', 'Opfer: ' + seatName(selected[0]) + ', ' + seatName(selected[1]));
          ctx.save(); ctx.draw();
        }
      });
    }

    // Prüfe ob Belebung möglich (vorherige Opfer noch tot)
    var prevDead = ctx.seats.filter(function(s) {
      return !isAlive(s) && once.shabalothKilled.indexOf(s.id) >= 0;
    });
    if (!prevDead.length) { doKill(); return; }

    var reviveBtns = prevDead.map(function(s) {
      return { label: seatName(s) + ' beleben', onClick: function() {
        ctx.setFlag(s.id, 'dead', false);
        ctx.log('Shabaloth: belebt ' + seatName(s));
        ctx.toast(seatName(s) + ' belebt (Shabaloth)', 3000);
        ctx.save(); ctx.draw();
        doKill();
      }};
    });
    reviveBtns.push({ label: 'Keine Belebung', onClick: doKill });
    ctx.openOverlay('Shabaloth: Belebung?',
      'Shabaloth kann einen vorher getöteten Spieler beleben.',
      reviveBtns);
  }

  function pukka(ctx) {
    var once = ctx.state.once.bmr;
    var prevId = once.pukkaPrev || null;
    if (prevId) {
      var prev = ctx.getSeatById(prevId);
      if (prev) ctx.setFlag(prev.id, 'markedToDieTonight', true);
    }
    ctx.beginPick({
      title: 'Pukka: Wähle neues Gift-Opfer',
      count: 1,
      filterFn: function (s) { return isAlive(s); },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        ctx.setFlag(target.id, 'pukkaPoisoned', true);
        ctx.state.night.bmr.pukkaNew = target.id;
        once.pukkaPrev = target.id;
        big(ctx, 'Pukka', 'Vergiftet: ' + seatName(target) + (prevId ? '; vorheriges Opfer stirbt.' : ''));
        ctx.save(); ctx.draw();
      }
    });
  }

  function po(ctx) {
    var once = ctx.state.once.bmr;
    if (once.poCharged) {
      ctx.beginPick({
        title: 'Po: Wähle 3 Opfer (aufgeladen)',
        count: 3,
        filterFn: function (s) { return isAlive(s); },
        onDone: function (selected) {
          if (!selected || selected.length < 3) return;
          selected.forEach(function (s) { ctx.setFlag(s.id, 'markedToDieTonight', true); });
          once.poCharged = false;
          big(ctx, 'Po', '3 Opfer: ' + selected.map(seatName).join(', '));
          ctx.save(); ctx.draw();
        }
      });
      return;
    }
    choice(ctx, 'Po', '0 oder 1 Opfer diese Nacht?', [
      { label: '0 Opfer (aufladen)', onClick: function () {
        once.poCharged = true;
        big(ctx, 'Po', 'Aufgeladen. Nächste Nacht: 3 Opfer.');
        ctx.save(); ctx.draw();
      }},
      { label: '1 Opfer', onClick: function () {
        ctx.beginPick({
          title: 'Po: Wähle 1 Opfer',
          count: 1,
          filterFn: function (s) { return isAlive(s); },
          onDone: function (sel) {
            if (!sel || !sel[0]) return;
            ctx.setFlag(sel[0].id, 'markedToDieTonight', true);
            big(ctx, 'Po', 'Opfer: ' + seatName(sel[0]));
            ctx.save(); ctx.draw();
          }
        });
      }}
    ]);
  }

  // Goon – Outsider; drunk/sober logic ist passiv. Hier nur Hinweis.
  function goon(ctx) {
    ctx.openOverlay('Goon', 'Du bist betrunken, solange dich der Dämon nicht angreift; danach wirst du böse.\n(Diese App verwaltet die Alignments nicht automatisch.)');
  }

  // Assassin – "Once per game, at night, choose a player: they die, even if for some reason they could not."
  function assassin(ctx) {
    var once = ctx.state.once.bmr;
    if (once.assassinUsed) {
      big(ctx, 'Meuchelmörder', 'Fähigkeit bereits einmal genutzt.');
      return;
    }
    ctx.beginPick({
      title: 'Meuchelmörder: Wähle ein Ziel (einmal pro Spiel)',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        once.assassinUsed = true;
        ctx.setFlag(target.id, 'dead', true);
        big(ctx, 'Meuchelmörder', seatName(target) + ' stirbt.');
        ctx.save(); ctx.draw();
      }
    });
  }

  // Mastermind – passive; if Demon executed, game continues 1 more day. Reminder + checkbox.
  function mastermind(ctx) {
    var once = ctx.state.once.bmr;
    choice(ctx, 'Strippenzieher', 'Wenn Dämon exekutiert wird: Spiel endet erst am nächsten Tag. Bei nächster Exekution gewinnt Evil.', [
      { label: 'Mastermind-Tag aktiv setzen', onClick: function () {
        once.mastermindDay = true;
        big(ctx, 'Strippenzieher', 'Mastermind-Tag aktiv.');
        ctx.save();
      }},
      { label: 'Mastermind-Tag zurücksetzen', onClick: function () {
        once.mastermindDay = false;
        big(ctx, 'Strippenzieher', 'Zurückgesetzt.');
        ctx.save();
      }}
    ]);
  }

  // ——— Generischer Dämon-Nachtkill (S&V / allgemein; berücksichtigt Soldat + TB-Mönch-Schutz) ———
  function demonNightKillSimple(ctx, demonTitle) {
    var title = demonTitle || 'Dämon';
    ctx.beginPick({
      title: title + ': Nacht-Opfer wählen',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var rk = String(target.role || target.roleId || '').toLowerCase().replace(/_/g, '');
        if (rk === 'soldier') {
          ctx.openOverlay(title, 'Kill geblockt (Soldat).');
          return;
        }
        var prot = ctx.state.night.tb && ctx.state.night.tb.monkProtectedSeatId === target.id;
        if (prot) {
          ctx.openOverlay(title, 'Kill geblockt (Mönch-Schutz).');
          return;
        }
        ctx.setFlag(target.id, 'dead', true);
        ctx.log(title + ' tötet Sitz ' + target.id);
        big(ctx, title + ' — Kill', seatName(target));
        ctx.save(); ctx.draw();
      }
    });
  }

  // ——— Sects & Violets ———
  function clockmaker(ctx) {
    choice(ctx, 'Uhrmacher (1. Nacht)', 'Distanz Dämon ↔ nächster Minion (im Uhrzeigersinn):', [
      { label: '0', onClick: function () { big(ctx, 'Uhrmacher', '0'); ctx.save(); ctx.draw(); }},
      { label: '1', onClick: function () { big(ctx, 'Uhrmacher', '1'); ctx.save(); ctx.draw(); }},
      { label: '2', onClick: function () { big(ctx, 'Uhrmacher', '2'); ctx.save(); ctx.draw(); }},
      { label: '3', onClick: function () { big(ctx, 'Uhrmacher', '3'); ctx.save(); ctx.draw(); }},
      { label: '4+', onClick: function () { big(ctx, 'Uhrmacher', '4+'); ctx.save(); ctx.draw(); }}
    ]);
  }

  function snake_charmer(ctx) {
    var owner = findSingleSeat(ctx, 'snake_charmer');
    ctx.beginPick({
      title: 'Schlangenbeschwörer: Wähle 1 lebenden Spieler',
      count: 1,
      filterFn: function (s) {
        if (s.alive === false) return false;
        if (owner && s.id === owner.id) return false;
        return true;
      },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        var target = sel[0];
        var isDemon = isDemonSeat(target);
        if (isDemon && owner) {
          var demonRole = target.role || target.roleId || 'imp';
          var demonRoleName = (typeof ROLES !== 'undefined' && ROLES[demonRole])
            ? (ROLES[demonRole].name || ROLES[demonRole].n || demonRole) : demonRole;
          ctx.openOverlay('Schlangenbeschwörer: Dämon!',
            '<strong>' + seatName(target) + '</strong> ist ' + demonRoleName + '!<br><br>' +
            'Rollentausch:<br>' +
            '• ' + seatName(owner) + ' → ' + demonRoleName + ' (böse)<br>' +
            '• ' + seatName(target) + ' → Schlangenbeschwörer (gut)<br>' +
            'Beide wachen heute Nacht auf.',
            [{ label: '⚡ Tausch durchführen', onClick: function() {
              var scRole = owner.role || owner.roleId || 'snake_charmer';
              owner.role = demonRole; owner.roleId = demonRole;
              target.role = scRole; target.roleId = scRole;
              ctx.log('Snake Charmer: Tausch mit Dämon Sitz ' + target.id);
              ctx.toast('Rollentausch: ' + seatName(owner) + ' ↔ ' + seatName(target), 4000);
              ctx.save(); ctx.draw();
              if (typeof window.buildNightOrder === 'function') window.buildNightOrder();
              if (typeof window.renderNightOrder === 'function') window.renderNightOrder();
            }},
            { label: 'Kein Tausch (drunk/poisoned)', onClick: function() {
              ctx.toast('Kein Tausch.');
              ctx.save();
            }}]
          );
        } else {
          ctx.toast('Kein Dämon – kein Tausch.', 2500);
          ctx.log('Snake Charmer wählt ' + target.id + ' (kein Dämon)');
          ctx.save();
        }
      }
    });
  }

  function mathematician(ctx) {
    // Mathematician wählt keine Spieler – er bekommt vom ST eine Zahl:
    // wie viele Fähigkeiten haben heute Nacht nicht so funktioniert wie sie sollten?
    choice(ctx, 'Mathematiker', 'Wie viele Fähigkeiten haben heute Nacht „falsch” funktioniert? (drunk/poisoned/Vortox etc.)', [
      { label: '0', onClick: function () { big(ctx, 'Mathematiker sieht', '0'); ctx.save(); ctx.draw(); }},
      { label: '1', onClick: function () { big(ctx, 'Mathematiker sieht', '1'); ctx.save(); ctx.draw(); }},
      { label: '2', onClick: function () { big(ctx, 'Mathematiker sieht', '2'); ctx.save(); ctx.draw(); }},
      { label: '3', onClick: function () { big(ctx, 'Mathematiker sieht', '3'); ctx.save(); ctx.draw(); }},
      { label: '4+', onClick: function () { big(ctx, 'Mathematiker sieht', '4+'); ctx.save(); ctx.draw(); }}
    ]);
  }

  function flowergirl(ctx) {
    choice(ctx, 'Blumenmädchen', 'Hat der Dämon heute für einen Exekutionskandidaten gestimmt?', [
      { label: 'Ja', onClick: function () { big(ctx, 'Blumenmädchen', 'Ja'); ctx.save(); ctx.draw(); }},
      { label: 'Nein', onClick: function () { big(ctx, 'Blumenmädchen', 'Nein'); ctx.save(); ctx.draw(); }}
    ]);
  }

  function town_crier(ctx) {
    choice(ctx, 'Stadtschreier', 'Hat heute ein Minion nominiert?', [
      { label: 'Ja', onClick: function () { big(ctx, 'Stadtschreier', 'Ja'); ctx.save(); ctx.draw(); }},
      { label: 'Nein', onClick: function () { big(ctx, 'Stadtschreier', 'Nein'); ctx.save(); ctx.draw(); }}
    ]);
  }

  function oracle(ctx) {
    choice(ctx, 'Orakel', 'Wie viele tote Spieler sind böse?', [
      { label: '0', onClick: function () { big(ctx, 'Orakel sieht', '0'); ctx.save(); ctx.draw(); }},
      { label: '1', onClick: function () { big(ctx, 'Orakel sieht', '1'); ctx.save(); ctx.draw(); }},
      { label: '2', onClick: function () { big(ctx, 'Orakel sieht', '2'); ctx.save(); ctx.draw(); }},
      { label: '3', onClick: function () { big(ctx, 'Orakel sieht', '3'); ctx.save(); ctx.draw(); }},
      { label: '4+', onClick: function () { big(ctx, 'Orakel sieht', '4+'); ctx.save(); ctx.draw(); }}
    ]);
  }

  function savant(ctx) {
    choice(ctx, 'Gelehrter', 'Welche zwei Aussagen gibst du dem Gelehrten heute?', [
      { label: '✏ Aussagen in Notizen erfassen', onClick: function() { big(ctx,'Gelehrter','Trag die 2 Aussagen in den Sitz-Notizen des Gelehrten ein (1 ist wahr, 1 ist falsch).'); }},
      { label: 'OK', onClick: function() {} }
    ]);
  }

  function seamstress(ctx) {
    ctx.beginPick({
      title: 'Schneiderin: Wähle 2 lebende Spieler',
      count: 2,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (sel) {
        if (!sel || sel.length < 2) return;
        choice(ctx, 'Schneiderin', seatName(sel[0]) + ' und ' + seatName(sel[1]) + ' — gleiche Rolle?', [
          { label: 'Ja', onClick: function () { big(ctx, 'Schneiderin', 'JA'); ctx.save(); ctx.draw(); }},
          { label: 'Nein', onClick: function () { big(ctx, 'Schneiderin', 'NEIN'); ctx.save(); ctx.draw(); }}
        ]);
      }
    });
  }

  function philosopher(ctx) {
    var keys = scriptRoleIdsByTypes(abilityScriptKey(), ['townsfolk']).filter(function (k) { return k !== 'philosopher'; });
    if (!keys.length) {
      big(ctx, 'Philosoph', 'Kein Townsfolk auf dem Script zum Kopieren.');
      return;
    }
    var btns = keys.map(function (k) {
      return {
        label: roleLabel(k),
        onClick: function () {
          big(ctx, 'Philosoph', 'Du „bist“ nun ' + roleLabel(k) + ' (ST: Token & Hinweise).');
          ctx.save(); ctx.draw();
        }
      };
    });
    choice(ctx, 'Philosoph: Welche Townsfolk-Rolle kopieren?', '', btns);
  }

  function artist(ctx) {
    choice(ctx, 'Künstler', 'Einmal pro Spiel: Stelle dem ST eine beliebige Ja/Nein-Frage. ST antwortet wahrheitsgemäß.', [
      { label: 'Frage beantwortet (Ja)', onClick: function() { big(ctx,'Künstler','Antwort: JA'); ctx.save(); }},
      { label: 'Frage beantwortet (Nein)', onClick: function() { big(ctx,'Künstler','Antwort: NEIN'); ctx.save(); }}
    ]);
  }

  function juggler(ctx) {
    choice(ctx, 'Jongleur', '1. Nacht: kein Schritt. Ab 2. Nacht: Jongleur hat tagsüber Rollen geraten.', [
      { label: 'Ergebnis: X Richtige', onClick: function() {
        choice(ctx, 'Jongleur: Wie viele richtig?', '', [
          { label: '0', onClick: function() { big(ctx,'Jongleur','0 richtig.'); ctx.save(); }},
          { label: '1', onClick: function() { big(ctx,'Jongleur','1 richtig.'); ctx.save(); }},
          { label: '2', onClick: function() { big(ctx,'Jongleur','2 richtig.'); ctx.save(); }},
          { label: '3+', onClick: function() { big(ctx,'Jongleur','3+ richtig.'); ctx.save(); }}
        ]);
      }},
      { label: 'Kein Jongleur-Tag heute', onClick: function() { big(ctx,'Jongleur','Kein Schritt.'); }}
    ]);
  }

  function sage(ctx) {
    var sageSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'sage' && s.alive === false; });
    if (sageSeat) {
      ctx.beginPick({ title: 'Weiser: Wähle 1 von 2 Verdächtigen (Dämon-Kandidaten)', count: 1,
        filterFn: function(s) { return s.alive !== false; },
        onDone: function(sel) {
          if (!sel||!sel[0]) return;
          big(ctx,'Weiser: Ziel', seatName(sel[0]) + ' ist einer von 2 Kandidaten — einer davon ist der Dämon.');
          ctx.save();
        }
      });
    } else { big(ctx, 'Weiser', 'Stirbt noch nicht — erwacht erst wenn er diese Nacht vom Dämon getötet wird.'); }
  }

  function mutant(ctx) {
    choice(ctx, 'Mutant', 'Wird der Mutant exekutiert?', [
      { label: 'Ja — Exekution', onClick: function() {
        var mSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'mutant'; });
        var poisoned = mSeat && mSeat.flags && (mSeat.flags.poisoned||mSeat.flags.drunk);
        if (poisoned) {
          if (mSeat) { ctx.setFlag(mSeat.id,'dead',true); ctx.save(); ctx.draw(); }
          big(ctx,'Mutant (drunk/poisoned)','Stirbt normal bei Exekution.');
        } else {
          choice(ctx,'Mutant: Ist er Mad?', 'War der Mutant heute öffentlich „Mad" (hat behauptet Mutant zu sein)?', [
            { label: 'Ja → stirbt normal', onClick: function() {
              if (mSeat) { ctx.setFlag(mSeat.id,'dead',true); ctx.save(); ctx.draw(); }
              big(ctx,'Mutant','Stirbt (war Mad).');
            }},
            { label: 'Nein → stirbt nicht', onClick: function() { big(ctx,'Mutant','Überlebt Exekution (war nicht Mad).'); }}
          ]);
        }
      }},
      { label: 'Nicht exekutiert', onClick: function() { big(ctx,'Mutant','Keine Aktion.'); }}
    ]);
  }

  function sweetheart(ctx) {
    var swSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'sweetheart' && s.alive === false; });
    if (swSeat) {
      ctx.beginPick({ title: 'Schatz: Wähle 1 Liebenden (wird drunk)', count: 1,
        filterFn: function(s) { return s.alive !== false; },
        onDone: function(sel) {
          if (!sel||!sel[0]) return;
          ctx.setFlag(sel[0].id,'drunk',true);
          big(ctx,'Schatz',seatName(sel[0]) + ' ist jetzt drunk (bis Spielende).');
          ctx.save(); ctx.draw();
        }
      });
    } else { big(ctx,'Schatz','Ist noch am Leben — erwacht erst nach dem Tod.'); }
  }

  function barber(ctx) {
    var bSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'barber' && s.alive === false; });
    if (bSeat) {
      var sd = ctx.state.once.sv || (ctx.state.once.sv = {});
      if (sd.barberTrigger) {
        ctx.beginPick({ title: 'Barbier: Wähle 2 Spieler für Rollentausch', count: 2,
          filterFn: function(s) { return s.alive !== false; },
          onDone: function(sel) {
            if (!sel||sel.length<2) return;
            var ra = sel[0].role||sel[0].roleId; var rb = sel[1].role||sel[1].roleId;
            sel[0].role=rb; sel[0].roleId=rb; sel[1].role=ra; sel[1].roleId=ra;
            big(ctx,'Barbier: Tausch', seatName(sel[0]) + ' ↔ ' + seatName(sel[1]));
            sd.barberTrigger=false; ctx.save(); ctx.draw();
          }
        });
      } else {
        choice(ctx,'Barbier','Barbier ist tot — Dämon darf 2 Spieler tauschen?', [
          { label: 'Ja → Tausch', onClick: function() { sd.barberTrigger=true; barber(ctx); }},
          { label: 'Nein (Dämon verzichtet)', onClick: function() { big(ctx,'Barbier','Kein Tausch.'); }}
        ]);
      }
    } else { big(ctx,'Barbier','Lebt noch — Fähigkeit triggert nach dem Tod.'); }
  }

  function klutz(ctx) {
    choice(ctx, 'Tölpel', 'Tölpel hat versehentlich abgestimmt (für den falschen Spieler)?', [
      { label: 'Ja — Fähigkeit löst aus', onClick: function() {
        ctx.beginPick({ title: 'Tölpel: Wähle 1 anderen Spieler (könnte stattdessen sterben)', count: 1,
          filterFn: function(s) { return s.alive !== false; },
          onDone: function(sel) {
            if (!sel||!sel[0]) return;
            choice(ctx,'Tölpel',seatName(sel[0]) + ' stirbt stattdessen?', [
              { label: 'Stirbt', onClick: function() { ctx.setFlag(sel[0].id,'dead',true); ctx.save(); ctx.draw(); big(ctx,'Tölpel',seatName(sel[0]) + ' stirbt.'); }},
              { label: 'Nein (drunk/poisoned)', onClick: function() { big(ctx,'Tölpel','Kein Effekt (drunk/poisoned).'); }}
            ]);
          }
        });
      }},
      { label: 'Nein', onClick: function() { big(ctx,'Tölpel','Kein Trigger.'); }}
    ]);
  }

  function evil_twin(ctx) {
    var twins = ctx.seats.filter(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'evil_twin' || (s.flags && s.flags.isGoodTwin); });
    var twinInfo = twins.length ? twins.map(function(s) { return seatName(s) + ((s.role||'').toLowerCase()==='evil_twin'?' (böse)':' (gut)'); }).join(' ↔ ') : 'Noch nicht zugewiesen.';
    ctx.openOverlay('Böser Zwilling', 'Zwillinge: ' + twinInfo + '<br><br>⚠ Wird der falsche Zwilling exekutiert, gewinnt Evil sofort.', [{label: 'OK', onClick: function() {}}]);
  }

  function witch(ctx) {
    ctx.beginPick({
      title: 'Hexe: Wähle lebendes Ziel (Fluch)',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        ctx.setFlag(sel[0].id, 'witched', true);
        big(ctx, 'Hexe', seatName(sel[0]) + ' trägt Fluch (+3 Stimmen wenn nominiert).');
        ctx.save(); ctx.draw();
      }
    });
  }

  function cerenovus(ctx) {
    ctx.beginPick({
      title: 'Cerenovus: Wähle lebendes Ziel (Mad nach Minion)',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        ctx.setFlag(sel[0].id, 'madAsMinion', true);
        big(ctx, 'Cerenovus', seatName(sel[0]) + ' ist „mad“ (wählt Minion — stirbt morgen wenn wach).');
        ctx.save(); ctx.draw();
      }
    });
  }

  function pit_hag(ctx) {
    ctx.beginPick({
      title: 'Grubenhexe: Wähle Spieler für Rollentausch',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        var target = sel[0];
        var keys = gamblerGuessRoleKeys();
        var btns = keys.map(function (k) {
          return {
            label: roleLabel(k),
            onClick: function () {
              big(ctx, 'Grubenhexe', seatName(target) + ' → ' + roleLabel(k) + ' (ST: lebenden Charakter ersetzen).');
              ctx.log('Pit Hag: ' + target.id + ' → ' + k);
              ctx.save(); ctx.draw();
            }
          };
        });
        choice(ctx, 'Grubenhexe: Neue Rolle', '', btns);
      }
    });
  }

  function fang_gu(ctx) {
    var once = ctx.state.once.bmr;
    ctx.beginPick({
      title: 'Fang Gu: Nacht-Opfer wählen',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var rk = String(target.role || target.roleId || '').toLowerCase();
        if (rk === 'soldier') { ctx.openOverlay('Fang Gu', 'Kill geblockt (Soldat).'); return; }
        var prot = ctx.state.night.tb && ctx.state.night.tb.monkProtectedSeatId === target.id;
        if (prot) { ctx.openOverlay('Fang Gu', 'Kill geblockt (Mönch-Schutz).'); return; }

        // Sprung: erstes Mal Außenseiter → Fang Gu springt zu ihnen
        var isOutsider = (typeof ROLES !== 'undefined' && ROLES[rk])
          ? String(ROLES[rk].type || '').toLowerCase() === 'outsider' : false;
        if (isOutsider && !once.fangGuJumped) {
          var fgSeat = ctx.seats.find(function(s) {
            return (s.role || s.roleId || '').toLowerCase() === 'fang_gu' && s.alive !== false;
          });
          var fgName = fgSeat ? seatName(fgSeat) : 'Fang Gu';
          var tName = seatName(target);
          ctx.openOverlay('Fang Gu: Sprung!',
            '<strong>' + tName + '</strong> ist ein Außenseiter!<br><br>' +
            'Fang Gu springt: <strong>' + fgName + '</strong> stirbt,<br>' +
            '<strong>' + tName + '</strong> wird neues Fang Gu (böse).',
            [{ label: '⚡ Sprung durchführen', onClick: function() {
              if (fgSeat) ctx.setFlag(fgSeat.id, 'dead', true);
              target.role = 'fang_gu'; target.roleId = 'fang_gu';
              once.fangGuJumped = true;
              ctx.log('Fang Gu: Sprung zu ' + tName);
              ctx.toast(tName + ' ist jetzt Fang Gu!', 4000);
              ctx.save(); ctx.draw();
              if (typeof window.buildNightOrder === 'function') window.buildNightOrder();
              if (typeof window.renderNightOrder === 'function') window.renderNightOrder();
            }},
            { label: 'Kein Sprung (drunk/poisoned)', onClick: function() {
              ctx.setFlag(target.id, 'dead', true);
              ctx.log('Fang Gu tötet (kein Sprung) ' + target.id);
              big(ctx, 'Fang Gu — Kill', tName);
              ctx.save(); ctx.draw();
            }}]
          );
          return;
        }

        ctx.setFlag(target.id, 'dead', true);
        ctx.log('Fang Gu tötet ' + target.id);
        big(ctx, 'Fang Gu — Kill', seatName(target));
        ctx.save(); ctx.draw();
      }
    });
  }

  function vigormortis(ctx) {
    ctx.beginPick({
      title: 'Vigormortis: Nacht-Opfer wählen',
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (selected) {
        if (!selected || !selected[0]) return;
        var target = selected[0];
        var rk = String(target.role || target.roleId || '').toLowerCase();
        if (rk === 'soldier') { ctx.openOverlay('Vigormortis', 'Kill geblockt (Soldat).'); return; }
        var prot = ctx.state.night.tb && ctx.state.night.tb.monkProtectedSeatId === target.id;
        if (prot) { ctx.openOverlay('Vigormortis', 'Kill geblockt (Mönch-Schutz).'); return; }
        ctx.setFlag(target.id, 'dead', true);
        ctx.log('Vigormortis tötet ' + target.id);
        var targetRoleData = (typeof ROLES !== 'undefined' && ROLES[rk]) ? ROLES[rk] : null;
        var isMinion = targetRoleData && String(targetRoleData.type || '').toLowerCase() === 'minion';
        if (isMinion) {
          ctx.openOverlay('Vigormortis – Minion getötet!',
            '<strong>' + seatName(target) + '</strong> (' + (targetRoleData.name || rk) + ') stirbt.<br><br>' +
            '⚠ Vigormortis-Effekt: Toter Minion behält seine Fähigkeit!<br>Tages-/Nacht-Fähigkeit des Minions ist weiterhin aktiv.');
        } else {
          big(ctx, 'Vigormortis — Kill', seatName(target));
        }
        ctx.save(); ctx.draw();
      }
    });
  }

  function no_dashii(ctx) {
    // Zeige passiv welche Townsfolk-Nachbarn korrumpiert sind
    var dashiiSeat = ctx.seats.find(function(s) {
      return (s.role || s.roleId || '').toLowerCase() === 'no_dashii' && s.alive !== false;
    });
    if (dashiiSeat) {
      var alive = ctx.seats.filter(function(s) { return s.alive !== false; });
      var idx = alive.findIndex(function(s) { return s.id === dashiiSeat.id; });
      var n = alive.length;
      var corrupted = [];
      for (var i = 1; i < n; i++) {
        var sR = alive[(idx + i) % n];
        if (isTownsfolkRoleId(sR.role || sR.roleId)) { corrupted.push(sR); break; }
      }
      for (var j = 1; j < n; j++) {
        var sL = alive[(idx - j + n) % n];
        if (isTownsfolkRoleId(sL.role || sL.roleId)) { corrupted.push(sL); break; }
      }
      if (corrupted.length) {
        ctx.toast('No Dashii – korrumpierte Nachbarn: ' + corrupted.map(function(s) { return seatName(s); }).join(', '), 5000);
      }
    }
    demonNightKillSimple(ctx, 'No Dashii');
  }

  function vortox(ctx) {
    if (typeof ctx.toast === 'function') ctx.toast('Vortox: Good-Infos können falsch sein, solange Evil lebt.');
    demonNightKillSimple(ctx, 'Vortox');
  }

  // ——— BMR: fehlende Outsider / Narr ———
  function lunatic(ctx) {
    ctx.openOverlay('Wahnsinniger', 'Du glaubst, der Dämon zu sein — bekommst falsche Nacht-Info. Der echte Dämon kennt dich. Keine echte Fähigkeit.', [{label: 'OK', onClick: function() {}}]);
  }

  function tinker(ctx) {
    choice(ctx, 'Tüftler', 'Tüftler stirbt diese Nacht?', [
      { label: 'Ja, stirbt', onClick: function() {
        var tSeat = ctx.seats.find(function(s) { return (s.role || s.roleId || '').toLowerCase() === 'tinker' && s.alive !== false; });
        if (tSeat) { ctx.setFlag(tSeat.id, 'dead', true); ctx.save(); ctx.draw(); }
        big(ctx, 'Tüftler', 'Stirbt diese Nacht.');
      }},
      { label: 'Nein', onClick: function() { big(ctx, 'Tüftler', 'Überlebt.'); }}
    ]);
  }

  function moonchild(ctx) {
    var mcSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'moonchild' && s.alive === false; });
    if (mcSeat) {
      ctx.beginPick({ title: 'Mondkind: Wähle 1 lebenden Spieler (könnte sterben)', count: 1,
        filterFn: function(s) { return s.alive !== false; },
        onDone: function(sel) {
          if (!sel||!sel[0]) return;
          choice(ctx, 'Mondkind', seatName(sel[0]) + ' stirbt?', [
            { label: 'Stirbt', onClick: function() { ctx.setFlag(sel[0].id,'dead',true); ctx.save(); ctx.draw(); big(ctx,'Mondkind','Stirbt.'); }},
            { label: 'Überlebt (drunk/poisoned)', onClick: function() { big(ctx,'Mondkind','Überlebt.'); }}
          ]);
        }
      });
    } else { big(ctx, 'Mondkind', 'Mondkind lebt noch — erwacht erst nach dem Tod.'); }
  }

  function fool(ctx) {
    choice(ctx, 'Narr', 'Narr stirbt heute?', [
      { label: 'Ja → einmalige Fähigkeit löst aus', onClick: function() { big(ctx,'Narr','Narr stirbt nicht (einmalige Fähigkeit). Im Grimoire markieren.'); }},
      { label: 'Stirbt wirklich', onClick: function() {
        var fSeat = ctx.seats.find(function(s) { return (s.role||s.roleId||'').toLowerCase() === 'fool' && s.alive !== false; });
        if (fSeat) { ctx.setFlag(fSeat.id,'dead',true); ctx.save(); ctx.draw(); }
        big(ctx,'Narr','Stirbt.');
      }}
    ]);
  }

  // ═══ Phase H: HTML-Escape + Stubs + Traveller-Nachtwahl (kein Ersatz fürs Regelwerk) ═══
  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function makeAbilityStub(roleId) {
    function stubFn(ctx) {
      var r = typeof ROLES !== 'undefined' ? ROLES[roleId] : null;
      var title = (r ? (r.name || r.n || roleId) : roleId) + ' · Leiter-Hinweis';
      var main = r && r.ability ? escHtml(String(r.ability)) : '—';
      var bits = [];
      if (r && r.reminder && String(r.reminder).trim()) {
        bits.push('<strong>Reminder:</strong> ' + escHtml(String(r.reminder).trim()));
      }
      if (r && r.firstNightReminder && String(r.firstNightReminder).trim()) {
        bits.push('<strong>Erste Nacht:</strong> ' + escHtml(String(r.firstNightReminder).trim()));
      }
      if (r && r.otherNightReminder && String(r.otherNightReminder).trim()) {
        bits.push('<strong>Weitere Nächte:</strong> ' + escHtml(String(r.otherNightReminder).trim()));
      }
      var sub = bits.length
        ? bits.join('<div style="margin:.4em 0 0 0"></div>')
        : 'Kein Reminder in den Daten — vgl. Script Tool / Regelwerk. Spezial-Logik kann in späteren Versionen ergänzt werden.';
      big(ctx, title, main, sub);
    }
    stubFn._botcPhaseHStub = true;
    return stubFn;
  }

  function travelerPickAlive(ctx, overlayTitle, pickTitle, logTag) {
    ctx.beginPick({
      title: pickTitle,
      count: 1,
      filterFn: function (s) { return s.alive !== false; },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        big(ctx, overlayTitle, escHtml(seatName(sel[0]) + ' gewählt.'), 'Im Grimoire notieren; Details per Regelwerk.');
        ctx.log(logTag + ': Sitz ' + sel[0].id);
        ctx.save();
        ctx.draw();
      }
    });
  }

  function harlot_traveler(ctx) {
    travelerPickAlive(ctx, 'Harlot (Dirne)', 'Harlot: Wähle lebenden Spieler (nach Absprache / Regelwerk)', 'Harlot');
  }

  function thief_traveler(ctx) {
    travelerPickAlive(ctx, 'Thief (Dieb)', 'Thief: Wähle Spieler (nicht du) — negative Stimmen', 'Thief');
  }

  function bureaucrat_traveler(ctx) {
    travelerPickAlive(ctx, 'Bureaucrat', 'Bureaucrat: Wähle Spieler (nicht du) — 3 Stimmen morgen', 'Bureaucrat');
  }

  function barista_traveler(ctx) {
    travelerPickAlive(ctx, 'Barista', 'Barista: Wähle Spieler für Effekt bis zur Dämmerung (Regelwerk)', 'Barista');
  }

  function bone_collector_traveler(ctx) {
    ctx.beginPick({
      title: 'Bone Collector: Wähle toten Spieler',
      count: 1,
      filterFn: function (s) { return s && s.alive === false; },
      onDone: function (sel) {
        if (!sel || !sel[0]) return;
        big(ctx, 'Bone Collector', escHtml(seatName(sel[0]) + ' — Fähigkeit bis Dämmerung (einmal pro Spiel prüfen).'), '');
        ctx.log('Bone Collector: tot ' + sel[0].id);
        ctx.save();
        ctx.draw();
      }
    });
  }

  window.BOTC_ABILITIES = {
    // Trouble Brewing
    chef: chef,
    washerwoman: washerwoman,
    librarian: librarian,
    investigator: investigator,
    empath: empath,
    fortune_teller: fortune_teller,
    fortuneteller: fortune_teller,
    dreamer: dreamer,
    undertaker: undertaker,
    monk: monk,
    ravenkeeper: ravenkeeper,
    virgin: virgin,
    slayer: slayer,
    soldier: soldier,
    mayor: mayor,
    butler: butler,
    drunk: drunk,
    recluse: recluse,
    saint: saint,
    poisoner: poisoner,
    spy: spy,
    scarletwoman: scarletwoman,
    scarlet_woman: scarletwoman,
    baron: baron,
    imp: imp,

    // Bad Moon Rising
    sailor: sailor,
    chambermaid: chambermaid,
    exorcist: exorcist,
    innkeeper: innkeeper,
    gambler: gambler,
    minstrel: minstrel,
    goon: goon,
    assassin: assassin,
    mastermind: mastermind,
    grandmother: grandmother,
    gossip: gossip,
    courtier: courtier,
    professor: professor,
    devilsadvocate: devilsadvocate,
    devils_advocate: devilsadvocate,
    godfather: godfather,
    tea_lady: tea_lady,
    tealady: tea_lady,
    pacifist: pacifist,
    zombuul: zombuul,
    shabaloth: shabaloth,
    pukka: pukka,
    po: po,

    lunatic: lunatic,
    tinker: tinker,
    moonchild: moonchild,
    fool: fool,

    clockmaker: clockmaker,
    snake_charmer: snake_charmer,
    mathematician: mathematician,
    flowergirl: flowergirl,
    town_crier: town_crier,
    oracle: oracle,
    savant: savant,
    seamstress: seamstress,
    philosopher: philosopher,
    artist: artist,
    juggler: juggler,
    sage: sage,
    mutant: mutant,
    sweetheart: sweetheart,
    barber: barber,
    klutz: klutz,
    evil_twin: evil_twin,
    witch: witch,
    cerenovus: cerenovus,
    pit_hag: pit_hag,
    fang_gu: fang_gu,
    vigormortis: vigormortis,
    no_dashii: no_dashii,
    vortox: vortox
  };

  (function phaseHRegisterTravelerHandlers() {
    var ab = window.BOTC_ABILITIES;
    ab.harlot = harlot_traveler;
    ab.thief = thief_traveler;
    ab.bureaucrat = bureaucrat_traveler;
    ab.barista = barista_traveler;
    ab.bone_collector = bone_collector_traveler;
  })();

  /**
   * Nach loadRoles() aufrufen — ROLES muss volles roles-master sein (nicht nur TB-Fallback).
   */
  window.BOTC_applyPhaseHStubs = function () {
    var ab = window.BOTC_ABILITIES;
    if (typeof ROLES === 'undefined' || !ROLES || !ab) return { ok: false, reason: 'ROLES or BOTC_ABILITIES missing' };
    var added = 0;
    Object.keys(ROLES).forEach(function (id) {
      var r = ROLES[id];
      if (!r) return;
      if (String(r.type || '').toLowerCase() === 'fabled') return;
      if (typeof ab[id] === 'function') return;
      ab[id] = makeAbilityStub(id);
      added++;
    });
    return { ok: true, stubsAdded: added };
  };

  window.BOTC_normalizeRoleKey = normalizeRoleKey;
  window.BOTC_buildCtx = buildCtx;
  window.BOTC_runTBselfCheck = function () {
    var keys = ['chef', 'washerwoman', 'librarian', 'investigator', 'empath', 'fortune_teller', 'undertaker', 'monk', 'ravenkeeper', 'virgin', 'slayer', 'soldier', 'mayor', 'butler', 'drunk', 'recluse', 'saint', 'poisoner', 'spy', 'scarletwoman', 'baron', 'imp'];
    var missing = [];
    keys.forEach(function (k) { if (!window.BOTC_ABILITIES[k]) missing.push(k); });
    if (missing.length) console.warn('[BOTC_ABILITIES] missing:', missing);
    else console.log('[BOTC_ABILITIES] OK: all TB keys present');
    return missing;
  };

  /** Phase H: Alle spielbaren Rollen (ohne Fabled) müssen einen Handler haben; Stubs zählen separat. */
  window.BOTC_runPhaseHSelfCheck = function () {
    var ab = window.BOTC_ABILITIES;
    var missing = [];
    var stubs = [];
    var full = [];
    if (typeof ROLES === 'undefined' || !ROLES) {
      console.warn('[BOTC Phase H] ROLES nicht geladen');
      return { error: 'ROLES missing', missing: [], stubs: [], fullCount: 0 };
    }
    Object.keys(ROLES).forEach(function (id) {
      var r = ROLES[id];
      if (!r || String(r.type || '').toLowerCase() === 'fabled') return;
      if (typeof ab[id] !== 'function') missing.push(id);
      else if (ab[id]._botcPhaseHStub) stubs.push(id);
      else full.push(id);
    });
    if (missing.length) console.warn('[BOTC Phase H] ohne Handler:', missing.length, missing.slice(0, 30));
    else console.log('[BOTC Phase H] jede Spielrolle hat Handler · Stubs:', stubs.length, '· mit Logik:', full.length);
    return {
      playableRoles: stubs.length + full.length,
      stubCount: stubs.length,
      fullHandlerCount: full.length,
      missingHandlers: missing,
      stubIdsSample: stubs.slice(0, 25)
    };
  };

  /** Prüft das aktive Script (Custom eingeschlossen): jede Script-Rolle braucht einen Key in BOTC_ABILITIES. */
  window.BOTC_runActiveScriptSelfCheck = function () {
    var sk = typeof getActiveScriptKey === 'function' ? getActiveScriptKey() : 'trouble_brewing';
    var missing = [];
    if (typeof expandScriptRoleIds !== 'function' || typeof ROLES === 'undefined') {
      return { script: sk, error: 'globals not ready', missing: [] };
    }
    expandScriptRoleIds(sk).forEach(function (id) {
      var r = ROLES[id];
      if (r && String(r.type || '').toLowerCase() === 'fabled') return;
      if (typeof window.BOTC_ABILITIES[id] !== 'function') missing.push(id);
    });
    if (missing.length) console.warn('[BOTC Script]', sk, 'fehlende Handler:', missing);
    else console.log('[BOTC Script]', sk, '— alle Rollen mit Handler (Stub oder voll)');
    return { script: sk, missingHandlers: missing };
  };

  /** Feste Key-Listen pro Edition (Kernrollen, nicht Traveller). */
  window.BOTC_runEditionSelfCheck = function (editionKey) {
    var lists = {
      trouble_brewing: ['washerwoman', 'librarian', 'investigator', 'chef', 'empath', 'fortune_teller', 'undertaker', 'monk', 'ravenkeeper', 'virgin', 'slayer', 'soldier', 'mayor', 'butler', 'drunk', 'recluse', 'saint', 'poisoner', 'spy', 'scarlet_woman', 'baron', 'imp'],
      bad_moon_rising: ['grandmother', 'sailor', 'chambermaid', 'exorcist', 'innkeeper', 'gambler', 'gossip', 'courtier', 'professor', 'minstrel', 'tea_lady', 'pacifist', 'fool', 'goon', 'lunatic', 'tinker', 'moonchild', 'godfather', 'devils_advocate', 'assassin', 'mastermind', 'zombuul', 'shabaloth', 'pukka', 'po'],
      sects_and_violets: ['clockmaker', 'dreamer', 'snake_charmer', 'mathematician', 'flowergirl', 'town_crier', 'oracle', 'savant', 'seamstress', 'philosopher', 'artist', 'juggler', 'sage', 'mutant', 'sweetheart', 'barber', 'klutz', 'evil_twin', 'witch', 'cerenovus', 'pit_hag', 'fang_gu', 'vigormortis', 'no_dashii', 'vortox']
    };
    var keys = lists[editionKey];
    if (!keys) {
      console.warn('[BOTC Edition] unbekannt:', editionKey);
      return { edition: editionKey, missing: [], error: 'unknown edition' };
    }
    var missing = [];
    keys.forEach(function (k) {
      if (!window.BOTC_ABILITIES[k]) missing.push(k);
    });
    if (missing.length) console.warn('[BOTC Edition]', editionKey, 'fehlt:', missing);
    else console.log('[BOTC Edition]', editionKey, '— alle Kernrollen registriert');
    return { edition: editionKey, missingHandlers: missing };
  };
})();
