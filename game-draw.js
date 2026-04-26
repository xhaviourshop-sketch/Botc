let tokenRevealMode = false;

function escHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getSeatSvgPosition(seatId) {
  const pos = lastSeatPositions.get(seatId);
  if (pos) return { x: pos.x, y: pos.y };
  if (lastPlayfieldRect) return { x: lastPlayfieldRect.cx, y: lastPlayfieldRect.cy };
  return { x: 80, y: 80 };
}

function scrollNightOrderToCurrent() {
  const curr = document.querySelector('#nightOrderEl .noItem.current');
  if (curr) curr.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function toggleAssistantMode() {
  assistantMode = !assistantMode;
  const btn = document.getElementById('topBarAssistentBtn');
  if (btn) btn.classList.toggle('primary', assistantMode);
  updateTopBarForAssistant();
  if (assistantMode) scrollNightOrderToCurrent();
}

function toggleSpyViewMode() {
  if (typeof spyViewMode === 'undefined') return;
  spyViewMode = !spyViewMode;
  const btn = document.getElementById('topBarSpyBtn');
  if (btn) btn.classList.toggle('primary', spyViewMode);
  draw();
  if (typeof scheduleSave === 'function') scheduleSave();
}
window.toggleSpyViewMode = toggleSpyViewMode;

function updateTopBarForAssistant() {
  const def = document.querySelectorAll('.topBarDefault');
  const titleEl = document.getElementById('topBarAssistantTitle');
  const counterEl = document.getElementById('topBarStepCounter');
  const prevBtn = document.getElementById('topBarPrevBtn');
  const nextBtn = document.getElementById('topBarNextBtn');
  def.forEach(el => { el.style.display = assistantMode ? 'none' : ''; });
  if (titleEl) titleEl.style.display = assistantMode ? 'inline' : 'none';
  if (counterEl) counterEl.style.display = assistantMode ? 'inline' : 'none';
  if (prevBtn) prevBtn.style.display = assistantMode ? 'flex' : 'none';
  if (nextBtn) {
    nextBtn.classList.toggle('assistantNext', assistantMode);
    nextBtn.classList.toggle('primary', assistantMode);
  }
  if (assistantMode && nightSteps.length) {
    const next = nightSteps.find(s => !s.done);
    const idx = nightSteps.findIndex(s => !s.done);
    if (titleEl) titleEl.textContent = next ? next.label : 'Nacht abgeschlossen';
    if (counterEl) counterEl.textContent = next ? `Step ${(idx >= 0 ? idx + 1 : nightSteps.length)}/${nightSteps.length}` : `Step ${nightSteps.length}/${nightSteps.length}`;
  }
}

// ═══════════════ SVG DRAW ═══════════════
// ═══════════════ SVG DRAW ═══════════════
const SVG_NS = 'http://www.w3.org/2000/svg';
let drawRaf = null;
function draw() {
  if (drawRaf) return;
  drawRaf = requestAnimationFrame(() => { drawRaf = null; drawImpl(); });
}
function drawImpl() {
  const svg = document.getElementById('svgTown');
  const town = document.getElementById('town');
  const rect = town.getBoundingClientRect();
  const W = rect.width || 900;
  const H = rect.height || 700;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = '';

  const defs = el('defs');

  ['good','evil','minion','outsider','unknown'].forEach(team => {
    const col = TEAM_COLOR[team];
    const f = el('filter');
    f.id = `glow-${team}`;
    f.setAttribute('x','-50%'); f.setAttribute('y','-50%');
    f.setAttribute('width','200%'); f.setAttribute('height','200%');
    const fe = el('feDropShadow');
    fe.setAttribute('dx','0'); fe.setAttribute('dy','0');
    fe.setAttribute('stdDeviation','5');
    fe.setAttribute('flood-color', col.glow);
    f.appendChild(fe);
    defs.appendChild(f);
  });

  const desat = el('filter'); desat.id = 'desat';
  const cm = el('feColorMatrix');
  cm.setAttribute('type','saturate'); cm.setAttribute('values','0.12');
  desat.appendChild(cm); defs.appendChild(desat);

  const tokenPlateGrad = el('radialGradient');
  tokenPlateGrad.id = 'tokenPlateGrad';
  tokenPlateGrad.setAttribute('cx', '42%');
  tokenPlateGrad.setAttribute('cy', '38%');
  tokenPlateGrad.setAttribute('r', '78%');
  [['0%', '#4a435f'], ['48%', '#252038'], ['100%', '#0c0a14']].forEach(([o, c]) => {
    const st = el('stop'); st.setAttribute('offset', o); st.setAttribute('stop-color', c); tokenPlateGrad.appendChild(st);
  });
  defs.appendChild(tokenPlateGrad);

  svg.appendChild(defs);

  const n = seats.length;
  const pf = getPlayfieldRect();
  lastPlayfieldRect = pf;
  if (!n) return;

  const cx = pf.cx, cy = pf.cy;
  const minDim = pf.minDim;

  let baseSeatR = Math.min(46, Math.max(24, minDim * 0.075));
  const baseRingR = minDim * 0.46 * getCircleSizeScale();
  const ringRForArc = Math.min(baseRingR, (pf.h / 2) - 18 - pf.margin, (pf.w / 2) - 18 - pf.margin);
  const arcLen = (2 * Math.PI * Math.max(1, ringRForArc)) / n;
  const maxR = (arcLen - 16) / 2;
  if (baseSeatR > maxR) baseSeatR = Math.max(18, maxR);
  const seatScale = getSeatSizeScale();
  let seatR = baseSeatR * seatScale;
  seatR = Math.min(seatR, maxR);
  seatR = Math.max(18, seatR);
  const artR = Math.max(1, seatR * 0.86);

  const { rx, ry } = getLayoutRxRy(pf, seatR);
  const ringR = Math.max(rx, ry);

  if (window.DEBUG_PLAYFIELD) {
    const debugRect = el('rect');
    debugRect.setAttribute('x', pf.x0);
    debugRect.setAttribute('y', pf.y0);
    debugRect.setAttribute('width', pf.w);
    debugRect.setAttribute('height', pf.h);
    debugRect.setAttribute('fill', 'none');
    debugRect.setAttribute('stroke', 'rgba(255,0,0,0.35)');
    debugRect.setAttribute('stroke-width', '1');
    debugRect.setAttribute('pointer-events', 'none');
    svg.appendChild(debugRect);
  }

  const mainFS = Math.max(11, Math.min(18, seatR * 0.58));
  const roleFS = Math.max(8,  Math.min(13, seatR * 0.30));
  const numFS  = Math.max(9,  Math.min(14, seatR * 0.34));

  const arcR = seatR + Math.max(10, seatR * 0.35);
  const startRad = 210 * Math.PI / 180, endRad = -30 * Math.PI / 180;
  const ax1 = Math.cos(startRad) * arcR, ay1 = Math.sin(startRad) * arcR;
  const ax2 = Math.cos(endRad) * arcR, ay2 = Math.sin(endRad) * arcR;
  const arcPathD = 'M ' + ax1 + ' ' + ay1 + ' A ' + arcR + ' ' + arcR + ' 0 0 1 ' + ax2 + ' ' + ay2;

  seats.forEach(function (s) {
    const clipArt = el('clipPath'); clipArt.setAttribute('id', 'clip-seat-art-' + s.id);
    const cArt = el('circle'); cArt.setAttribute('r', artR); cArt.setAttribute('cx', 0); cArt.setAttribute('cy', 0);
    clipArt.appendChild(cArt); defs.appendChild(clipArt);
    const pathArc = el('path'); pathArc.setAttribute('id', 'arc-seat-' + s.id); pathArc.setAttribute('d', arcPathD);
    defs.appendChild(pathArc);
  });

  [[ringR+seatR+16,.04],[ringR+seatR+30,.025],[ringR+seatR+36,.014]].forEach(([r,op]) => {
    const c = el('circle');
    c.setAttribute('cx',cx); c.setAttribute('cy',cy); c.setAttribute('r',r);
    c.setAttribute('fill','none');
    c.setAttribute('stroke',`rgba(201,168,76,${op})`);
    c.setAttribute('stroke-width','1');
    svg.appendChild(c);
  });

  const ambGrad = el('radialGradient');
  ambGrad.id = 'ambGrad'; ambGrad.setAttribute('cx','50%'); ambGrad.setAttribute('cy','50%'); ambGrad.setAttribute('r','50%');
  [[0,'rgba(35,20,65,.5)'],[1,'rgba(8,6,18,0)']].forEach(([off,col]) => {
    const s2 = el('stop'); s2.setAttribute('offset',off); s2.setAttribute('stop-color',col); ambGrad.appendChild(s2);
  });
  defs.appendChild(ambGrad);
  const ambCirc = el('circle');
  ambCirc.setAttribute('cx',cx); ambCirc.setAttribute('cy',cy);
  ambCirc.setAttribute('r', ringR-seatR-8);
  ambCirc.setAttribute('fill','url(#ambGrad)'); ambCirc.setAttribute('pointer-events','none');
  svg.appendChild(ambCirc);

  lastSeatPositions.clear();
  seats.forEach((s, i) => {
    const angle = (i/n)*Math.PI*2 - Math.PI/2;
    let x = cx + Math.cos(angle)*rx;
    let y = cy + Math.sin(angle)*ry;
    x = Math.max(pf.x0 + seatR, Math.min(pf.x0 + pf.w - seatR, x));
    y = Math.max(pf.y0 + seatR, Math.min(pf.y0 + pf.h - seatR, y));
    lastSeatPositions.set(s.id, { x, y });

    const team = teamOf(s);
    const col = TEAM_COLOR[team];
    const isSelected = s.id === selectedId;
    const isDead = !s.alive;

    const seatUrlsFn = (typeof roleImageUrlListForSeat === 'function')
      ? roleImageUrlListForSeat
      : roleImageUrlList;
    const urls = (typeof seatUrlsFn === 'function')
      ? seatUrlsFn(s.roleId || s.role)
      : (iconHref(s.roleId || s.role) ? [iconHref(s.roleId || s.role)] : []);
    const clipId = 'clip-seat-art-' + s.id;
    const arcId = 'arc-seat-' + s.id;

    const g = el('g');
    g.setAttribute('class','seatG');
    g.setAttribute('data-id', s.id);
    g.setAttribute('transform', `translate(${x},${y})`);
    if (isDead) g.setAttribute('filter','url(#desat)');
    g.addEventListener('click', () => onSeatClick(s.id, x, y, W, H));
    g.addEventListener('mouseenter', () => showAbilityTooltip(s, x, y, W, H));
    g.addEventListener('mouseleave', () => hideAbilityTooltip());

    if (isSelected || !isDead) {
      const shadow = el('circle');
      shadow.setAttribute('r', seatR + (isSelected ? 8 : 4));
      shadow.setAttribute('fill', isSelected ? col.glow : col.dim);
      shadow.setAttribute('opacity', isSelected ? '0.55' : '0.3');
      g.appendChild(shadow);
    }

    if (isSelected) {
      const pulse = el('circle');
      pulse.setAttribute('r', seatR + 10);
      pulse.setAttribute('fill','none');
      pulse.setAttribute('stroke', col.ring);
      pulse.setAttribute('stroke-width','1.5');
      pulse.setAttribute('opacity','0');
      const anim = el('animate');
      anim.setAttribute('attributeName','r');
      anim.setAttribute('from', seatR+4); anim.setAttribute('to', seatR+22);
      anim.setAttribute('dur','2s'); anim.setAttribute('repeatCount','indefinite');
      const anim2 = el('animate');
      anim2.setAttribute('attributeName','opacity');
      anim2.setAttribute('from','0.5'); anim2.setAttribute('to','0');
      anim2.setAttribute('dur','2s'); anim2.setAttribute('repeatCount','indefinite');
      pulse.appendChild(anim); pulse.appendChild(anim2);
      g.appendChild(pulse);
    }

    // Nomination ring (red dashed ring if player is nominee today)
    const isNominee = (typeof nominationLog !== 'undefined' && Array.isArray(nominationLog)) &&
      nominationLog.some(function(e) { return e.nomineeId === s.id; });
    if (isNominee) {
      const nomRing = el('circle');
      nomRing.setAttribute('r', String(seatR + 6));
      nomRing.setAttribute('fill', 'none');
      nomRing.setAttribute('stroke', '#d44040');
      nomRing.setAttribute('stroke-width', '2.5');
      nomRing.setAttribute('stroke-dasharray', '5 3');
      nomRing.setAttribute('opacity', '0.8');
      g.appendChild(nomRing);
    }

    const bg = el('circle');
    bg.setAttribute('r', seatR);
    bg.setAttribute('fill', isDead ? '#0e0c1a' : 'url(#tokenPlateGrad)');
    if (!isDead && isSelected) bg.setAttribute('opacity', '0.95');
    g.appendChild(bg);

    // ICON: lokal → remote → legacy — „meet“ zeigt den ganzen Token in der Scheibe (kein aggressives slice)
    if (urls.length) {
      const img = el('image');
      img.setAttribute('class', 'seatIcon');
      img.setAttribute('x', -seatR); img.setAttribute('y', -seatR);
      img.setAttribute('width', 2 * seatR); img.setAttribute('height', 2 * seatR);
      img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      img.setAttribute('clip-path', 'url(#' + clipId + ')');
      img.setAttribute('style', 'pointer-events:none');
      let uidx = 0;
      function applySeatIconUrl() {
        if (uidx >= urls.length) return;
        const u = urls[uidx++];
        img.setAttribute('href', u);
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', u);
      }
      applySeatIconUrl();
      img.addEventListener('error', function onIcoErr() {
        if (uidx < urls.length) applySeatIconUrl();
      });
      g.appendChild(img);
    }

    if (!isDead) {
      const innerPlate = el('circle');
      innerPlate.setAttribute('r', artR);
      innerPlate.setAttribute('fill', 'none');
      innerPlate.setAttribute('stroke', 'rgba(201,168,76,0.42)');
      innerPlate.setAttribute('stroke-width', '1.25');
      innerPlate.setAttribute('style', 'pointer-events:none');
      g.appendChild(innerPlate);
    }

    // Totenkopf-Symbol für tote Charaktere
    if (isDead) {
      const skull = el('text');
      skull.textContent = '☠';
      skull.setAttribute('text-anchor', 'middle');
      skull.setAttribute('dominant-baseline', 'middle');
      skull.setAttribute('y', seatR * 0.3);
      skull.setAttribute('font-size', Math.round(seatR * 0.9));
      skull.setAttribute('fill', '#f5f0e6');
      skull.setAttribute('stroke', '#000');
      skull.setAttribute('stroke-width', '1.5');
      skull.setAttribute('style', 'pointer-events:none');
      g.appendChild(skull);

      // Ghost vote indicator (small badge bottom-right of token)
      const ghostUsed = !!s.ghostVoteUsed;
      const ghostBg = el('circle');
      ghostBg.setAttribute('cx', seatR * 0.62);
      ghostBg.setAttribute('cy', seatR * 0.62);
      ghostBg.setAttribute('r', seatR * 0.32);
      ghostBg.setAttribute('fill', ghostUsed ? 'rgba(120,30,30,.85)' : 'rgba(30,60,120,.85)');
      ghostBg.setAttribute('stroke', ghostUsed ? 'rgba(200,80,80,.7)' : 'rgba(100,160,255,.7)');
      ghostBg.setAttribute('stroke-width', '1.5');
      ghostBg.setAttribute('style', 'pointer-events:none');
      g.appendChild(ghostBg);
      const ghostText = el('text');
      ghostText.textContent = '👻';
      ghostText.setAttribute('text-anchor', 'middle');
      ghostText.setAttribute('dominant-baseline', 'middle');
      ghostText.setAttribute('x', seatR * 0.62);
      ghostText.setAttribute('y', seatR * 0.65);
      ghostText.setAttribute('font-size', Math.round(seatR * 0.35));
      ghostText.setAttribute('opacity', ghostUsed ? '0.4' : '1');
      ghostText.setAttribute('style', 'pointer-events:none');
      g.appendChild(ghostText);
      if (ghostUsed) {
        // Cross-through line
        const cross = el('line');
        cross.setAttribute('x1', seatR * 0.34); cross.setAttribute('y1', seatR * 0.34);
        cross.setAttribute('x2', seatR * 0.90); cross.setAttribute('y2', seatR * 0.90);
        cross.setAttribute('stroke', 'rgba(255,80,80,.85)');
        cross.setAttribute('stroke-width', '2');
        cross.setAttribute('style', 'pointer-events:none');
        g.appendChild(cross);
      }
    }

    const ring = el('circle');
    ring.setAttribute('r', seatR);
    ring.setAttribute('fill','none');
    ring.setAttribute('stroke', col.ring);
    ring.setAttribute('stroke-width', isSelected ? '2.5' : '1.8');
    if (isDead) { ring.setAttribute('stroke-dasharray','4 3'); ring.setAttribute('stroke-opacity','0.4'); }
    if (isSelected) ring.setAttribute('filter', `url(#glow-${team})`);
    g.appendChild(ring);

    if (isSelected) {
      const inner = el('circle');
      inner.setAttribute('r', seatR - 4);
      inner.setAttribute('fill','none');
      inner.setAttribute('stroke', col.ring);
      inner.setAttribute('stroke-width','0.5');
      inner.setAttribute('stroke-opacity','0.2');
      g.appendChild(inner);
    }

    // SPIELERNAME IM SCHÖNEN BOGEN (Arc)
    const arcFontSize = Math.max(10, Math.min(16, seatR * 0.38));
    let dispName = (s.name || '').trim();
    if (dispName.length > 16) dispName = dispName.slice(0, 15) + '\u2026';
    const tArc = el('text');
    tArc.setAttribute('class', 'seatArcName');
    tArc.setAttribute('text-anchor', 'middle');
    tArc.setAttribute('style', 'font-size:' + arcFontSize + 'px; font-family:\'Cinzel\',serif; font-weight:700; fill:#c9a84c; paint-order:stroke; stroke:#000; stroke-width:3px; stroke-linejoin:round;');
    const tPath = el('textPath');
    tPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + arcId);
    tPath.setAttribute('startOffset', '50%');
    tPath.textContent = dispName;
    tArc.appendChild(tPath);
    g.appendChild(tArc);

    svg.appendChild(g);
  });

  if (typeof spyViewMode !== 'undefined' && spyViewMode &&
      typeof demonBluffRoleIds !== 'undefined' && demonBluffRoleIds.length && n > 0) {
    const labels = demonBluffRoleIds.map(function (id) {
      const R = typeof ROLES !== 'undefined' ? ROLES[id] : null;
      return R ? (R.name || R.n || String(id)) : String(id);
    }).join(' · ');
    const fo = el('foreignObject');
    fo.setAttribute('x', '8');
    fo.setAttribute('y', String(Math.max(8, H - 58)));
    fo.setAttribute('width', String(Math.max(100, W - 24)));
    fo.setAttribute('height', '52');
    const div = document.createElement('div');
    div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    div.style.cssText = 'font-size:11px;line-height:1.35;color:#e8d9b8;background:rgba(8,6,18,.88);padding:8px 10px;border-radius:8px;border:1px solid rgba(201,168,76,.4);font-family:system-ui,Segoe UI,sans-serif;';
    div.textContent = 'Dämon-Bluffs (ST): ' + labels;
    fo.appendChild(div);
    svg.appendChild(fo);
  }

  // ── Fabled tokens in center ──
  const fabledIds = (typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) ? activeFabledIds : [];
  if (fabledIds.length > 0) {
    const fabledG = el('g');
    fabledG.setAttribute('pointer-events', 'none');
    const fR = Math.max(16, Math.min(28, minDim * 0.042));
    const spacing = fR * 2.6;
    const startX = cx - (fabledIds.length * spacing - spacing) / 2;
    fabledIds.forEach(function(fid, i) {
      const fr = ROLES && ROLES[fid];
      if (!fr) return;
      const fname = (fr.name || fr.n || fid);
      const fabbr = fname.replace(/\s+/g,'').replace(/[aeiouäöüAEIOUÄÖÜ]/g,'').slice(0,3).toUpperCase() || fname.slice(0,3).toUpperCase();
      const fx = startX + i * spacing;
      const fy = cy;

      const bg = el('circle');
      bg.setAttribute('cx', fx); bg.setAttribute('cy', fy); bg.setAttribute('r', String(fR));
      bg.setAttribute('fill', 'rgba(138,172,204,.12)');
      bg.setAttribute('stroke', 'rgba(138,172,204,.5)');
      bg.setAttribute('stroke-width', '1.5');
      fabledG.appendChild(bg);

      const abbr = el('text');
      abbr.setAttribute('x', fx); abbr.setAttribute('y', String(fy + fR * 0.38));
      abbr.setAttribute('text-anchor', 'middle');
      abbr.setAttribute('fill', '#8aaccc');
      abbr.setAttribute('font-size', String(Math.max(7, fR * 0.46)));
      abbr.setAttribute('font-family', "'Cinzel',serif");
      abbr.setAttribute('font-weight', '700');
      abbr.textContent = fabbr;
      fabledG.appendChild(abbr);

      const sub = el('text');
      const shortName = fname.length > 10 ? fname.slice(0,9)+'…' : fname;
      sub.setAttribute('x', fx); sub.setAttribute('y', String(fy + fR + 12));
      sub.setAttribute('text-anchor', 'middle');
      sub.setAttribute('fill', 'rgba(138,172,204,.65)');
      sub.setAttribute('font-size', String(Math.max(6, fR * 0.36)));
      sub.setAttribute('font-family', "'Cinzel',serif");
      sub.textContent = shortName;
      fabledG.appendChild(sub);
    });
    svg.appendChild(fabledG);
  }

  const spyTop = document.getElementById('topBarSpyBtn');
  if (spyTop && typeof spyViewMode !== 'undefined') spyTop.classList.toggle('primary', spyViewMode);

  if (typeof window !== 'undefined' && typeof iconHref === 'function') {
    window.BOTC_iconHref = iconHref;
  }
}

