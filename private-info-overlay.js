/**
 * Private-Info-Overlay – generische Anzeige sensibler Rolleninfos (Tablet-ST).
 * Nutzt: ROLES, seats, roleImageUrlList aus globals.js.
 * Keine große Refactor-Logik; nur Overlay + datengetriebenes Rendering.
 */
(function () {
  'use strict';

  var OVERLAY_ID = 'privateInfoOverlay';
  var Z_INDEX = 10000;

  function getSeats() {
    return (typeof seats !== 'undefined' && Array.isArray(seats)) ? seats : [];
  }

  function getSeatById(id) {
    var list = getSeats();
    for (var i = 0; i < list.length; i++) if (String(list[i].id) === String(id)) return list[i];
    return null;
  }

  function roleName(roleId) {
    if (!roleId || typeof ROLES === 'undefined') return roleId || '?';
    var r = ROLES[roleId];
    return r ? (r.name || r.n || roleId) : roleId;
  }

  /** Bild mit data-botc-role; src wird in wireRoleImageFallbacks gesetzt (lokal → remote → webp). */
  function roleImgHtml(roleId, inlineStyle, imgClass) {
    if (!roleId) return '';
    var cls = imgClass != null ? imgClass : 'private-info-icon';
    return '<img data-botc-role="' + esc(roleId) + '" src="" alt="" class="' + esc(cls) + '" style="' + inlineStyle + '">';
  }

  function wireRoleImageFallbacks(root) {
    if (!root || typeof roleImageUrlList !== 'function') return;
    var imgs = root.querySelectorAll('img[data-botc-role]');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        var roleId = img.getAttribute('data-botc-role');
        if (!roleId) return;
        var urls = (typeof roleImageUrlListForSeat === 'function')
          ? roleImageUrlListForSeat(roleId)
          : roleImageUrlList(roleId);
        var ix = 0;
        img.onerror = function () {
          ix++;
          if (ix < urls.length) img.src = urls[ix];
          else img.style.display = 'none';
        };
        if (urls.length) img.src = urls[0];
      })(imgs[i]);
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /**
   * Rendert den Inhalt für einen gegebenen Payload (type + data).
   */
  function renderPrivateInfoContent(payload) {
    if (!payload || !payload.type) return { title: 'Private Info', body: '<p>Keine Daten.</p>' };
    var type = payload.type;
    var html = '';
    var title = payload.title || 'Private Info';

    switch (type) {
      case 'self_role_reveal': {
        var s = getSeatById(payload.seatId);
        if (!s) return { title: title, body: '<p>Sitz nicht gefunden.</p>' };
        var roleId = s.role || s.roleId;
        var r = typeof ROLES !== 'undefined' && roleId ? ROLES[roleId] : null;
        var ability = r ? (r.ability || '') : '';
        title = s.name ? (s.name + ' – Deine Rolle') : 'Deine Rolle';
        html = '<div class="private-info-self">';
        if (roleId) html += roleImgHtml(roleId, 'width:min(200px,50vw);height:auto;border-radius:50%;border:3px solid var(--gold,#c9a84c);margin-bottom:12px;');
        html += '<div class="private-info-role-name" style="font-size:22px;font-weight:700;margin-bottom:8px;">' + esc(roleName(roleId)) + '</div>';
        if (ability) html += '<div class="private-info-ability" style="font-size:14px;opacity:.9;">' + esc(ability) + '</div>';
        html += '</div>';
        break;
      }
      case 'character_token': {
        var rId = payload.roleId;
        title = payload.title || roleName(rId);
        html = '<div class="private-info-token">';
        if (rId) html += roleImgHtml(rId, 'width:min(180px,45vw);height:auto;border-radius:50%;border:3px solid var(--gold);margin-bottom:12px;');
        html += '<div class="private-info-role-name" style="font-size:20px;font-weight:700;">' + esc(roleName(rId)) + '</div></div>';
        break;
      }
      case 'character_plus_players': {
        var rid = payload.roleId;
        var playerIds = payload.playerIds || payload.players || [];
        title = payload.title || roleName(rid);
        html = '<div class="private-info-char-players">';
        if (rid) html += roleImgHtml(rid, 'width:min(160px,40vw);height:auto;border-radius:50%;margin-bottom:12px;');
        html += '<div class="private-info-role-name" style="font-size:18px;font-weight:700;margin-bottom:12px;">' + esc(roleName(rid)) + '</div><div class="private-info-players" style="font-size:16px;">';
        playerIds.forEach(function (id) {
          var seat = getSeatById(id);
          html += '<div class="private-info-player" style="margin:6px 0;">' + esc(seat ? (seat.name || 'Sitz ' + seat.id) : id) + '</div>';
        });
        html += '</div></div>';
        break;
      }
      case 'two_characters_one_player': {
        var rids = payload.roleIds || [];
        var pid = payload.playerId != null ? payload.playerId : payload.player;
        var seat = getSeatById(pid);
        title = payload.title || 'Zwei Rollen · ein Spieler';
        html = '<div class="private-info-two-char">';
        rids.forEach(function (r) {
          if (r) html += roleImgHtml(r, 'width:min(100px,25vw);height:auto;border-radius:50%;margin:4px;border:2px solid var(--gold);', '');
        });
        html += '<div class="private-info-role-name" style="margin-top:12px;font-size:18px;">' + esc(seat ? (seat.name || 'Sitz ' + seat.id) : pid) + '</div></div>';
        break;
      }
      case 'role_list': {
        var list = payload.roleIds || [];
        title = payload.title || 'Rollen';
        html = '<div class="private-info-role-list" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
        list.forEach(function (r) {
          html += '<span style="display:inline-flex;align-items:center;gap:4px;padding:6px 10px;background:rgba(201,168,76,.15);border-radius:8px;">';
          if (r) html += roleImgHtml(r, 'width:32px;height:32px;border-radius:50%;', '');
          html += esc(roleName(r)) + '</span>';
        });
        html += '</div>';
        break;
      }
      case 'bluffs_three': {
        var bluffs = payload.roleIds || [];
        title = payload.title || 'Bluffs';
        html = '<div class="private-info-bluffs" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">';
        bluffs.slice(0, 3).forEach(function (r) {
          html += '<span style="display:flex;flex-direction:column;align-items:center;padding:8px;">';
          if (r) html += roleImgHtml(r, 'width:min(100px,22vw);height:auto;border-radius:50%;border:2px solid var(--gold);', '');
          html += '<span style="font-size:14px;margin-top:6px;">' + esc(roleName(r)) + '</span></span>';
        });
        html += '</div>';
        break;
      }
      case 'fake_role_reveal': {
        var frId = payload.roleId;
        title = payload.title || 'Du siehst dich als';
        html = '<div class="private-info-fake"><p style="font-size:12px;opacity:.8;margin-bottom:8px;">(Falsche Rolle)</p>';
        if (frId) html += roleImgHtml(frId, 'width:min(180px,45vw);height:auto;border-radius:50%;border:3px solid var(--gold);', '');
        html += '<div class="private-info-role-name" style="font-size:20px;font-weight:700;margin-top:12px;">' + esc(roleName(frId)) + '</div></div>';
        break;
      }
      case 'role_replacement': {
        var oldR = payload.oldRoleId;
        var newR = payload.newRoleId;
        title = payload.title || 'Neue Rolle';
        html = '<div class="private-info-replacement">';
        if (oldR) html += '<div style="font-size:14px;opacity:.8;margin-bottom:8px;">' + esc(roleName(oldR)) + ' →</div>';
        html += '<div class="private-info-new">';
        if (newR) html += roleImgHtml(newR, 'width:min(180px,45vw);height:auto;border-radius:50%;border:3px solid var(--gold);margin-bottom:8px;', '');
        html += '<div style="font-size:20px;font-weight:700;">' + esc(roleName(newR)) + '</div></div></div>';
        break;
      }
      case 'private_text': {
        title = payload.title || 'Private Info';
        var lines = payload.lines || (payload.text ? [payload.text] : []);
        html = '<div class="private-info-text">';
        lines.forEach(function (line) {
          html += '<p style="margin:0 0 10px;">' + esc(line) + '</p>';
        });
        html += '</div>';
        break;
      }
      case 'evil_setup_info': {
        title = payload.title || 'Evil-Setup';
        html = '<div class="private-info-evil">' + (payload.html ? payload.html : '<p>' + esc(payload.message || 'Evil-Infos (Inhalt aus Spielzustand einbinden).') + '</p>') + '</div>';
        break;
      }
      case 'alignment_change': {
        title = payload.title || 'Status';
        html = '<div class="private-info-alignment">' + esc(payload.message || 'Alignment-Änderung.') + '</div>';
        break;
      }
      default:
        html = '<p>Unbekannter Typ: ' + esc(type) + '</p>';
    }

    return { title: title, body: html };
  }

  function showPrivateInfoOverlay(payload) {
    var existing = document.getElementById(OVERLAY_ID);
    if (existing) existing.remove();

    var rendered = renderPrivateInfoContent(payload);
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.style.cssText = [
      'position:fixed;inset:0;z-index:' + Z_INDEX + ';',
      'background:radial-gradient(ellipse at center, rgba(22,14,40,.97) 0%, rgba(4,2,12,.99) 100%);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'padding:24px;box-sizing:border-box;overflow:auto;',
      'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);'
    ].join('');
    overlay.innerHTML =
      '<div class="private-info-card" style="' +
        'max-width:min(500px,95vw);width:100%;text-align:center;' +
        'background:linear-gradient(160deg,#1c1430 0%,#0e0b1e 100%);' +
        'border:1px solid rgba(201,168,76,.38);border-radius:20px;' +
        'box-shadow:0 0 0 1px rgba(201,168,76,.08),0 40px 90px rgba(0,0,0,.9),inset 0 1px 0 rgba(201,168,76,.12);' +
        'overflow:hidden;' +
      '">' +
      // Decorative top bar
      '<div style="height:3px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.65),transparent);"></div>' +
      '<div style="padding:26px 28px 24px;">' +
        '<div class="private-info-title" style="font-family:Cinzel,serif;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(201,168,76,.55);margin-bottom:14px;">' + (rendered.title || 'Private Info') + '</div>' +
        '<div class="private-info-body" style="font-size:15px;line-height:1.6;color:var(--text,#e2d6bc);">' + rendered.body + '</div>' +
        '<button type="button" class="private-info-close" style="margin-top:22px;width:100%;padding:13px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.38);border-radius:11px;color:var(--gold,#c9a84c);font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:.12em;cursor:pointer;transition:background .15s;" onmouseover="this.style.background=\'rgba(201,168,76,.2)\'" onmouseout="this.style.background=\'rgba(201,168,76,.1)\'">Schließen</button>' +
      '</div>' +
      '</div>';

    overlay.querySelector('.private-info-close').addEventListener('click', function () {
      hidePrivateInfoOverlay();
    });

    document.body.appendChild(overlay);
    wireRoleImageFallbacks(overlay);
    if (typeof window !== 'undefined') window.currentPrivatePayload = payload;
  }

  function hidePrivateInfoOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
    if (typeof window !== 'undefined') window.currentPrivatePayload = null;
  }

  /** Rollen-Mapping: Referenz welche Rolle welchen Info-Typ braucht. Hook-Liste für spätere Integration. */
  var PRIVATE_INFO_ROLE_MAP = {
    self_role_reveal: 'ALL',
    character_plus_players: ['washerwoman', 'librarian', 'investigator', 'grandmother', 'harlot'],
    character_token: ['undertaker', 'ravenkeeper', 'alchemist', 'apprentice', 'boffin', 'courtier', 'philosopher', 'pixie', 'cannibal', 'cerenovus', 'widow'],
    two_characters_one_player: ['dreamer'],
    role_list: ['godfather', 'snitch', 'lunatic', 'huntsman', 'widow'],
    bluffs_three: ['imp', 'po', 'pukka', 'shabaloth', 'zombuul', 'fang_gu', 'vigormortis', 'no_dashii', 'vortox', 'al_hadikhia', 'kazali', 'legion', 'leviathan', 'lil_monsta', 'lleech', 'lord_of_typhon', 'ojo', 'riot', 'summoner', 'yaggababble', 'lunatic', 'snitch'],
    fake_role_reveal: ['drunk', 'marionette', 'lunatic'],
    role_replacement: ['snake_charmer', 'pit_hag', 'engineer', 'fang_gu', 'scarlet_woman', 'imp', 'summoner', 'farmer', 'huntsman', 'barber', 'hatter', 'cacklejack', 'village_idiot', 'kazali', 'lil_monsta'],
    private_text: ['savant', 'fisherman', 'amnesiac', 'mezepheles', 'harpy', 'widow', 'artist', 'general'],
    evil_setup_info: ['poisoner', 'spy', 'scarlet_woman', 'baron', 'godfather', 'devils_advocate', 'assassin', 'mastermind', 'evil_twin', 'witch', 'cerenovus', 'pit_hag', 'boffin', 'summoner', 'widow', 'imp', 'po', 'pukka', 'shabaloth', 'zombuul', 'fang_gu', 'vigormortis', 'no_dashii', 'vortox', 'lunatic', 'marionette', 'poppy_grower', 'magician', 'snitch', 'kazali', 'lil_monsta', 'legion', 'lord_of_typhon'],
    alignment_change: ['bounty_hunter', 'mezepheles', 'fang_gu', 'cult_leader', 'goon', 'ogre', 'marionette', 'legion', 'lord_of_typhon', 'summoner']
  };

  window.showPrivateInfoOverlay = showPrivateInfoOverlay;
  window.hidePrivateInfoOverlay = hidePrivateInfoOverlay;
  window.renderPrivateInfoContent = renderPrivateInfoContent;
  window.PRIVATE_INFO_ROLE_MAP = PRIVATE_INFO_ROLE_MAP;
})();
