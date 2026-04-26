(function(){
  const BOTC = window.BOTC = window.BOTC || {};

  let root = null;
  let model = null;
  let handlers = null;

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function mount(el, h){
    root = el;
    handlers = h || {};
    render();
  }

  function setModel(next){
    model = next;
    render();
  }

  function getModel(){
    return model;
  }

  function render(){
    if (!root) return;

    if (!model || !Array.isArray(model.steps)){
      root.innerHTML = '<div class="noCard dashText">Night Order ist noch nicht initialisiert.</div>';
      return;
    }

    const missing = Array.isArray(model.missingNightOrder) ? model.missingNightOrder : [];
    const warnBadge = missing.length
      ? '<div class="nobadge nobadgeWarn">⚠ ' + escapeHtml(String(missing.length)) + ' Rolle(n) ohne Night-Order</div>'
      : '<div class="nobadge">OK</div>';

    const auto = !!model.auto;

    const top = ''
      + '<div class="noactions" style="margin-bottom:10px;">'
      + '  <button id="noRegenerate" class="btn btnSmall" type="button">Neu generieren</button>'
      + '  <button id="noNewNight" class="btn btnSmall" type="button">Neue Nacht</button>'
      + '  <label class="pill" style="margin-left:auto;">'
      + '    <input id="noAuto" type="checkbox"' + (auto ? ' checked' : '') + '>'
      + '    <span>Auto</span>'
      + '  </label>'
      + '</div>'
      + '<div class="noactions" style="margin-bottom:10px;">'
      + warnBadge
      + '  <div class="nosubRow">'
      + '    <button id="noNightPrev" class="btn btnSmall" type="button">−</button>'
      + '    <div class="nosub">Nacht: ' + escapeHtml(String(model.nightNumber || 1)) + '</div>'
      + '    <button id="noNightNext" class="btn btnSmall" type="button">+</button>'
      + '    <button id="noNightReset" class="btn btnSmall" type="button">Reset</button>'
      + '  </div>'
      + '</div>'
      + '<div class="noactions" style="margin-bottom:10px;gap:10px;flex-wrap:wrap;align-items:center;">'
      + '  <label class="pill"><input id="noOpenOnly" type="checkbox"' + (model.filter && model.filter.openOnly ? ' checked' : '') + '><span>Nur offen</span></label>'
      + '  <label class="pill"><input id="noSeatOnly" type="checkbox"' + (model.filter && model.filter.seatOnly ? ' checked' : '') + '><span>Nur Seat</span></label>'
      + '  <input id="noSearch" class="noSearch" type="text" value="' + escapeHtml(String(model.filter && model.filter.q || "")) + '" placeholder="Suchen…">'
      + '  <select id="noPhase" class="noSelect">'
      + '    <option value="auto"'+ ((model.filter && model.filter.viewPhase || "auto")==="auto" ? " selected" : "") +'>Auto</option>'+
      + '    <option value="first"'+ ((model.filter && model.filter.viewPhase)==="first" ? " selected" : "") +'>1. Nacht</option>'+
      + '    <option value="other"'+ ((model.filter && model.filter.viewPhase)==="other" ? " selected" : "") +'>Andere Nächte</option>'+
      + '  </select>'
      + '</div>';

    const stepsHtml = model.steps.map((st, idx) => {
      const done = !!st.done;
      const note = st.note || "";
      const label = st.label || ("Step " + (idx+1));
      const sid = st.id || ("step_" + idx);
      const seatId = st.seatId != null ? String(st.seatId) : "";
      const seatAttr = seatId ? (' data-seat="' + escapeHtml(seatId) + '"') : "";
      return ''
        + '<div class="noitem" data-step="' + escapeHtml(sid) + '"' + seatAttr + '>'
        + '  <div class="noitemTop">'
        + '    <input class="nochk" type="checkbox"' + (done ? ' checked' : '') + '>'
        + '    <div class="nolabel">' + escapeHtml(label) + '</div>'
        + '  </div>'
        + '  <textarea class="nonote" placeholder="Notiz..." spellcheck="false">' + escapeHtml(note) + '</textarea>'
        + '</div>';
    }).join("");

    root.innerHTML = top + '<div class="nolist">' + stepsHtml + '</div>';

    const stepEls = Array.from(root.querySelectorAll(".noitem"));
    stepEls.forEach(el => {
      const stepId = el.getAttribute("data-step");
      const seatId = el.getAttribute("data-seat");
      const chk = el.querySelector(".nochk");
      const note = el.querySelector(".nonote");

      el.addEventListener("click", (ev) => {
        const tag = String(ev.target && ev.target.tagName || "").toLowerCase();
        if (tag === "textarea" || tag === "input" || tag === "button" || tag === "select" || tag === "option") return;
        if (seatId && handlers && typeof handlers.onFocusSeat === "function"){
          handlers.onFocusSeat(parseInt(seatId,10));
        }
      });

      if (chk){
        chk.addEventListener("change", () => {
          const step = model.steps.find(s => String(s.id) === String(stepId));
          if (!step) return;
          step.done = !!chk.checked;
          if (handlers && typeof handlers.onChange === "function") handlers.onChange();
        });
      }

      if (note){
        note.addEventListener("input", () => {
          const step = model.steps.find(s => String(s.id) === String(stepId));
          if (!step) return;
          step.note = note.value;
          if (handlers && typeof handlers.onChange === "function") handlers.onChange();
        });
      }
    });

    const btnReg = document.getElementById("noRegenerate");
    if (btnReg){
      btnReg.addEventListener("click", () => {
        if (handlers && typeof handlers.onRegenerate === "function") handlers.onRegenerate();
      });
    }

    const btnNight = document.getElementById("noNewNight");
    if (btnNight){
      btnNight.addEventListener("click", () => {
        if (handlers && typeof handlers.onNewNight === "function") handlers.onNewNight();
      });
    }

    const autoToggle = document.getElementById("noAuto");
    if (autoToggle){
      autoToggle.addEventListener("change", () => {
        if (handlers && typeof handlers.onToggleAuto === "function") handlers.onToggleAuto(!!autoToggle.checked);
      });
    }

    const nightPrev = document.getElementById("noNightPrev");
    if (nightPrev){
      nightPrev.addEventListener("click", () => {
        if (handlers && typeof handlers.onNightDelta === "function") handlers.onNightDelta(-1);
      });
    }

    const nightNext = document.getElementById("noNightNext");
    if (nightNext){
      nightNext.addEventListener("click", () => {
        if (handlers && typeof handlers.onNightDelta === "function") handlers.onNightDelta(+1);
      });
    }

    const nightReset = document.getElementById("noNightReset");
    if (nightReset){
      nightReset.addEventListener("click", () => {
        if (handlers && typeof handlers.onResetNight === "function") handlers.onResetNight();
      });
    }


    const openOnlyToggle = document.getElementById("noOpenOnly");
    if (openOnlyToggle){
      openOnlyToggle.addEventListener("change", () => {
        if (handlers && typeof handlers.onSetFilter === "function") handlers.onSetFilter({ openOnly: !!openOnlyToggle.checked });
      });
    }

    const seatOnlyToggle = document.getElementById("noSeatOnly");
    if (seatOnlyToggle){
      seatOnlyToggle.addEventListener("change", () => {
        if (handlers && typeof handlers.onSetFilter === "function") handlers.onSetFilter({ seatOnly: !!seatOnlyToggle.checked });
      });
    }

    const search = document.getElementById("noSearch");
    if (search){
      search.addEventListener("input", () => {
        if (handlers && typeof handlers.onSetFilter === "function") handlers.onSetFilter({ q: String(search.value || "") });
      });
    }

    const phase = document.getElementById("noPhase");
    if (phase){
      phase.addEventListener("change", () => {
        const v = String(phase.value || "auto");
        if (handlers && typeof handlers.onSetFilter === "function") handlers.onSetFilter({ viewPhase: v });
      });
    }
  }

  BOTC.UINightOrder = { mount, setModel, getModel };
})();