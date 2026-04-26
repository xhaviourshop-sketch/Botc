(function(){
  const BOTC = window.BOTC = window.BOTC || {};
  const KEY_V1 = "botc_storyteller_state_v1";
  const KEY = "botc_storyteller_state_v2";
  const VERSION = 2;

  function nowISO(){
    try{ return new Date().toISOString(); }catch(e){ return ""; }
  }

  function deepClone(v){
    return JSON.parse(JSON.stringify(v));
  }

  function safeParse(s){
    try{ return JSON.parse(s); }catch(e){ return null; }
  }

  function migrateV1toV2(obj){
    if (!obj || !obj.meta) return null;
    if (obj.meta.version !== 1) return null;
    obj.meta.version = VERSION;
    return obj;
  }

  function load(){
    let raw = localStorage.getItem(KEY);
    if (!raw) {
      raw = localStorage.getItem(KEY_V1);
      if (raw) {
        const obj = safeParse(raw);
        const m = migrateV1toV2(obj);
        if (m) {
          save(m);
          try { localStorage.removeItem(KEY_V1); } catch (_) {}
          return m;
        }
      }
      return null;
    }
    const obj = safeParse(raw);
    if (!obj) return null;
    if (!obj.meta) return null;
    if (obj.meta.version === 1) {
      const m = migrateV1toV2(obj);
      if (m) { save(m); return m; }
    }
    if (obj.meta.version !== VERSION) return null;
    return obj;
  }

  function save(state){
    const s = deepClone(state);
    if (!s.meta) s.meta = {};
    s.meta.version = VERSION;
    s.meta.savedAt = nowISO();
    const json = JSON.stringify(s);
    localStorage.setItem(KEY, json);
    if (typeof window !== 'undefined' && window.BOTC_IDB_mirror && typeof window.BOTC_IDB_mirror.put === 'function') {
      try { window.BOTC_IDB_mirror.put(json); } catch (_) {}
    }
  }

  function clear(){
    localStorage.removeItem(KEY);
    try { localStorage.removeItem(KEY_V1); } catch (_) {}
  }

  function exportState(state){
    const s = deepClone(state);
    if (!s.meta) s.meta = {};
    s.meta.version = VERSION;
    s.meta.exportedAt = nowISO();
    return JSON.stringify(s);
  }

  function importState(jsonText){
    const obj = safeParse(jsonText);
    if (!obj) return null;
    if (!obj.meta) return null;
    if (obj.meta.version !== VERSION && obj.meta.version !== 1) return null;
    if (obj.meta.version === 1) {
      const m = migrateV1toV2(obj);
      if (!m) return null;
      save(m);
      return m;
    }
    save(obj);
    return obj;
  }

  BOTC.State = { load, save, clear, exportState, importState, VERSION, KEY, KEY_V1 };
})();