function el(tag) { return document.createElementNS(SVG_NS, tag); }

function makeAbbr(name) {
  // smart abbreviation: keep consonants
  const noSpace = name.replace(/\s+/g,'');
  if (noSpace.length <= 5) return noSpace.toUpperCase();
  return noSpace.replace(/[aeiouäöüAEIOUÄÖÜ]/g,'').slice(0,5).toUpperCase() || noSpace.slice(0,4).toUpperCase();
}

// ═══════════════ INTERACTIONS ═══════════════
function onSeatClick(id, svgX, svgY, W, H) {
  if (tokenRevealMode) {
    showTokenReveal(id);
    return;
  }
  seatClickCount++;
  if (selectedId === id && popupId === id) {
    closePopup();
    selectedId = null;
  } else {
    selectedId = id;
    showPopup(id, svgX, svgY, W, H);
  }
  draw();
  renderSeatPanel();
}

function showTokenReveal(seatId) {
  const s = seats.find(x => x.id === seatId);
  if (!s) return;

  const existing = document.getElementById('tokenRevealOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'tokenRevealOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;

  const revealUrlsFn = (typeof roleImageUrlListForSeat === 'function')
    ? roleImageUrlListForSeat
    : roleImageUrlList;
  const urls = (typeof revealUrlsFn === 'function')
    ? revealUrlsFn(s.role || s.roleId)
    : (iconHref(s.role || s.roleId) ? [iconHref(s.role || s.roleId)] : []);
  const roleName = (s.role && ROLES[s.role]) ? (ROLES[s.role].name || ROLES[s.role].n) : '?';
  const ability = (s.role && ROLES[s.role]) ? (ROLES[s.role].ability || '') : '';

  const inner = document.createElement('div');
  inner.style.cssText = 'display:flex;flex-direction:column;align-items:center;max-height:90vh;overflow:auto;padding:16px;';
  inner.innerHTML = `
    <div style="font-size:22px; color:#c9a84c; font-family:var(--font-ui,Georgia,serif); margin-bottom:20px; opacity:0.7;">
      Sitz ${s.id}${s.name ? ' · ' + escHtml(s.name) : ''}
    </div>
    <div style="font-size:36px; color:#f7f5ff; font-family:var(--font-heading,Georgia,serif); font-weight:700; margin-bottom:16px;">
      ${escHtml(roleName)}
    </div>
    <div style="font-size:18px; color:#c9a84c; max-width:500px; text-align:center; line-height:1.5; padding:0 20px;">
      ${escHtml(ability)}
    </div>
    <div style="margin-top:40px; font-size:14px; color:rgba(255,255,255,0.4);">
      Tippen zum Schließen
    </div>
  `;
  if (urls.length) {
    const img = document.createElement('img');
    img.style.cssText = 'width:min(320px,70vw); height:min(320px,70vw); border-radius:50%; border:4px solid #c9a84c; object-fit:contain; background:#120f22; margin-bottom:24px;';
    let ix = 0;
    img.onerror = function () {
      ix++;
      if (ix < urls.length) img.src = urls[ix];
      else img.style.display = 'none';
    };
    img.src = urls[0];
    inner.insertBefore(img, inner.children[1] || null);
  }
  overlay.appendChild(inner);

  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
}

function startTokenRevealMode() {
  tokenRevealMode = true;
  showToast('Token-Reveal aktiv – jeden Sitz 1x antippen!', 3000);
  draw();
}

function stopTokenRevealMode() {
  tokenRevealMode = false;
  showToast('Token-Reveal beendet', 2000);
  draw();
}

function showPopup(id, svgX, svgY, W, H, abilityTextForStep) {
  const s = seats.find(x=>x.id===id);
  if (!s) return;
  popupId = id;

  const team = teamOf(s);
  const popup = document.getElementById('seatPopup');

  // set team class for stripe
  popup.className = popupId ? `open team-${team}` : '';
  popup.classList.add('open');
  popup.classList.add(`team-${team}`);

  // fill data
  document.getElementById('popupSeatNum').textContent = `Sitz ${s.id}`;
  document.getElementById('popupPlayerName').textContent = s.name || '—';
  document.getElementById('popupNameIn').value = s.name || '';

  // status
  document.getElementById('pillAlive').className = 'statusPill alive' + (s.alive?' on':'');
  document.getElementById('pillDead').className  = 'statusPill dead'  + (!s.alive?' on':'');
  refreshGhostVotePills(s);

  // role chip
  const rc = document.getElementById('roleChipEl');
  if (s.role && ROLES[s.role]) {
    const r = ROLES[s.role];
    rc.innerHTML = `<div class="roleChip ${team}"><div class="chipDot"></div>${r.name || r.n} <span style="opacity:.55;font-size:10px;">${r.type}</span></div>`;
  } else {
    rc.innerHTML = `<div class="roleChip none">Keine Rolle</div>`;
  }

  // role select (nur Script + Traveller; optional „alle Rollen“)
  const sel = document.getElementById('popupRoleSel');
  if (typeof populateRoleSelectElement === 'function') {
    populateRoleSelectElement(sel, s.role, getActiveScriptKey());
  }
  const cbOutside = document.getElementById('popupAllowOutsideRoles');
  if (cbOutside) cbOutside.checked = typeof botcAllowOutsideScriptRoles === 'function' ? botcAllowOutsideScriptRoles() : false;

  // markers & reminders
  renderMarkers(s);
  renderReminders(s);
  const claimEl = document.getElementById('popupClaim');
  if (claimEl) claimEl.value = s.claim || '';
  const notesEl = document.getElementById('popupNotes');
  if (notesEl) notesEl.value = s.notes || '';
  botcRefreshPopupStReference();

  // ability block (Assistent): show only when abilityTextForStep is provided
  const abWrap = document.getElementById('popupAbilityBlockWrap');
  const abEl = document.getElementById('popupAbilityBlock');
  if (abWrap && abEl) {
    if (abilityTextForStep) {
      abEl.textContent = abilityTextForStep;
      abWrap.style.display = '';
    } else {
      abWrap.style.display = 'none';
    }
  }

  // ⚡ Fähigkeit-Button: anzeigen wenn Rolle einen Ability-Handler hat
  const abilityBtn = document.getElementById('popupAbilityBtn');
  if (abilityBtn) {
    const roleKey = s.role || s.roleId;
    const hasAbility = roleKey && window.BOTC_ABILITIES && typeof window.BOTC_ABILITIES[roleKey] === 'function';
    abilityBtn.style.display = hasAbility ? '' : 'none';
    abilityBtn.title = hasAbility ? ('Fähigkeit ausführen: ' + (ROLES[roleKey] ? (ROLES[roleKey].name || roleKey) : roleKey)) : '';
  }

  // position near seat, stay in bounds
  positionPopup(svgX, svgY, W, H);
}

function positionPopup(svgX, svgY, W, H) {
  const popup = document.getElementById('seatPopup');
  const pw = 480;
  const panelW = panelOpen ? 300 : 0;
  const maxX = W - panelW - pw - 10;

  let px = svgX != null ? svgX - pw/2 : 80;
  let py = svgY != null ? svgY + 50 : 80;

  px = Math.max(8, Math.min(maxX, px));
  
  // Get actual popup height dynamically
  const actualH = popup.offsetHeight || 500;
  py = Math.max(80, Math.min(H - actualH - 20, py));

  popup.style.left = px + 'px';
  popup.style.top  = py + 'px';
}

function closePopup() {
  document.getElementById('seatPopup').className = '';
  popupId = null;
}

function triggerPopupAbility() {
  const s = seats.find(x => x.id === popupId);
  if (!s) return;
  const roleKey = s.role || s.roleId;
  if (!roleKey || !window.BOTC_ABILITIES || typeof window.BOTC_ABILITIES[roleKey] !== 'function') {
    if (typeof showToast === 'function') showToast('Keine Fähigkeit für diese Rolle.', 2000);
    return;
  }
  try {
    const ctx = window.BOTC_buildCtx ? window.BOTC_buildCtx(s.id) : null;
    if (ctx) window.BOTC_ABILITIES[roleKey](ctx);
  } catch(e) {
    console.warn('[ABILITY]', roleKey, e);
  }
}
window.triggerPopupAbility = triggerPopupAbility;

function botcRefreshPopupStReference() {
  const s = seats.find(x => x.id === popupId);
  const stWrap = document.getElementById('popupStReminderWrap');
  const stBody = document.getElementById('popupStReminderBody');
  if (!stWrap || !stBody) return;
  if (!s || !s.role || typeof ROLES === 'undefined' || !ROLES[s.role]) {
    stBody.innerHTML = '';
    stWrap.style.display = 'none';
    return;
  }
  const r = ROLES[s.role];
  const fn = r.firstNightReminder && String(r.firstNightReminder).trim();
  const on = r.otherNightReminder && String(r.otherNightReminder).trim();
  const ab = r.reminder != null && String(r.reminder).trim();
  let html = '';
  if (fn) html += '<div><strong>1. Nacht (ST):</strong> ' + escHtml(fn) + '</div>';
  if (on) html += '<div style="margin-top:6px;"><strong>Weitere Nächte:</strong> ' + escHtml(on) + '</div>';
  if (ab) html += '<div style="margin-top:6px;"><em>Offiz. Reminder-Text:</em> ' + escHtml(ab) + '</div>';
  if (html) {
    stBody.innerHTML = html;
    stWrap.style.display = '';
  } else {
    stBody.innerHTML = '';
    stWrap.style.display = 'none';
  }
}

function onClaimChange() {
  const s = seats.find(x => x.id === popupId); if (!s) return;
  const el = document.getElementById('popupClaim');
  s.claim = el && el.value != null ? String(el.value) : '';
  draw();
  renderPanel();
  scheduleSave();
}

function renderMarkers(s) {
  const el2 = document.getElementById('markerCloud');
  el2.innerHTML = MARKERS.map(m =>
    `<div class="markerChip${s.markers.includes(m)?' on m-'+m:''}" onclick="toggleMarker('${m}')">${m}</div>`
  ).join('');
}

function getReminderListForSeat(s) {
  const roleList = (s.role && REMINDERS[s.role]) ? REMINDERS[s.role] : [];
  return [...REMINDER_ALWAYS, ...roleList];
}

function renderReminders(s) {
  const el2 = document.getElementById('reminderCloud');
  if (!el2) return;
  const list = getReminderListForSeat(s);
  const active = new Set(s.reminder || []);
  const escAttr = v => String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  el2.innerHTML = list.map(r =>
    `<div class="reminderChip${active.has(r)?' on':''}" data-reminder="${escAttr(r)}" onclick="toggleReminder(this)">${r}</div>`
  ).join('');
}

function toggleReminder(el) {
  const token = el && el.getAttribute ? el.getAttribute('data-reminder') : null;
  if (token == null) return;
  const s = seats.find(x => x.id === popupId); if (!s) return;
  const arr = s.reminder || [];
  const i = arr.indexOf(token);
  if (i === -1) arr.push(token); else arr.splice(i, 1);
  s.reminder = arr;
  renderReminders(s); draw();
  renderPanel();
  scheduleSave();
}

function onNotesChange() {
  const s = seats.find(x => x.id === popupId); if (!s) return;
  s.notes = document.getElementById('popupNotes').value || '';
  draw();
  renderPanel();
  scheduleSave();
}

function onNameChange() {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  s.name = document.getElementById('popupNameIn').value;
  document.getElementById('popupPlayerName').textContent = s.name||'—';
  draw(); renderStats();
  scheduleSave();
}

function setAlive(v) {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  s.alive = v;
  document.getElementById('pillAlive').className = 'statusPill alive'+(v?' on':'');
  document.getElementById('pillDead').className  = 'statusPill dead' +(!v?' on':'');
  if (v) {
    // Reviving: clear executed flag if this was the executed player
    if (window.BOTC_executedSeatId === popupId) {
      window.BOTC_executedSeatId = null;
      window.BOTC_executedToday = false;
    }
  }
  draw(); renderStats(); buildNightOrder(); renderNightOrder();
  scheduleSave();
}

// Ghost vote: toggle used state for a dead player
function setGhostVote(used) {
  const s = seats.find(x => x.id === popupId);
  if (!s) return;
  s.ghostVoteUsed = !!used;
  refreshGhostVotePills(s);
  draw();
  scheduleSave();
  if (typeof renderGrimoireList === 'function') renderGrimoireList();
}
window.setGhostVote = setGhostVote;

function refreshGhostVotePills(s) {
  const field = document.getElementById('ghostVoteField');
  const avail = document.getElementById('pillGhostAvail');
  const used  = document.getElementById('pillGhostUsed');
  if (!field) return;
  // Only show for dead players
  if (!s || s.alive !== false) { field.style.display = 'none'; return; }
  field.style.display = '';
  const isUsed = !!s.ghostVoteUsed;
  if (avail) {
    avail.className = 'statusPill' + (!isUsed ? ' on' : '');
    avail.style.opacity = isUsed ? '0.45' : '1';
    avail.style.textDecoration = '';
  }
  if (used) {
    used.className = 'statusPill' + (isUsed ? ' on' : '');
    used.style.opacity = isUsed ? '1' : '0.45';
    used.style.textDecoration = isUsed ? 'line-through' : '';
    if (isUsed) used.style.borderColor = 'rgba(255,100,100,.5)';
    else used.style.borderColor = 'rgba(255,255,255,.15)';
  }
}

// Mark a player as executed (killed by vote during day) – triggers Undertaker tonight
function markExecuted() {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  s.alive = false;
  if (!s.markers) s.markers = [];
  if (s.markers.indexOf('Hingerichtet') === -1) s.markers.push('Hingerichtet');
  window.BOTC_executedToday = true;
  window.BOTC_executedSeatId = s.id;
  document.getElementById('pillAlive').className = 'statusPill alive';
  document.getElementById('pillDead').className  = 'statusPill dead on';
  if (typeof window.botcStoryLogAppend === 'function') {
    window.botcStoryLogAppend((s.name || 'Sitz ' + s.id) + ' wurde hingerichtet');
  }
  draw(); renderStats(); buildNightOrder(); renderNightOrder();
  if (typeof showToast === 'function') showToast('⚔ ' + (s.name || 'Sitz ' + s.id) + ' hingerichtet – Totenbestatter aktiv', 3000);
  scheduleSave();
}
window.markExecuted = markExecuted;

function triggerLynch() {
  if (typeof window.beginPick !== 'function') return;
  window.beginPick({
    title: '⚔ Hinrichten – Wähle Spieler',
    count: 1,
    filterFn: function(s) { return s.alive !== false; },
    onDone: function(selected) {
      if (!selected || !selected[0]) return;
      var s = selected[0];
      s.alive = false;
      if (!s.markers) s.markers = [];
      if (s.markers.indexOf('Hingerichtet') === -1) s.markers.push('Hingerichtet');
      window.BOTC_executedToday = true;
      window.BOTC_executedSeatId = s.id;
      var pa = document.getElementById('pillAlive');
      var pd = document.getElementById('pillDead');
      if (pa) pa.className = 'statusPill alive';
      if (pd) pd.className = 'statusPill dead on';
      if (typeof window.botcStoryLogAppend === 'function') {
        window.botcStoryLogAppend((s.name || 'Sitz ' + s.id) + ' wurde hingerichtet');
      }
      draw(); renderStats(); buildNightOrder(); renderNightOrder();
      if (typeof showToast === 'function') showToast('⚔ ' + (s.name || 'Sitz ' + s.id) + ' hingerichtet – Totenbestatter aktiv', 3500);
      scheduleSave();

      // ——— Rollen-spezifische Hinrichtungs-Trigger ———
      var execRole = (s.role || s.roleId || '').toLowerCase().replace(/_/g, '');
      var execRoleData = (typeof ROLES !== 'undefined' && (s.role || s.roleId)) ? ROLES[s.role || s.roleId] : null;

      // Scharlachrote Frau: wenn Dämon hingerichtet wird
      if (typeof window.BOTC_checkScarletWomanTrigger === 'function') {
        window.BOTC_checkScarletWomanTrigger(s.id);
      }

      // Heilige: wenn sie hingerichtet wird, gewinnt Evil sofort
      if (execRole === 'saint') {
        if (typeof window.openOverlay === 'function') {
          window.openOverlay('⚠ Heilige hingerichtet!', 'Evil gewinnt sofort!');
        }
      }

      // Minnesänger: wenn Minion hingerichtet wird → alle Townsfolk drunk bis Dusk
      var execIsMinion = execRoleData && String(execRoleData.type || '').toLowerCase() === 'minion';
      if (execIsMinion) {
        var minstrelSeat = seats.find(function(ms) {
          return (ms.role || ms.roleId || '').toLowerCase() === 'minstrel' && ms.alive !== false;
        });
        if (minstrelSeat) {
          if (typeof showToast === 'function') showToast('⚠ Minnesänger aktiv: Alle Townsfolk sind drunk bis Dusk!', 5000);
        }
      }
    }
  });
}
window.triggerLynch = triggerLynch;

function onRoleChange() {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  s.role = document.getElementById('popupRoleSel').value || null;
  // update chip
  const rc = document.getElementById('roleChipEl');
  const team = teamOf(s);
  if (s.role && ROLES[s.role]) {
    const r = ROLES[s.role];
    rc.innerHTML = `<div class="roleChip ${team}"><div class="chipDot"></div>${r.name || r.n} <span style="opacity:.55;font-size:10px;">${r.type}</span></div>`;
  } else {
    rc.innerHTML = `<div class="roleChip none">Keine Rolle</div>`;
  }
  // update popup stripe
  const popup = document.getElementById('seatPopup');
  popup.className = `open team-${team}`;
  botcRefreshPopupStReference();
  draw(); buildNightOrder(); renderPanel();
  scheduleSave();
}

function toggleMarker(m) {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  const i = s.markers.indexOf(m);
  if (i===-1) s.markers.push(m); else s.markers.splice(i,1);
  renderMarkers(s); draw();
  renderPanel();
  scheduleSave();
}

function clearCurrentSeat() {
  const s = seats.find(x=>x.id===popupId); if(!s) return;
  s.name=''; s.role=null; s.alive=true; s.markers=[]; s.notes=''; s.claim=''; s.reminder=[];
  closePopup(); selectedId=null;
  draw(); renderPanel(); buildNightOrder(); renderNightOrder();
  scheduleSave();
}

// ═══════════════ ABILITY TOOLTIP ═══════════════
function showAbilityTooltip(s, x, y, W, H) {
  if (!s.role || !ROLES[s.role]) return;
  const r = ROLES[s.role];
  document.getElementById('ttRoleName').textContent = r.n;
  document.getElementById('ttAbility').textContent = r.ability || '';
  const tt = document.getElementById('abilityTooltip');
  const panelW = panelOpen ? 300 : 0;
  let tx = x + 50, ty = y - 20;
  tx = Math.max(8, Math.min(W - panelW - 230, tx));
  ty = Math.max(70, Math.min(H - 120, ty));
  tt.style.left = tx+'px'; tt.style.top = ty+'px';
  tt.classList.add('show');
}
function hideAbilityTooltip() {
  document.getElementById('abilityTooltip').classList.remove('show');
}

// ═══════════════ PANEL ═══════════════
let panelTab = 'night';
function setPanelTab(tab) {
  panelTab = tab;
  const nightBlock = document.getElementById('panelNightBlock');
  const grimoireBlock = document.getElementById('panelGrimoireBlock');
  const jinxBlock = document.getElementById('panelJinxBlock');
  const fabledBlock = document.getElementById('panelFabledBlock');
  const journalBlock = document.getElementById('panelJournalBlock');
  const kernBlock = document.getElementById('panelKernBlock');
  const limitsBlock = document.getElementById('panelLimitsBlock');
  const markersBlock = document.getElementById('panelMarkersBlock');
  const townBlock = document.getElementById('panelTownBlock');
  const bluffsBlock = document.getElementById('panelBluffsBlock');
  const nominationBlock = document.getElementById('panelNominationBlock');
  const nightTab = document.getElementById('panelTabNight');
  const grimoireTab = document.getElementById('panelTabGrimoire');
  const jinxTab = document.getElementById('panelTabJinx');
  const fabledTab = document.getElementById('panelTabFabled');
  const journalTab = document.getElementById('panelTabJournal');
  const kernTab = document.getElementById('panelTabKern');
  const limitsTab = document.getElementById('panelTabLimits');
  const markersTab = document.getElementById('panelTabMarkers');
  const townTab = document.getElementById('panelTabTown');
  const bluffsTab = document.getElementById('panelTabBluffs');
  const nominationTab = document.getElementById('panelTabNomination');
  const showNight = tab === 'night';
  const showGrimoire = tab === 'grimoire';
  const showJinx = tab === 'jinxes';
  const showFabled = tab === 'fabled';
  const showJournal = tab === 'journal';
  const showKern = tab === 'kern';
  const showLimits = tab === 'limits';
  const showMarkers = tab === 'markers';
  const showTown = tab === 'town';
  const showBluffs = tab === 'bluffs';
  const showNomination = tab === 'nomination';
  if (nightBlock) nightBlock.style.display = showNight ? '' : 'none';
  if (grimoireBlock) grimoireBlock.style.display = showGrimoire ? 'block' : 'none';
  if (jinxBlock) jinxBlock.style.display = showJinx ? 'block' : 'none';
  if (fabledBlock) fabledBlock.style.display = showFabled ? 'block' : 'none';
  if (journalBlock) journalBlock.style.display = showJournal ? 'block' : 'none';
  if (kernBlock) kernBlock.style.display = showKern ? 'block' : 'none';
  if (limitsBlock) limitsBlock.style.display = showLimits ? 'block' : 'none';
  if (markersBlock) markersBlock.style.display = showMarkers ? 'block' : 'none';
  if (townBlock) townBlock.style.display = showTown ? 'block' : 'none';
  if (bluffsBlock) bluffsBlock.style.display = showBluffs ? 'block' : 'none';
  if (nominationBlock) nominationBlock.style.display = showNomination ? 'block' : 'none';
  if (nightTab) {
    nightTab.classList.toggle('on', showNight);
    nightTab.setAttribute('aria-selected', showNight ? 'true' : 'false');
  }
  if (grimoireTab) {
    grimoireTab.classList.toggle('on', showGrimoire);
    grimoireTab.setAttribute('aria-selected', showGrimoire ? 'true' : 'false');
  }
  if (jinxTab) {
    jinxTab.classList.toggle('on', showJinx);
    jinxTab.setAttribute('aria-selected', showJinx ? 'true' : 'false');
  }
  if (fabledTab) {
    fabledTab.classList.toggle('on', showFabled);
    fabledTab.setAttribute('aria-selected', showFabled ? 'true' : 'false');
  }
  if (journalTab) {
    journalTab.classList.toggle('on', showJournal);
    journalTab.setAttribute('aria-selected', showJournal ? 'true' : 'false');
  }
  if (kernTab) {
    kernTab.classList.toggle('on', showKern);
    kernTab.setAttribute('aria-selected', showKern ? 'true' : 'false');
  }
  if (limitsTab) {
    limitsTab.classList.toggle('on', showLimits);
    limitsTab.setAttribute('aria-selected', showLimits ? 'true' : 'false');
  }
  if (markersTab) {
    markersTab.classList.toggle('on', showMarkers);
    markersTab.setAttribute('aria-selected', showMarkers ? 'true' : 'false');
  }
  if (townTab) {
    townTab.classList.toggle('on', showTown);
    townTab.setAttribute('aria-selected', showTown ? 'true' : 'false');
  }
  if (bluffsTab) {
    bluffsTab.classList.toggle('on', showBluffs);
    bluffsTab.setAttribute('aria-selected', showBluffs ? 'true' : 'false');
  }
  if (nominationTab) {
    nominationTab.classList.toggle('on', showNomination);
    nominationTab.setAttribute('aria-selected', showNomination ? 'true' : 'false');
  }
  if (showGrimoire) renderGrimoireList();
  if (showJinx) renderJinxPanel();
  if (showFabled) renderFabledPanel();
  if (showJournal) renderJournalPanel();
  if (showKern) renderKernPanel();
  if (showLimits) renderLimitsPanel();
  if (showMarkers) renderMarkersPanel();
  if (showTown) renderTownPanel();
  if (showBluffs) renderBluffsPanel();
  if (showNomination) renderNominationPanel();
}
function renderFabledPanel() {
  const el = document.getElementById('fabledPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ids = typeof getAllFabledRoleIds === 'function' ? getAllFabledRoleIds() : [];
  const chosen = new Set((typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) ? activeFabledIds : []);
  let rows = '';
  ids.forEach(id => {
    const r = ROLES[id];
    if (!r) return;
    const name = typeof roleDisplayLabel === 'function' ? roleDisplayLabel(id) : id;
    const ab = (r.ability != null && String(r.ability).trim()) ? esc(String(r.ability).trim()) : '';
    const remRaw = (r.reminder != null && String(r.reminder).trim())
      ? String(r.reminder).trim()
      : (r.firstNightReminder != null && String(r.firstNightReminder).trim() ? String(r.firstNightReminder).trim() : '');
    const rem = remRaw ? esc(remRaw) : '';
    const on = chosen.has(id) ? ' checked' : '';
    rows += `<div style="margin-bottom:12px;padding:10px 12px;background:rgba(138,172,204,.07);border:1px solid var(--card-border);border-radius:10px;">
      <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;">
        <input type="checkbox" data-fabled-id="${esc(id)}"${on} style="margin-top:3px;flex-shrink:0;">
        <span style="font-weight:600;font-size:13px;color:var(--silver);">${esc(name)}</span>
      </label>
      ${ab ? `<div style="font-size:11px;color:var(--text-dim);margin:8px 0 0 28px;line-height:1.45;">${ab}</div>` : ''}
      ${rem ? `<div style="font-size:11px;color:var(--gold);opacity:.85;margin:6px 0 0 28px;line-height:1.4;"><em>ST:</em> ${rem}</div>` : ''}
    </div>`;
  });
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:4px;">Fabled im Spiel</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 12px 0;">Nur für den Storyteller — erscheinen nicht als Sitzrollen. Auswahl wird mit Speichern/Export übernommen.</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">' +
    '<button type="button" class="btn" style="font-size:11px;padding:6px 12px;opacity:.9;" onclick="clearAllFabledInPlay()">Alle abwählen</button></div>' +
    '<div style="max-height:min(52vh,420px);overflow:auto;padding-right:4px;">' + rows + '</div>';
  el.querySelectorAll('input[type="checkbox"][data-fabled-id]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.getAttribute('data-fabled-id');
      let next = (typeof activeFabledIds !== 'undefined' && Array.isArray(activeFabledIds)) ? activeFabledIds.slice() : [];
      if (cb.checked) {
        if (next.indexOf(id) === -1) next.push(id);
      } else {
        next = next.filter(x => x !== id);
      }
      if (typeof setActiveFabledIdsFromArray === 'function') setActiveFabledIdsFromArray(next);
      if (typeof scheduleSave === 'function') scheduleSave();
    });
  });
}
function clearAllFabledInPlay() {
  if (typeof setActiveFabledIdsFromArray === 'function') setActiveFabledIdsFromArray([]);
  if (typeof scheduleSave === 'function') scheduleSave();
  if (typeof renderFabledPanel === 'function') renderFabledPanel();
}
function renderJinxPanel() {
  const el = document.getElementById('jinxPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const jinxes = typeof getApplicableJinxesForCurrentSeats === 'function' ? getApplicableJinxesForCurrentSeats() : [];
  let jinxHtml = '';
  if (!jinxes.length) {
    jinxHtml = '<div class="jinxEmpty" style="font-size:12px;color:var(--text-faint);font-style:italic;padding:8px 0;">Keine Jinxes zwischen den zugewiesenen Rollen — oder weniger als zwei relevante Charaktere am Tisch.</div>';
  } else {
    jinxHtml = jinxes.map(item => {
      const la = typeof roleDisplayLabel === 'function' ? roleDisplayLabel(item.roleA) : item.roleA;
      const lb = typeof roleDisplayLabel === 'function' ? roleDisplayLabel(item.roleB) : item.roleB;
      const reasons = (item.reasons || []).map(r =>
        `<div style="font-size:12px;color:var(--text-dim);margin-top:6px;line-height:1.45;">${esc(r)}</div>`
      ).join('');
      return `<div style="margin-bottom:14px;padding:10px 12px;background:rgba(201,168,76,.08);border:1px solid var(--card-border);border-radius:10px;">
        <div style="font-size:13px;font-weight:600;color:var(--gold);">${esc(la)} · ${esc(lb)}</div>
        ${reasons}
      </div>`;
    }).join('');
  }
  const store = typeof getStorytellerManualCheckStorage === 'function' ? getStorytellerManualCheckStorage() : {};
  const checks = typeof STORYTELLER_MANUAL_CHECKS !== 'undefined' ? STORYTELLER_MANUAL_CHECKS : [];
  const checksHtml = checks.map(c => {
    const on = store[c.id] ? ' checked' : '';
    return `<label style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:13px;cursor:pointer;line-height:1.35;">
      <input type="checkbox" data-st-check="${esc(c.id)}"${on} style="margin-top:3px;flex-shrink:0;">
      <span>${esc(c.label)}</span>
    </label>`;
  }).join('');
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:4px;">Aktive Jinxes</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Nur wenn <em>beide</em> Rollen einem Sitz zugewiesen sind. Kurztexte der Digitalen Script-Hilfe (Englisch).</p>' +
    '<div>' + jinxHtml + '</div>' +
    '<div class="panelSectionTitle" style="margin-top:18px;">Leiter-Checkliste</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Haken werden lokal in diesem Browser gespeichert.</p>' +
    '<div>' + checksHtml + '</div>';
  el.querySelectorAll('input[type="checkbox"][data-st-check]').forEach(cb => {
    cb.addEventListener('change', () => {
      if (typeof setStorytellerManualCheck === 'function') {
        setStorytellerManualCheck(cb.getAttribute('data-st-check'), cb.checked);
      }
    });
  });
}
function renderJournalPanel() {
  const el = document.getElementById('journalPanelEl');
  if (!el) return;
  if (!window.BOTC || !window.BOTC.StoryLog) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-faint);">Protokoll nicht geladen.</p>';
    return;
  }
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const items = window.BOTC.StoryLog.getEntries().slice().reverse().slice(0, 100);
  const listHtml = items.length ? items.map(e => {
    const line = String(e.text || '').trim();
    const n = e.night != null ? ('N' + e.night) : '—';
    const ts = (e.ts || '').slice(0, 19).replace('T', ' ');
    return '<div style="font-size:11px;line-height:1.4;padding:7px 9px;margin-bottom:6px;background:rgba(138,172,204,.07);border:1px solid var(--card-border);border-radius:8px;">' +
      '<span style="opacity:.55;font-size:10px;">' + esc(ts) + ' · ' + esc(n) + '</span>' +
      '<div style="margin-top:4px;color:var(--text);">' + esc(line) + '</div></div>';
  }).join('') : '<div style="font-size:12px;color:var(--text-faint);font-style:italic;padding:8px 0;">Noch keine Einträge.</div>';
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:2px;">Leiter-Protokoll</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Phase J — Gespeichert mit Spielstand und Export. Tag/Nacht per ☀/🌙 sowie „Neue Nacht“ werden protokolliert.</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px;">' +
    '<button type="button" class="btn" style="font-size:11px;padding:6px 12px;" onclick="botcJournalCopyAll()">Als Text kopieren</button>' +
    '<button type="button" class="btn" style="font-size:11px;padding:6px 12px;opacity:.85;" onclick="botcJournalClearAll()">Leeren</button>' +
    '<button type="button" class="btn" style="font-size:10px;padding:6px 10px;" onclick="botcJournalDayLine(\'nom\')">+ Nomination</button>' +
    '<button type="button" class="btn" style="font-size:10px;padding:6px 10px;" onclick="botcJournalDayLine(\'exe\')">+ Hinrichtung</button></div>' +
    '<textarea id="journalManualInput" rows="2" placeholder="Eigene Notiz …" style="width:100%;resize:vertical;font-size:12px;padding:8px;border-radius:8px;border:1px solid var(--card-border);background:rgba(8,6,18,.5);color:var(--text);margin-bottom:8px;box-sizing:border-box;"></textarea>' +
    '<button type="button" class="btn primary" style="font-size:12px;padding:8px 14px;margin-bottom:10px;width:100%;" onclick="botcJournalSubmitNote()">Notiz hinzufügen</button>' +
    '<div style="max-height:min(48vh,380px);overflow:auto;padding-right:4px;">' + listHtml + '</div>';
}
function botcJournalDayLine(kind) {
  const msg = kind === 'exe'
    ? 'Tag: Hinrichtung (Protokoll)'
    : 'Tag: Nomination / Abstimmung (Protokoll)';
  if (typeof window.botcStoryLogAppend === 'function') window.botcStoryLogAppend(msg);
  renderJournalPanel();
}
window.botcJournalDayLine = botcJournalDayLine;

