(function(){
  const BOTC = window.BOTC = window.BOTC || {};

  let root = null;
  let svg = null;
  let onSeatClick = null;
  let seats = [];
  let selectedSeatId = null;

  let posBySeatId = new Map();

  const ICON_ALIASES = {
    "fortune_teller": "fortuneteller",
    "scarlet_woman": "scarletwoman",
    "washerwoman": "washerwoman",
    "chef": "chef",
    "empath": "empath",
    "imp": "imp"
  };

  function iconKey(roleId) {
    return String(roleId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function roleImageUrlsForTownSeat(roleId) {
    if (!roleId) return [];
    if (typeof window.roleImageUrlListForSeat === "function") {
      var list = window.roleImageUrlListForSeat(roleId);
      if (list && list.length) return list.slice();
    }
    if (typeof window.roleImageUrlList === "function") {
      var list2 = window.roleImageUrlList(roleId);
      if (list2 && list2.length) return list2.slice();
    }
    var key = ICON_ALIASES[roleId] != null ? ICON_ALIASES[roleId] : iconKey(roleId);
    return key ? ["./icons/" + key + ".webp"] : [];
  }

  function mount(el, onClick){
    root = el;
    onSeatClick = onClick;
    svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    root.innerHTML = "";
    root.appendChild(svg);
    draw();
  }

  function setModel(nextSeats, nextSelectedId){
    seats = Array.isArray(nextSeats) ? nextSeats : [];
    selectedSeatId = nextSelectedId || null;
    draw();
  }

  function getSeatPos(seatId){
    const p = posBySeatId.get(String(seatId));
    if (!p) return null;
    return { x: p.x, y: p.y };
  }

  function draw(){
    if (!root || !svg) return;

    const rect = root.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    svg.setAttribute("viewBox","0 0 " + w + " " + h);
    svg.innerHTML = "";

    var defs = document.createElementNS(svg.namespaceURI, "defs");
    var pattern = document.createElementNS(svg.namespaceURI, "pattern");
    pattern.setAttribute("id", "chefBg");
    pattern.setAttribute("patternUnits", "objectBoundingBox");
    pattern.setAttribute("width", "1");
    pattern.setAttribute("height", "1");
    var img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", "icons/chef.webp");
    img.setAttribute("x", "0");
    img.setAttribute("y", "0");
    img.setAttribute("width", "1");
    img.setAttribute("height", "1");
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    pattern.appendChild(img);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    posBySeatId = new Map();

    const minDim = Math.min(w, h);
    const n = Math.max(1, seats.length);

    /* Seat/ring ~+45%: larger ring and seats, scale down if many players */
    let ringR = minDim * 0.42;
    let seatR = Math.min(48, Math.max(26, minDim * 0.088));

    const arc = (2 * Math.PI * ringR) / n;
    const maxSeatR = (arc - 18) / 2;
    if (maxSeatR < seatR) seatR = Math.max(16, maxSeatR);

    const mainFont = Math.max(13, Math.min(22, seatR * 0.60));
    const subFont = Math.max(10, Math.min(16, seatR * 0.38));

    const cx = w/2;
    const cy = h/2;

    seats.forEach((s,i)=>{
      const a = (i/n)*Math.PI*2 - Math.PI/2;
      const x = cx + Math.cos(a)*ringR;
      const y = cy + Math.sin(a)*ringR;

      posBySeatId.set(String(s.id), { x, y });

      const g = document.createElementNS(svg.namespaceURI,"g");
      g.setAttribute("class","seat");
      g.setAttribute("data-seat", String(s.id));
      g.setAttribute("transform","translate(" + x + "," + y + ")");

      const team = String(s.team || "unknown").toLowerCase();
      if (team === "good") g.classList.add("teamGood");
      else if (team === "evil") g.classList.add("teamEvil");
      else if (team === "outsider") g.classList.add("teamOutsider");
      else if (team === "minion") g.classList.add("teamMinion");
      else g.classList.add("teamUnknown");

      const iconUrls = roleImageUrlsForTownSeat(s.roleId || s.role);

      const c = document.createElementNS(svg.namespaceURI,"circle");
      c.setAttribute("r", String(seatR));
      if (String(s.roleId || "").toLowerCase() === "chef") {
        c.setAttribute("fill", "url(#chefBg)");
      }

      if (iconUrls.length) {
        const clipId = "clipSeat" + s.id;
        const clipPathEl = document.createElementNS(svg.namespaceURI, "clipPath");
        clipPathEl.setAttribute("id", clipId);
        const clipCircle = document.createElementNS(svg.namespaceURI, "circle");
        clipCircle.setAttribute("cx", "0");
        clipCircle.setAttribute("cy", "0");
        clipCircle.setAttribute("r", String(seatR));
        clipPathEl.appendChild(clipCircle);
        defs.appendChild(clipPathEl);

        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        var uidx = 0;
        function applyNextHref() {
          if (uidx >= iconUrls.length) return;
          var u = iconUrls[uidx++];
          img.setAttribute("href", u);
          img.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", u);
        }
        applyNextHref();
        img.setAttribute("x", String(-seatR));
        img.setAttribute("y", String(-seatR));
        img.setAttribute("width", String(2 * seatR));
        img.setAttribute("height", String(2 * seatR));
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        img.setAttribute("clip-path", "url(#" + clipId + ")");
        img.setAttribute("style", "pointer-events:none");
        img.setAttribute("class", "seatIcon");
        img.addEventListener("error", function onIcoErr() {
          if (uidx < iconUrls.length) applyNextHref();
        });
        g.appendChild(img);
      }

      g.appendChild(c);

      const tMain = document.createElementNS(svg.namespaceURI,"text");
      tMain.setAttribute("text-anchor","middle");
      tMain.setAttribute("y", String(-subFont * 0.1));
      tMain.setAttribute("class","seatName");
      tMain.setAttribute("style","font-size:" + mainFont + "px");
      const label = s.name ? String(s.name).trim().slice(0,2).toUpperCase() : String(s.id);
      tMain.textContent = label;

      const tRole = document.createElementNS(svg.namespaceURI,"text");
      tRole.setAttribute("text-anchor","middle");
      tRole.setAttribute("y", String(mainFont * 0.55));
      tRole.setAttribute("class","roleLine");
      tRole.setAttribute("style","font-size:" + subFont + "px");
      const role = s.roleShort ? String(s.roleShort).trim().slice(0,6).toUpperCase() : "—";
      tRole.textContent = role;

      g.appendChild(tMain);
      g.appendChild(tRole);

      function handleActivate(){
        if (onSeatClick) onSeatClick(s.id, { x, y });
      }
      g.addEventListener("click", handleActivate);
      g.addEventListener("touchend", function(ev){
        ev.preventDefault();
        handleActivate();
      }, { passive: false });

      if (s.id === selectedSeatId) g.classList.add("selected");
      if (s.alive === false) g.style.opacity = ".45";

      svg.appendChild(g);
    });
  }

  function resize(){
    draw();
  }

  BOTC.UITown = { mount, setModel, resize, getSeatPos };
})();
