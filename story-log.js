/**
 * Phase J — Leiter-Journal (chronologische Notizen, optional Nacht-Tag-Automatik).
 * API: window.BOTC.StoryLog
 */
(function () {
  'use strict';
  var MAX = 500;
  var entries = [];

  function nowIso() {
    try { return new Date().toISOString(); } catch (e) { return ''; }
  }

  function append(text, meta) {
    var t = String(text || '').trim();
    if (!t) return;
    var n = typeof nightNumber !== 'undefined' ? nightNumber : null;
    entries.push({ ts: nowIso(), night: n, text: t, meta: meta || null });
    if (entries.length > MAX) entries.splice(0, entries.length - MAX);
    if (typeof scheduleSave === 'function') scheduleSave();
  }

  function loadFromState(arr) {
    entries = Array.isArray(arr) ? arr.filter(function (e) { return e && typeof e.text === 'string'; }) : [];
    if (entries.length > MAX) entries = entries.slice(-MAX);
  }

  function getEntries() {
    return entries.slice();
  }

  function clear(silent) {
    entries = [];
    if (!silent && typeof scheduleSave === 'function') scheduleSave();
  }

  function toPlainText() {
    return entries.map(function (e) {
      var prefix = e.ts ? e.ts.slice(0, 19).replace('T', ' ') : '';
      var n = e.night != null ? (' [N' + e.night + ']') : '';
      return prefix + n + ' — ' + String(e.text || '');
    }).join('\n');
  }

  window.BOTC = window.BOTC || {};
  window.BOTC.StoryLog = {
    append: append,
    loadFromState: loadFromState,
    getEntries: getEntries,
    clear: clear,
    toPlainText: toPlainText,
    MAX_ENTRIES: MAX
  };
  window.botcStoryLogAppend = append;
})();