function botcJournalSubmitNote() {
  const inp = document.getElementById('journalManualInput');
  const v = inp && inp.value ? String(inp.value).trim() : '';
  if (!v) return;
  if (typeof window.botcStoryLogAppend === 'function') window.botcStoryLogAppend(v);
  if (inp) inp.value = '';
  renderJournalPanel();
}
function botcJournalCopyAll() {
  if (!window.BOTC || !window.BOTC.StoryLog) return;
  const t = window.BOTC.StoryLog.toPlainText();
  if (!t) {
    if (typeof showToast === 'function') showToast('Protokoll ist leer', 2000);
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(function () {
      if (typeof showToast === 'function') showToast('Protokoll kopiert', 2000);
    }).catch(function () { botcJournalFallbackCopy(t); });
  } else botcJournalFallbackCopy(t);
}
function botcJournalFallbackCopy(t) {
  try {
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    if (typeof showToast === 'function') showToast('Protokoll kopiert', 2000);
  } catch (_) {}
}
function botcJournalClearAll() {
  if (!confirm('Gesamtes Protokoll löschen?')) return;
  if (window.BOTC && window.BOTC.StoryLog) window.BOTC.StoryLog.clear();
  renderJournalPanel();
}
window.renderJournalPanel = renderJournalPanel;
window.botcJournalSubmitNote = botcJournalSubmitNote;
window.botcJournalCopyAll = botcJournalCopyAll;
window.botcJournalClearAll = botcJournalClearAll;

function renderKernPanel() {
  const el = document.getElementById('kernPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const counts = {};
  (typeof seats !== 'undefined' && Array.isArray(seats) ? seats : []).forEach(function (s) {
    const id = s && (s.role || s.roleId);
    if (!id) return;
    counts[id] = (counts[id] || 0) + 1;
  });
  const roleIds = Object.keys(counts);
  roleIds.sort(function (a, b) {
    const la = typeof roleDisplayLabel === 'function' ? String(roleDisplayLabel(a)).toLowerCase() : a;
    const lb = typeof roleDisplayLabel === 'function' ? String(roleDisplayLabel(b)).toLowerCase() : b;
    if (la < lb) return -1;
    if (la > lb) return 1;
    return 0;
  });
  let rows = '';
  if (!roleIds.length) {
    rows = '<div style="font-size:12px;color:var(--text-faint);font-style:italic;padding:8px 0;">Noch keine Rollen auf den Sitzen.</div>';
  } else {
    roleIds.forEach(function (id) {
      const r = typeof ROLES !== 'undefined' ? ROLES[id] : null;
      const name = typeof roleDisplayLabel === 'function' ? roleDisplayLabel(id) : id;
      const team = typeof teamOf === 'function' ? teamOf({ role: id, alive: true }) : 'unknown';
      const typ = r && r.type ? String(r.type) : '—';
      const cnt = counts[id];
      const suffix = cnt > 1 ? ' ×' + cnt : '';
      const abRaw = r && r.ability != null ? String(r.ability).trim() : '';
      const ab = abRaw.length > 160 ? abRaw.slice(0, 157) + '…' : abRaw;
      rows += '<div class="kernRoleRow team-' + esc(team) + '" style="margin-bottom:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--card-border);background:rgba(138,172,204,.06);">' +
        '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
        '<span style="font-weight:700;font-size:13px;color:var(--silver);">' + esc(name) + esc(suffix) + '</span>' +
        '<span style="font-size:10px;opacity:.75;text-transform:uppercase;letter-spacing:.04em;">' + esc(typ) + '</span></div>' +
        (ab ? '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;line-height:1.45;">' + esc(ab) + '</div>' : '') +
        '</div>';
    });
  }
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:2px;">Rollenkern am Tisch</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 12px 0;">Phase K — Alle <em>eindeutigen</em> Sitz-Rollen mit Kurztext (Anzeige: gleiche Rolle mehrfach als ×n). Kein Ersatz für Script Tool oder Regelwerk.</p>' +
    '<div style="max-height:min(52vh,440px);overflow:auto;padding-right:4px;">' + rows + '</div>';
}
window.renderKernPanel = renderKernPanel;

function renderLimitsPanel() {
  const el = document.getElementById('limitsPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const n = Array.isArray(seats) ? seats.length : 0;
  const lim = typeof botcTokenTableLimitsForPlayerCount === 'function' ? botcTokenTableLimitsForPlayerCount(n) : null;
  const cnt = typeof botcCountGrimoireByTokenSlot === 'function' ? botcCountGrimoireByTokenSlot() : { townsfolk: 0, outsider: 0, minion: 0, demon: 0, traveler: 0, unset: 0 };
  const sk = typeof getActiveScriptKey === 'function' ? getActiveScriptKey() : '';
  const scriptName = typeof SCRIPT_LABELS !== 'undefined' && SCRIPT_LABELS[sk] ? SCRIPT_LABELS[sk] : sk;
  const keys = [
    { k: 'townsfolk', label: 'Townsfolk', short: 'T' },
    { k: 'outsider', label: 'Outsider', short: 'O' },
    { k: 'minion', label: 'Minions', short: 'M' },
    { k: 'demon', label: 'Dämonen', short: 'D' }
  ];
  let rows = '';
  let allMatch = !!lim;
  keys.forEach(function (def) {
    const key = def.k;
    const ist = typeof cnt[key] === 'number' ? cnt[key] : 0;
    const soll = lim ? lim[key] : '—';
    const match = lim && ist === lim[key];
    if (lim && !match) allMatch = false;
    const rowStyle = match || !lim ? '' : 'background:rgba(201,168,76,.12);';
    rows += '<tr style="' + rowStyle + '">' +
      '<td style="padding:8px 10px;font-size:12px;">' + esc(def.label) + '</td>' +
      '<td style="padding:8px 10px;text-align:center;font-variant-numeric:tabular-nums;">' + (lim != null ? esc(String(lim[key])) : '—') + '</td>' +
      '<td style="padding:8px 10px;text-align:center;font-weight:600;font-variant-numeric:tabular-nums;">' + esc(String(ist)) + '</td>' +
      '<td style="padding:8px 10px;text-align:center;">' + (!lim ? '—' : (match ? '<span style="color:var(--sea-hi,#40b882);">✓</span>' : '<span style="color:var(--gold);">≠</span>')) + '</td></tr>';
  });
  let status = '';
  if (!lim) {
    status = '<div style="margin:12px 0;padding:10px;border-radius:8px;border:1px solid var(--card-border);font-size:12px;color:var(--text-dim);">Spielerzahl <strong>' + esc(String(n)) + '</strong> liegt außerhalb <strong>5–15</strong> — hier gibt es keine eingebaute Standard-Token-Tabelle. Zählung rechts zeigt trotzdem das Grimoire.</div>';
  } else if (cnt.unset > 0) {
    status += '<div style="margin:10px 0;padding:10px;border-radius:8px;background:rgba(201,168,76,.1);font-size:12px;color:var(--gold);">⚠ <strong>' + cnt.unset + '</strong> Sitz(e) ohne erkannte Rolle — Abgleich unvollständig.</div>';
    allMatch = false;
  }
  if (lim && allMatch && cnt.unset === 0) {
    status += '<div style="margin:10px 0;padding:10px;border-radius:8px;background:rgba(64,184,130,.12);font-size:12px;color:var(--sea-hi,#40b882);">✓ T / O / M / D stimmen mit der <strong>offiziellen Token-Tabelle</strong> für <strong>' + n + ' Spieler</strong> überein.</div>';
  } else if (lim && (!allMatch || cnt.unset > 0)) {
    status += '<div style="margin:10px 0;padding:10px;border-radius:8px;background:rgba(212,64,64,.1);font-size:12px;color:var(--evil-hi);">Abweichung von der Standard-Tabelle — ok bei <strong>Custom</strong>, Sonderregeln (Baron, Traveller, …) oder unfertigem Grimoire.</div>';
  }
  let extra = '<div style="margin-top:12px;font-size:11px;color:var(--text-faint);line-height:1.45;">';
  extra += 'Script: <strong>' + esc(scriptName) + '</strong>. Traveller auf Sitzen: <strong>' + esc(String(cnt.traveler)) + '</strong> (nicht in Tabelle-Spalten).';
  extra += '</div>';
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:2px;">Token-Tabelle vs. Grimoire</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Phase L — Soll (Druck-Scripts 5–15) und Ist (Zählung nach <code style="font-size:10px;">ROLES.type</code> auf den Sitzen).</p>' +
    status +
    '<table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:8px;"><thead><tr style="border-bottom:1px solid var(--card-border);">' +
    '<th style="text-align:left;padding:6px 10px;">Kategorie</th><th style="padding:6px;">Soll</th><th style="padding:6px;">Ist</th><th style="padding:6px;"></th></tr></thead><tbody>' + rows + '</tbody></table>' +
    extra;
}
window.renderLimitsPanel = renderLimitsPanel;

function renderMarkersPanel() {
  const el = document.getElementById('markersPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const list = Array.isArray(seats) ? seats : [];
  let activeCount = 0;
  let rows = '';
  list.forEach(function (s) {
    if (!s) return;
    const markers = Array.isArray(s.markers) ? s.markers.filter(Boolean) : [];
    const reminders = Array.isArray(s.reminder) ? s.reminder.filter(Boolean) : [];
    const noteRaw = s.notes != null ? String(s.notes).trim() : '';
    if (!markers.length && !reminders.length && !noteRaw) return;
    activeCount++;
    const team = typeof teamOf === 'function' ? teamOf(s) : 'unknown';
    const roleName = (s.role && typeof ROLES !== 'undefined' && ROLES[s.role]) ? (ROLES[s.role].name || ROLES[s.role].n || s.role) : '—';
    const nameDisp = s.name && String(s.name).trim() ? esc(s.name) : ('Sitz ' + esc(String(s.id)));
    const life = s.alive === false ? ' · tot <span style="opacity:.75;">(ST)</span>' : '';
    const markerHtml = markers.length ? markers.map(function (m) {
      return '<span style="display:inline-block;margin:2px 4px 2px 0;padding:2px 8px;border-radius:6px;font-size:10px;background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.35);color:var(--gold);">' + esc(m) + '</span>';
    }).join('') : '';
    const remHtml = reminders.length ? reminders.map(function (r) {
      return '<span class="gReminderChip" style="margin:2px 4px 2px 0;">' + esc(r) + '</span>';
    }).join('') : '';
    const noteHtml = noteRaw ? '<div style="font-size:11px;color:var(--text-dim);margin-top:8px;line-height:1.45;font-style:italic;">' + esc(noteRaw.length > 200 ? noteRaw.slice(0, 197) + '…' : noteRaw) + '</div>' : '';
    rows += '<div class="markersSeatRow team-' + esc(team) + '" data-seat-id="' + esc(String(s.id)) + '" style="margin-bottom:10px;padding:10px 12px;border-radius:10px;border:1px solid var(--card-border);background:rgba(138,172,204,.06);cursor:pointer;" onclick="openPopupFromGrimoire(' + s.id + ')">' +
      '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;">' +
      '<span style="font-weight:700;font-size:12px;color:var(--silver);">' + nameDisp + ' <span style="font-weight:500;opacity:.75;">#' + esc(String(s.id)) + '</span></span>' +
      '<span style="font-size:11px;color:var(--text-dim);">' + esc(roleName) + life + '</span></div>' +
      (markerHtml ? '<div style="margin-top:8px;"><span style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;opacity:.65;margin-right:6px;">Marker</span>' + markerHtml + '</div>' : '') +
      (remHtml ? '<div style="margin-top:6px;"><span style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;opacity:.65;margin-right:6px;">Erinnerung</span>' + remHtml + '</div>' : '') +
      noteHtml +
      '</div>';
  });
  if (!activeCount) {
    rows = '<div style="font-size:12px;color:var(--text-faint);font-style:italic;padding:14px 4px;">Noch keine Marker, Erinnerungen oder Notizen — im <strong>Grimoire</strong> (Tisch oder Liste) einen Sitz öffnen und dort setzen.</div>';
  }
  el.innerHTML =
    '<div class="panelSectionTitle" style="margin-top:2px;">Marker & Merkzettel</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 12px 0;">Phase M — Nur Sitze mit <strong>Grimoire-Markern</strong>, <strong>Erinnerungs-Chips</strong> oder <strong>Leiter-Notiz</strong>. Zeile antippen öffnet den Sitz.</p>' +
    '<div style="max-height:min(52vh,440px);overflow:auto;padding-right:4px;">' + rows + '</div>';
}
window.renderMarkersPanel = renderMarkersPanel;

function renderTownPanel() {
  const el = document.getElementById('townPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const list = Array.isArray(seats) ? seats : [];
  const rows = list.map(function (s) {
    const st = s.alive !== false ? '<span style="color:var(--sea-hi,#40b882);">lebt</span>' : '<span style="opacity:.65;">tot</span>';
    const cl = s.claim && String(s.claim).trim() ? esc(String(s.claim)) : '<span style="opacity:.45;">—</span>';
    return '<div style="display:grid;grid-template-columns:32px 1fr 64px;gap:8px;align-items:start;padding:10px 8px;border-bottom:1px solid var(--card-border);font-size:12px;">' +
      '<span style="opacity:.75;">' + esc(String(s.id)) + '</span>' +
      '<div><div style="font-weight:600;color:var(--silver);">' + esc(s.name || '—') + '</div><div style="margin-top:4px;font-size:11px;color:var(--text-dim);">Claim: ' + cl + '</div></div>' +
      '<div style="text-align:right;font-size:11px;">' + st + '</div></div>';
  }).join('');
  el.innerHTML =
    '<div class="panelSectionTitle">Town (öffentlich)</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Nur <strong>Name</strong>, <strong>Claim</strong> und Leben/Tod — keine Rollen. Claims im Sitz-Popup bearbeiten.</p>' +
    '<div style="max-height:min(52vh,420px);overflow:auto;">' + (rows || '<div style="opacity:.6;">Keine Sitze.</div>') + '</div>';
}
window.renderTownPanel = renderTownPanel;

function renderBluffsPanel() {
  const el = document.getElementById('bluffsPanelEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const ids = (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(demonBluffRoleIds)) ? demonBluffRoleIds : [];
  const rawStr = ids.join(', ');
  const labels = ids.map(function (id) {
    var R = typeof ROLES !== 'undefined' ? ROLES[id] : null;
    return R ? esc(R.name || R.n || id) + ' <code style="font-size:9px;opacity:.7;">' + esc(id) + '</code>' : esc(id);
  }).join('<br>');
  el.innerHTML =
    '<div class="panelSectionTitle">Dämon-Bluffs</div>' +
    '<p style="font-size:11px;color:var(--text-faint);margin:0 0 10px 0;">Role-IDs (<code>snake_case</code>), kommagetrennt. In der <strong>Spy-Ansicht</strong> (Toolbar 👁) unten im Kreis eingeblendet.</p>' +
    '<textarea id="demonBluffsInput" rows="3" style="width:100%;box-sizing:border-box;font-size:12px;padding:8px;border-radius:8px;border:1px solid var(--card-border);background:rgba(8,6,18,.5);color:var(--text);" placeholder="z. B. slayer, mayor, monk"></textarea>' +
    '<button type="button" class="btn primary" style="margin-top:10px;width:100%;" onclick="botcSaveDemonBluffsFromPanel()">Bluffs speichern</button>' +
    '<div style="margin-top:14px;font-size:11px;line-height:1.45;color:var(--text-dim);"><strong>Vorschau:</strong><br>' + (labels || '—') + '</div>' +
    '<button type="button" class="btn" style="margin-top:10px;width:100%;" onclick="toggleSpyViewMode()">Spy-Ansicht umschalten</button>';
  const ta = document.getElementById('demonBluffsInput');
  if (ta) ta.value = rawStr;
}
window.renderBluffsPanel = renderBluffsPanel;

function botcSaveDemonBluffsFromPanel() {
  const ta = document.getElementById('demonBluffsInput');
  const t = ta && ta.value != null ? String(ta.value) : '';
  const parts = t.split(/[\s,;]+/).map(function (x) { return x.trim().toLowerCase(); }).filter(Boolean);
  const out = [];
  for (var i = 0; i < parts.length && out.length < 8; i++) {
    var id = parts[i].replace(/[^a-z0-9_]/g, '');
    if (!id || out.indexOf(id) >= 0) continue;
    out.push(id);
  }
  demonBluffRoleIds = out;
  if (typeof scheduleSave === 'function') scheduleSave();
  draw();
  renderBluffsPanel();
  if (typeof showToast === 'function') showToast('Bluffs gespeichert', 2000);
}
window.botcSaveDemonBluffsFromPanel = botcSaveDemonBluffsFromPanel;

// ═══════════════ EVIL NIGHT 1 OVERLAY ═══════════════
function showEvilNightOneOverlay() {
  var esc = function(s) { return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

  var minionSeats = seats.filter(function(s) {
    var r = (typeof ROLES !== 'undefined') && s.role ? ROLES[s.role] : null;
    return r && String(r.team||'').toLowerCase() === 'minion';
  });
  var demonSeats = seats.filter(function(s) {
    var r = (typeof ROLES !== 'undefined') && s.role ? ROLES[s.role] : null;
    return r && String(r.team||'').toLowerCase() === 'demon';
  });
  var bluffs = (typeof demonBluffRoleIds !== 'undefined' && Array.isArray(demonBluffRoleIds))
    ? demonBluffRoleIds.filter(Boolean).slice(0, 3) : [];

  function roleImg(roleId, border) {
    return '<img data-botc-role="' + esc(roleId) + '" src="" alt="" style="width:min(68px,17vw);height:auto;border-radius:50%;border:2px solid ' + border + ';display:block;">';
  }
  function playerCard(s, border) {
    var rId = s.role;
    var r = (typeof ROLES !== 'undefined') && rId ? ROLES[rId] : null;
    var rName = r ? (r.name || r.n || rId) : (rId || '?');
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:68px;">' +
      (rId ? roleImg(rId, border) : '') +
      '<div style="font-size:12px;font-weight:700;margin-top:2px;">' + esc(s.name || 'Sitz '+s.id) + '</div>' +
      '<div style="font-size:10px;opacity:.7;">' + esc(rName) + '</div>' +
      '</div>';
  }

  var html = '<div style="text-align:center;">';

  if (minionSeats.length) {
    html += '<div style="margin-bottom:16px;">';
    html += '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px;">Minion' + (minionSeats.length > 1 ? 's' : '') + '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">';
    minionSeats.forEach(function(s) { html += playerCard(s, '#c94a4a'); });
    html += '</div></div>';
  }

  if (demonSeats.length) {
    html += '<div style="margin-bottom:16px;">';
    html += '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px;">Dämon</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">';
    demonSeats.forEach(function(s) { html += playerCard(s, '#8b1a1a'); });
    html += '</div></div>';
  }

  if (bluffs.length) {
    html += '<div style="border-top:1px solid rgba(201,168,76,.3);padding-top:14px;">';
    html += '<div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin-bottom:8px;">Bluffs (für den Dämon)</div>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">';
    bluffs.forEach(function(rId) {
      var r = (typeof ROLES !== 'undefined') && rId ? ROLES[rId] : null;
      var rName = r ? (r.name || r.n || rId) : rId;
      html += '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;min-width:68px;">';
      html += roleImg(rId, 'var(--gold)');
      html += '<div style="font-size:11px;margin-top:2px;">' + esc(rName) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  if (!minionSeats.length && !demonSeats.length) {
    html += '<p style="opacity:.6;font-style:italic;font-size:13px;">Keine bösen Rollen zugewiesen.</p>';
    html += '<p style="font-size:11px;opacity:.5;">Rollen zuerst im Setup vergeben.</p>';
  }

  html += '</div>';

  if (typeof window.showPrivateInfoOverlay === 'function') {
    window.showPrivateInfoOverlay({
      type: 'evil_setup_info',
      title: '🔴 Böse Team – Erste Nacht',
      html: html
    });
  }
}
window.showEvilNightOneOverlay = showEvilNightOneOverlay;

// ═══════════════ NOMINATION TRACKER ═══════════════
function renderNominationPanel() {
  var el = document.getElementById('nominationPanelEl');
  if (!el) return;
  var esc = function(v) { return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var log = (typeof nominationLog !== 'undefined' && Array.isArray(nominationLog)) ? nominationLog : [];
  var aliveCount = seats.filter(function(s) { return s.alive; }).length;
  var majority = Math.ceil(aliveCount / 2);
  var hasNominated = new Set(log.map(function(e) { return e.nominatorId; }));
  var hasBeenNominated = new Set(log.map(function(e) { return e.nomineeId; }));

  // Status table
  var tableRows = seats.map(function(s) {
    var did = hasNominated.has(s.id);
    var was = hasBeenNominated.has(s.id);
    return '<tr style="border-bottom:1px solid rgba(255,255,255,.04);">' +
      '<td style="padding:4px 6px;font-size:11px;max-width:80px;overflow:hidden;text-overflow:ellipsis;">' + esc(s.name||'Sitz '+s.id) + (s.alive?'':' <span style="opacity:.4;font-size:9px;">✝</span>') + '</td>' +
      '<td style="padding:4px 6px;font-size:12px;text-align:center;' + (did?'color:var(--gold);':'opacity:.25;') + '">' + (did?'✓':'—') + '</td>' +
      '<td style="padding:4px 6px;font-size:12px;text-align:center;' + (was?'color:#e05555;':'opacity:.25;') + '">' + (was?'✓':'—') + '</td>' +
      '</tr>';
  }).join('');

  // Nomination cards with vote counters
  var logCards = log.map(function(entry, i) {
    var a = seats.find(function(s) { return s.id === entry.nominatorId; });
    var b = seats.find(function(s) { return s.id === entry.nomineeId; });
    var aName = a ? (a.name||'Sitz '+a.id) : '?';
    var bName = b ? (b.name||'Sitz '+b.id) : '?';
    var v = entry.votes || { yes: 0, no: 0 };
    var passed = v.yes >= majority;
    var btnBase = 'width:22px;height:22px;border-radius:50%;font-size:14px;cursor:pointer;line-height:1;display:inline-flex;align-items:center;justify-content:center;padding:0;';
    var yesBg = 'background:rgba(58,111,175,.2);border:1px solid rgba(93,150,223,.4);color:#5d96df;';
    var noBg  = 'background:rgba(158,32,32,.15);border:1px solid rgba(212,64,64,.35);color:#d44040;';
    return '<div style="padding:10px;margin-bottom:8px;background:rgba(0,0,0,.25);border-radius:12px;border:1px solid ' + (passed?'rgba(212,64,64,.5)':'rgba(255,255,255,.07)') + ';">' +
      // Header
      '<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">' +
        '<span style="color:var(--gold);font-size:12px;font-weight:600;">' + esc(aName) + '</span>' +
        '<span style="opacity:.35;font-size:10px;">→</span>' +
        '<span style="color:#e07777;font-size:12px;font-weight:600;">' + esc(bName) + '</span>' +
        '<button type="button" onclick="removeNomination('+i+')" style="margin-left:auto;background:none;border:none;color:rgba(255,255,255,.25);cursor:pointer;font-size:14px;padding:0 2px;line-height:1;" title="Entfernen">×</button>' +
      '</div>' +
      // Vote counter row
      '<div style="display:flex;align-items:center;gap:10px;">' +
        // Ja
        '<div style="display:flex;align-items:center;gap:5px;">' +
          '<button type="button" onclick="setVotes('+i+',\'yes\',-1)" style="'+btnBase+yesBg+'">−</button>' +
          '<span style="min-width:22px;text-align:center;font-size:14px;font-weight:700;color:#5d96df;">' + v.yes + '</span>' +
          '<button type="button" onclick="setVotes('+i+',\'yes\',1)" style="'+btnBase+yesBg+'">+</button>' +
          '<span style="font-size:9px;opacity:.5;font-family:Cinzel,serif;letter-spacing:.06em;margin-left:1px;">JA</span>' +
        '</div>' +
        '<span style="opacity:.2;font-size:10px;">|</span>' +
        // Nein
        '<div style="display:flex;align-items:center;gap:5px;">' +
          '<button type="button" onclick="setVotes('+i+',\'no\',-1)" style="'+btnBase+noBg+'">−</button>' +
          '<span style="min-width:22px;text-align:center;font-size:14px;font-weight:700;color:#d44040;">' + v.no + '</span>' +
          '<button type="button" onclick="setVotes('+i+',\'no\',1)" style="'+btnBase+noBg+'">+</button>' +
          '<span style="font-size:9px;opacity:.5;font-family:Cinzel,serif;letter-spacing:.06em;margin-left:1px;">NEIN</span>' +
        '</div>' +
        '<span style="margin-left:auto;font-size:9px;font-family:Cinzel,serif;opacity:.45;white-space:nowrap;">≥'+majority+' = Mehr.</span>' +
      '</div>' +
      // Execution button if majority
      (passed ? '<button type="button" onclick="openExecutionModal('+i+')" style="width:100%;margin-top:10px;padding:8px;background:rgba(158,32,32,.22);border:1px solid rgba(212,64,64,.5);border-radius:9px;color:#d44040;font-family:Cinzel,serif;font-size:11px;font-weight:700;letter-spacing:.08em;cursor:pointer;text-transform:uppercase;">⚔ Hinrichten</button>' : '') +
    '</div>';
  }).join('');

  var playerOpts = '<option value="">— wählen —</option>' + seats.filter(function(s){return s.alive;}).map(function(s) {
    return '<option value="'+esc(s.id)+'">' + esc(s.name||'Sitz '+s.id) + '</option>';
  }).join('');

  el.innerHTML =
    '<div class="panelSectionTitle" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">' +
      '<span>Nominierungen</span>' +
      '<button type="button" class="btn" style="font-size:9px;padding:2px 7px;height:24px;" onclick="resetNominations()">Tag reset</button>' +
    '</div>' +
    '<p style="font-size:10px;color:var(--text-faint);margin:0 0 8px;">1× nominieren, 1× nominiert werden pro Tag. Mehrheit: ≥'+majority+' Ja-Stimmen ('+aliveCount+' am Leben).</p>' +
    '<table style="width:100%;border-collapse:collapse;margin-bottom:10px;font-size:11px;">' +
      '<thead><tr style="opacity:.45;">' +
        '<th style="text-align:left;padding:2px 6px;border-bottom:1px solid var(--card-border);">Spieler</th>' +
        '<th style="text-align:center;padding:2px 6px;border-bottom:1px solid var(--card-border);" title="Hat nominiert">Nom↑</th>' +
        '<th style="text-align:center;padding:2px 6px;border-bottom:1px solid var(--card-border);" title="Wurde nominiert">Nom↓</th>' +
      '</tr></thead>' +
      '<tbody>' + tableRows + '</tbody>' +
    '</table>' +
    (log.length ? '<div style="margin-bottom:10px;">' + logCards + '</div>' : '') +
    // Add nomination form
    '<div style="background:rgba(201,168,76,.07);border-radius:10px;padding:10px;border:1px solid rgba(201,168,76,.18);">' +
      '<div style="font-family:Cinzel,serif;font-size:9px;letter-spacing:.1em;text-transform:uppercase;opacity:.55;margin-bottom:8px;">Neue Nominierung</div>' +
      '<div style="display:flex;gap:5px;align-items:center;margin-bottom:7px;">' +
        '<select id="nomNominatorSelect" style="flex:1;font-size:11px;padding:5px 4px;border-radius:7px;border:1px solid var(--card-border);background:rgba(8,6,18,.7);color:var(--text);">' + playerOpts + '</select>' +
        '<span style="font-size:11px;opacity:.4;">→</span>' +
        '<select id="nomNomineeSelect" style="flex:1;font-size:11px;padding:5px 4px;border-radius:7px;border:1px solid var(--card-border);background:rgba(8,6,18,.7);color:var(--text);">' + playerOpts + '</select>' +
      '</div>' +
      '<button type="button" class="btn primary" style="width:100%;font-size:11px;height:36px;" onclick="addNomination()">Eintragen</button>' +
    '</div>';
}
window.renderNominationPanel = renderNominationPanel;

function addNomination() {
  var nomSel = document.getElementById('nomNominatorSelect');
  var nomineeSel = document.getElementById('nomNomineeSelect');
  if (!nomSel || !nomineeSel) return;
  var nominatorId = parseInt(nomSel.value, 10);
  var nomineeId = parseInt(nomineeSel.value, 10);
  if (!nominatorId || !nomineeId || isNaN(nominatorId) || isNaN(nomineeId)) {
    if (typeof showToast === 'function') showToast('Bitte zwei Spieler wählen', 2000);
    return;
  }
  if (nominatorId === nomineeId) {
    if (typeof showToast === 'function') showToast('Spieler kann sich nicht selbst nominieren', 2000);
    return;
  }
  if (!Array.isArray(nominationLog)) nominationLog = [];
  var alreadyNom = nominationLog.some(function(e) { return e.nominatorId === nominatorId; });
  var alreadyTarget = nominationLog.some(function(e) { return e.nomineeId === nomineeId; });
  if (alreadyNom) {
    var sA = seats.find(function(x) { return x.id === nominatorId; });
    if (typeof showToast === 'function') showToast((sA ? (sA.name||'Sitz '+sA.id) : '?') + ' hat heute bereits nominiert!', 3000);
    return;
  }
  if (alreadyTarget) {
    var sB = seats.find(function(x) { return x.id === nomineeId; });
    if (typeof showToast === 'function') showToast((sB ? (sB.name||'Sitz '+sB.id) : '?') + ' wurde heute bereits nominiert!', 3000);
    return;
  }
  nominationLog.push({ nominatorId: nominatorId, nomineeId: nomineeId, votes: { yes: 0, no: 0 } });
  renderNominationPanel();
  updateNominationBanner();
  draw();
}
window.addNomination = addNomination;

function removeNomination(index) {
  if (!Array.isArray(nominationLog)) return;
  nominationLog.splice(index, 1);
  renderNominationPanel();
  updateNominationBanner();
  draw();
}
window.removeNomination = removeNomination;

function resetNominations() {
  nominationLog = [];
  renderNominationPanel();
  updateNominationBanner();
  if (typeof showToast === 'function') showToast('Nominierungen zurückgesetzt', 2000);
}
window.resetNominations = resetNominations;

function setVotes(index, type, delta) {
  if (!Array.isArray(nominationLog) || !nominationLog[index]) return;
  if (!nominationLog[index].votes) nominationLog[index].votes = { yes: 0, no: 0 };
  var v = nominationLog[index].votes;
  if (type === 'yes') v.yes = Math.max(0, v.yes + delta);
  else if (type === 'no') v.no = Math.max(0, v.no + delta);
  renderNominationPanel();
  updateNominationBanner();
}
window.setVotes = setVotes;

function openExecutionModal(index) {
  if (!Array.isArray(nominationLog) || !nominationLog[index]) return;
  var entry = nominationLog[index];
  var b = seats.find(function(s) { return s.id === entry.nomineeId; });
  var bName = b ? (b.name || 'Sitz ' + b.id) : '?';
  var v = entry.votes || { yes: 0, no: 0 };
  var aliveCount = seats.filter(function(s) { return s.alive; }).length;
  var majority = Math.ceil(aliveCount / 2);
  var msg = bName + ' wurde nominiert.\n\n' +
    'Ja-Stimmen: ' + v.yes + '  |  Nein-Stimmen: ' + v.no + '\n' +
    'Mehrheit erforderlich: ' + majority + '\n\n' +
    'Soll ' + bName + ' hingerichtet werden (als tot markieren)?';
  if (confirm(msg)) {
    confirmExecution(index);
  }
}
window.openExecutionModal = openExecutionModal;

function confirmExecution(index) {
  if (!Array.isArray(nominationLog) || !nominationLog[index]) return;
  var entry = nominationLog[index];
  var b = seats.find(function(s) { return s.id === entry.nomineeId; });
  if (!b) return;
  b.alive = false;
  if (typeof storyLog !== 'undefined' && Array.isArray(storyLog)) {
    var a = seats.find(function(s) { return s.id === entry.nominatorId; });
    var aName = a ? (a.name || 'Sitz ' + a.id) : '?';
    var bName = b.name || 'Sitz ' + b.id;
    var v = entry.votes || { yes: 0, no: 0 };
    storyLog.unshift({ type: 'execution', text: '⚔ ' + bName + ' wurde hingerichtet (nominiert von ' + aName + ', ' + v.yes + ':' + v.no + ' Stimmen)', day: typeof dayNumber !== 'undefined' ? dayNumber : 1 });
    if (typeof renderStoryLog === 'function') renderStoryLog();
  }
  if (typeof showToast === 'function') showToast((b.name || 'Sitz ' + b.id) + ' wurde hingerichtet', 3000);
  draw();
  if (typeof renderPanel === 'function') renderPanel();
  if (typeof scheduleSave === 'function') scheduleSave();
}
window.confirmExecution = confirmExecution;

function updateNominationBanner() {
  var banner = document.getElementById('nominationBanner');
  var badge = document.getElementById('nomTabBadge');
  var log = (typeof nominationLog !== 'undefined' && Array.isArray(nominationLog)) ? nominationLog : [];
  if (badge) { badge.textContent = log.length || ''; badge.style.display = log.length ? 'inline' : 'none'; }
  if (!banner) return;
  if (!log.length) { banner.style.display = 'none'; return; }
  var esc = function(v) { return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var html = '<span class="nomBannerLabel">⚖ Nominierungen</span>';
  log.forEach(function(e) {
    var a = seats.find(function(s) { return s.id === e.nominatorId; });
    var b = seats.find(function(s) { return s.id === e.nomineeId; });
    html += '<span class="nomBannerEntry">' +
      '<span class="nomBannerA">' + esc(a ? (a.name||'Sitz '+a.id) : '?') + '</span>' +
      '<span class="nomBannerArrow">→</span>' +
      '<span class="nomBannerB">' + esc(b ? (b.name||'Sitz '+b.id) : '?') + '</span>' +
      '</span>';
  });
  banner.innerHTML = html;
  banner.style.display = 'flex';
}
window.updateNominationBanner = updateNominationBanner;

function renderGrimoireList() {
  const el = document.getElementById('grimoireListEl');
  if (!el) return;
  const esc = v => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  el.innerHTML = seats.map(s => {
    const roleName = (s.role && ROLES[s.role]) ? (ROLES[s.role].name || ROLES[s.role].n) : '—';
    const team = teamOf(s);
    const noteLine = (s.notes && String(s.notes).trim()) ? `<div class="gNote">${esc(s.notes)}</div>` : '';
    const claimLine = (s.claim && String(s.claim).trim()) ? `<div class="gNote" style="opacity:.85;font-style:normal;border-left:2px solid var(--gold-dim);padding-left:6px;">Claim: ${esc(s.claim)}</div>` : '';
    const reminderChips = (s.reminder && s.reminder.length) ? s.reminder.map(r => `<span class="gReminderChip">${esc(r)}</span>`).join('') : '';
    return `<div class="grimoireRow${s.alive?'':' dead'}" data-seat-id="${s.id}" onclick="openPopupFromGrimoire(${s.id})">
      <span class="gSeat">${s.id}</span>
      <span class="gName">${esc(s.name || '—')}</span>
      <span class="gRole team-${team}">${esc(roleName)}</span>
      <span class="gStatus ${s.alive?'alive':'dead'}"></span>
      <div class="gReminders">${reminderChips}</div>
      ${claimLine}
      ${noteLine}
    </div>`;
  }).join('');
}
function openPopupFromGrimoire(seatId) {
  const s = seats.find(x => x.id === seatId); if (!s) return;
  const pos = getSeatSvgPosition(seatId);
  const town = document.getElementById('town');
  const rect = town ? town.getBoundingClientRect() : { width: 900, height: 700 };
  selectedId = seatId;
  draw();
  showPopup(seatId, pos.x, pos.y, rect.width || 900, rect.height || 700);
}
function renderPanel() {
  renderStats();
  renderNightOrder();
  const jt = document.getElementById('panelTabJinx');
  if (jt && typeof getApplicableJinxesForCurrentSeats === 'function') {
    const nj = getApplicableJinxesForCurrentSeats().length;
    jt.title = nj ? nj + ' aktive Jinx-Paare' : 'Keine aktiven Jinx (für zugewiesene Rollen)';
  }
  if (panelTab === 'grimoire') renderGrimoireList();
  if (panelTab === 'jinxes') renderJinxPanel();
  if (panelTab === 'fabled') renderFabledPanel();
  if (panelTab === 'journal') renderJournalPanel();
  if (panelTab === 'kern') renderKernPanel();
  if (panelTab === 'limits') renderLimitsPanel();
  if (panelTab === 'markers') renderMarkersPanel();
  if (panelTab === 'town') renderTownPanel();
  if (panelTab === 'bluffs') renderBluffsPanel();
  if (panelTab === 'nomination') renderNominationPanel();
  renderSeatPanel();
}

function renderStats() {
  function setStatVal(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = parseInt(el.textContent, 10);
    el.textContent = val;
    if (!isNaN(prev) && prev !== val) {
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
      setTimeout(() => el.classList.remove('bump'), 260);
    }
  }
  setStatVal('stTotal', seats.length);
  setStatVal('stAlive', seats.filter(s=>s.alive).length);
  setStatVal('stDead',  seats.filter(s=>!s.alive).length);
}

function renderNightOrder() {
  const el2 = document.getElementById('nightOrderEl');
  const hintFooter = '<div class="nightOrderPhaseHint" style="margin-top:12px;padding:10px 8px;font-size:10px;line-height:1.45;color:var(--text-faint);border-top:1px solid var(--card-border);opacity:.92;">' +
    '<strong>Phase N/O — Night Order:</strong> Schritte folgen den <code style="font-size:9px;">nightOrder</code>-Einträgen in den Rollendaten. Viele Rollen sind tags-/passiv ohne Nachtwecken; Traveller und Spezialfälle sind nur <em>Leiter-Stütze</em> — bei Unsicherheit offizielles Script Tool oder Regelbuch.' +
    '</div>';
  const nightOneBtn = (nightNumber === 1)
    ? '<div style="margin-bottom:8px;">' +
      '<button type="button" class="btn" style="width:100%;font-size:11px;padding:6px 8px;background:rgba(120,30,30,.3);border-color:rgba(180,50,50,.5);" onclick="showEvilNightOneOverlay()">🔴 Böse Team – Erste-Nacht-Info</button>' +
      '</div>'
    : '';
  if (!nightSteps.length) {
    el2.innerHTML = nightOneBtn + '<div style="font-size:12px;color:var(--text-faint);font-style:italic;">Keine aktiven Rollen.</div>' + hintFooter;
    return;
  }
  el2.innerHTML = nightOneBtn + nightSteps.map((st,i) => {
    const seatName = st.seatId ? (seats.find(s=>s.id===st.seatId)?.name || `S${st.seatId}`) : '';
    const isCurrent = !st.done && nightSteps.slice(0,i).every(x=>x.done);
    return `<div class="noItem${st.done?' done':''}${st.system?' system':''}${isCurrent?' current':''}" onclick="clickStep('${st.id}')">
      <div class="noCheckBox">${st.done?`<svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`:''}
      </div>
      <div class="noLabel">${st.label}</div>
      ${seatName?`<div class="noSeatTag">${seatName}</div>`:''}
    </div>`;
  }).join('') + hintFooter;
  if (assistantMode) {
    updateTopBarForAssistant();
    scrollNightOrderToCurrent();
  }
}

function clickStep(id) {
  const st = nightSteps.find(s=>s.id===id); if(!st) return;
  st.done = !st.done;

  if (st.done) {
    if (st.seatId) {
      selectedId = st.seatId;
      draw();
      const seat = seats.find(s => s.id === st.seatId);
      if (seat && seat.role && ROLES && ROLES[seat.role]) {
        showStepAbilityCard(st, seat);
      }
    }
    if (st.id === 'dusk') {
      setTimeout(function() {
        const btn = document.getElementById('phaseToggleBtn');
        if (btn && !btn.textContent.includes('🌙')) togglePhase();
      }, 200);
    }
    if (st.id === 'dawn') {
      setTimeout(function() {
        const btn = document.getElementById('phaseToggleBtn');
        if (btn && btn.textContent.includes('🌙')) togglePhase();
      }, 200);
    }
  } else if (!st.done && st.seatId) {
    selectedId = st.seatId;
    closePopup();
    draw();
  }
  renderNightOrder();
}

function showStepAbilityCard(st, seat) {
  const existing = document.getElementById('stepAbilityCard');
  if (existing) existing.remove();
  const role = ROLES[seat.role];
  if (!role) return;
  const name = role.name || role.n || seat.role;
  const ability = role.ability || '';
  const isFirst = nightNumber === 1;
  const reminder = (isFirst ? role.firstNightReminder : role.otherNightReminder) || role.reminder || '';
  const card = document.createElement('div');
  card.id = 'stepAbilityCard';
  const teamCls = teamOf(seat);
  const teamGradients = { good: 'rgba(58,111,175,.55)', evil: 'rgba(158,32,32,.55)', minion: 'rgba(107,46,140,.55)', outsider: 'rgba(42,122,90,.55)' };
  const accentColor = teamGradients[teamCls] || 'rgba(201,168,76,.55)';
  card.style.cssText = [
    'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:500;',
    'max-width:500px;width:calc(100vw - 32px);',
    'background:linear-gradient(160deg,rgba(20,14,36,.98) 0%,rgba(8,5,18,.99) 100%);',
    'border:1px solid rgba(201,168,76,.4);border-radius:18px;',
    'padding:0;backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);',
    'box-shadow:0 24px 70px rgba(0,0,0,.85),0 0 0 1px rgba(201,168,76,.08),inset 0 1px 0 rgba(201,168,76,.1);',
    'cursor:pointer;overflow:hidden;'
  ].join('');

  // Build role image html if possible
  var roleImgHtml = '';
  if (typeof roleImageUrlList === 'function') {
    var urls = roleImageUrlList(seat.role);
    if (urls && urls.length) {
      roleImgHtml = '<img id="stepAbilityCardImg" src="' + escHtml(urls[0]) + '" alt="" style="width:52px;height:52px;border-radius:50%;border:2px solid rgba(201,168,76,.4);object-fit:cover;flex-shrink:0;background:rgba(201,168,76,.08);" onerror="this.style.display=\'none\'">';
    }
  }

  card.innerHTML =
    // Top accent bar
    '<div style="height:3px;background:linear-gradient(90deg,transparent,' + accentColor + ',transparent);"></div>' +
    '<div style="padding:14px 16px 14px;">' +
      // Header row: image + name + seat info
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:' + (ability || reminder ? '12px' : '0') + ';">' +
        (roleImgHtml ? roleImgHtml : '') +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-family:Cinzel,serif;font-size:15px;font-weight:700;color:#c9a84c;letter-spacing:.05em;line-height:1.1;">' + escHtml(name) + '</div>' +
          (seat.name ? '<div style="font-size:11px;color:rgba(226,214,188,.5);font-family:Cinzel,serif;margin-top:2px;letter-spacing:.04em;">' + escHtml(seat.name) + '</div>' : '') +
        '</div>' +
        '<div style="font-size:9px;opacity:.35;font-family:Cinzel,serif;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;flex-shrink:0;">Tippen ✕</div>' +
      '</div>' +
      // Ability text
      (ability ? '<div style="font-size:12px;line-height:1.6;color:rgba(226,214,188,.88);font-style:italic;' + (reminder ? 'margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(201,168,76,.15);' : '') + '">' + escHtml(ability) + '</div>' : '') +
      // ST reminder
      (reminder ? '<div style="display:flex;align-items:flex-start;gap:8px;padding-top:2px;">' +
        '<span style="font-size:9px;font-family:Cinzel,serif;font-weight:700;letter-spacing:.1em;color:rgba(201,168,76,.5);text-transform:uppercase;white-space:nowrap;padding-top:1px;">ST</span>' +
        '<div style="font-size:11px;line-height:1.5;color:#c9a84c;opacity:.8;">' + escHtml(reminder) + '</div>' +
      '</div>' : '') +
    '</div>';
  card.addEventListener('click', function() {
    card.remove();
    var banner = document.getElementById('nominationBanner');
    if (banner) banner.style.bottom = '22px';
  });
  document.body.appendChild(card);
  // Push nomination banner up so they don't overlap
  var banner = document.getElementById('nominationBanner');
  if (banner && banner.style.display !== 'none') banner.style.bottom = '130px';
  setTimeout(function() {
    if (card.parentNode) card.remove();
    var b = document.getElementById('nominationBanner');
    if (b) b.style.bottom = '22px';
  }, 14000);
}

function renderSeatPanel() {
  // panel reflects currently selected seat in header badge
}

function togglePanel() {
  panelOpen = !panelOpen;
  const panel = document.getElementById('sidePanel');
  const btn = document.getElementById('panelToggleBtn');
  panel.classList.toggle('collapsed', !panelOpen);
  btn.classList.toggle('collapsed', !panelOpen);
  btn.textContent = panelOpen ? '⟨' : '⟩';
  setTimeout(draw, 320);
  scheduleSave();
}

// Swipe gesture: left opens panel, right closes (iPad UX)
(function() {
  const SWIPE_THRESHOLD = 60;
  let touchStartX = 0;
  function isInputOrTextarea(el) {
    if (!el || typeof el.closest !== 'function') return false;
    return !!el.closest('input, textarea');
  }
  document.addEventListener('touchstart', function(ev) {
    if (isInputOrTextarea(ev.target)) return;
    touchStartX = ev.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function(ev) {
    if (isInputOrTextarea(ev.target)) return;
    if (ev.changedTouches.length === 0) return;
    const endX = ev.changedTouches[0].clientX;
    const deltaX = endX - touchStartX;
    const panel = document.getElementById('sidePanel');
    const btn = document.getElementById('panelToggleBtn');
    if (!panel || !btn) return;
    if (deltaX <= -SWIPE_THRESHOLD && !panelOpen) {
      panelOpen = true;
      panel.classList.remove('collapsed');
      btn.classList.remove('collapsed');
      btn.textContent = '⟨';
      setTimeout(draw, 320);
      scheduleSave();
    } else if (deltaX >= SWIPE_THRESHOLD && panelOpen) {
      panelOpen = false;
      panel.classList.add('collapsed');
      btn.classList.add('collapsed');
      btn.textContent = '⟩';
      setTimeout(draw, 320);
      scheduleSave();
    }
  }, { passive: true });
})();

