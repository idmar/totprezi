/* ═══════════════════════════════════════════════════════════
   雙個展 · Prezi-style 互動畫布導航
   層級：全覽 › 藝術家 › 主題區 › 作品
   ═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const artworksContainer = document.getElementById('artworks');
  const zoneLabelsContainer = document.getElementById('zoneLabels');
  const constellation = document.getElementById('constellation');
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  const STAGE_W = STAGE.w;
  const STAGE_H = STAGE.h;

  const MIN_SCALE = 0.08;
  const MAX_SCALE = 2.5;

  const artistById = id => ARTISTS.find(a => a.id === id);
  const workById = id => ARTWORKS.find(a => a.id === id);
  const worksOfArtist = id => ARTWORKS.filter(a => a.artist === id);
  const worksOfZone = n => ARTWORKS.filter(a => a.zone === Number(n));

  let currentFrame = 'center';
  let isTouring = false;
  let tourTimer = null;
  let tourIndex = 0;
  let tourList = ARTWORKS;

  // ── 載入狀態管理 ─────────────────────────────────────
  let loadedCount = 0;
  const totalToLoad = ARTWORKS.length;

  const loaderFill = document.getElementById('loaderFill');
  const loader = document.getElementById('loader');

  function hideLoader() {
    if (loader.classList.contains('hidden')) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.style.display = 'none', 1200);
  }

  ARTWORKS.forEach(art => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedCount++;
      loaderFill.style.width = (loadedCount / totalToLoad * 100) + '%';
      if (loadedCount === totalToLoad) setTimeout(hideLoader, 400);
    };
    img.src = art.image;
  });

  // 作品較多，最長等 8 秒就進場
  setTimeout(() => {
    loaderFill.style.width = '100%';
    hideLoader();
  }, 8000);

  // ── 節點定位 ─────────────────────────────────────────
  function placeFixedNodes() {
    const hub = document.querySelector('.node-hub');
    hub.style.left = HUB.pos[0] + 'px';
    hub.style.top = HUB.pos[1] + 'px';

    ARTISTS.forEach(artist => {
      const el = document.querySelector(`.node-center[data-artist="${artist.id}"]`);
      if (!el) return;
      el.style.left = artist.pos[0] + 'px';
      el.style.top = artist.pos[1] + 'px';
    });
  }

  // ── 建立主題區標籤 ───────────────────────────────────
  function buildZoneLabels() {
    Object.keys(ZONES).forEach(n => {
      const z = ZONES[n];
      const el = document.createElement('div');
      el.className = `zone-label zone-${n}`;
      el.dataset.frame = 'zone-' + n;
      el.dataset.zone = n;
      el.dataset.artist = z.artist;
      el.style.left = z.label[0] + 'px';
      el.style.top = z.label[1] + 'px';
      el.style.setProperty('--zone-color', z.color);
      el.innerHTML = `<h2>${z.name}</h2><p class="en">${z.en}</p>`;
      el.addEventListener('click', e => {
        e.stopPropagation();
        navigateTo('zone-' + n);
      });
      zoneLabelsContainer.appendChild(el);
    });
  }

  // ── 建立作品節點 ─────────────────────────────────────
  function buildArtworks() {
    ARTWORKS.forEach(art => {
      const scale = art.scale || 1;
      const el = document.createElement('div');
      el.className = `artwork zone-${art.zone} artist-${art.artist}`;
      el.style.left = art.pos[0] + 'px';
      el.style.top = art.pos[1] + 'px';
      el.style.setProperty('--zone-color', ZONES[art.zone].color);
      if (scale !== 1) {
        el.style.transform = `translate(-50%, -50%) scale(${scale})`;
        el.style.width = (280 * scale) + 'px';
      }
      el.dataset.id = art.id;
      el.dataset.artist = art.artist;
      el.dataset.zone = art.zone;
      el.dataset.frame = 'work-' + art.id;
      el.innerHTML = `
        <div class="artwork-image" style="background-image:url('${art.image}')"></div>
        <div class="artwork-caption">
          <h3>${art.zh}</h3>
          <span class="en">${art.en}</span>
        </div>
      `;
      el.addEventListener('click', e => {
        e.stopPropagation();
        navigateTo('work-' + art.id, art);
      });
      artworksContainer.appendChild(el);
    });
  }

  // ── 連線（星座線）──────────────────────────────────────
  function buildConstellation() {
    // 序廳 → 兩位藝術家
    ARTISTS.forEach(artist => {
      addLine(HUB.pos[0], HUB.pos[1], artist.pos[0], artist.pos[1], 'lineGradHub', 2, '#e8e4dc');
    });

    // 藝術家 → 各自的主題區
    ARTISTS.forEach(artist => {
      artist.zones.forEach(n => {
        const z = ZONES[n];
        addLine(artist.pos[0], artist.pos[1], z.center[0], z.center[1], z.grad, 2.5, z.color);
      });
    });

    // 區內作品之間的連線
    ARTWORKS.forEach((art, i) => {
      ARTWORKS.slice(i + 1).forEach(other => {
        if (other.zone !== art.zone) return;
        const dist = Math.hypot(art.pos[0] - other.pos[0], art.pos[1] - other.pos[1]);
        if (dist < 900) {
          const z = ZONES[art.zone];
          addLine(art.pos[0], art.pos[1], other.pos[0], other.pos[1], z.grad, 1, z.color);
        }
      });
    });
  }

  function addLine(x1, y1, x2, y2, gradId, width, color) {
    const ns = 'http://www.w3.org/2000/svg';
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', `url(#${gradId})`);
    line.setAttribute('stroke-width', width);
    line.setAttribute('stroke-dasharray', '4 8');
    line.style.opacity = '0.6';
    constellation.appendChild(line);

    addDot(x1, y1, color, 3);
    addDot(x2, y2, color, 3);
  }

  function addDot(x, y, color, r) {
    const ns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color || '#d4a574');
    circle.setAttribute('opacity', '0.7');
    constellation.appendChild(circle);
  }

  // ── 視圖狀態 ─────────────────────────────────────────
  // stage 的 transform-origin 為 0 0：screen = stagePoint * scale + t
  const view = { tx: 0, ty: 0, scale: 0.5 };
  let transitionTimer = null;

  function applyView() {
    stage.style.transform =
      `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`;
  }

  // 直接操作（拖曳、滾輪）時關掉緩動，靜止後再恢復
  function setLive() {
    stage.classList.add('no-transition');
    clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => stage.classList.remove('no-transition'), 200);
  }

  // 將目標點 (x, y) 移到視窗中心，並以 scale 縮放
  function viewAt(targetX, targetY, scale) {
    view.scale = clampScale(scale);
    view.tx = window.innerWidth / 2 - targetX * view.scale;
    view.ty = window.innerHeight / 2 - targetY * view.scale;
    applyView();
  }

  function clampScale(s) {
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
  }

  // 以某個螢幕座標為錨點縮放
  function zoomAround(clientX, clientY, newScale) {
    const s = clampScale(newScale);
    const sx = (clientX - view.tx) / view.scale;
    const sy = (clientY - view.ty) / view.scale;
    view.scale = s;
    view.tx = clientX - sx * s;
    view.ty = clientY - sy * s;
    applyView();
  }

  // ── 框架 ─────────────────────────────────────────────
  // 卡片在窄螢幕上會被 CSS 改成另一種版型，因此取實際尺寸來收斂縮放，
  // 保證整張卡片都留在視窗內
  function scaleForNode(selector, baseScale) {
    const el = document.querySelector(selector);
    if (!el || !el.offsetWidth || !el.offsetHeight) return baseScale;
    return Math.min(
      baseScale,
      (window.innerWidth - 40) / el.offsetWidth,
      (window.innerHeight - 40) / el.offsetHeight
    );
  }

  function getFramePosition(frame) {
    if (frame === 'center') {
      return {
        x: HUB.pos[0], y: HUB.pos[1],
        scale: scaleForNode('.node-hub', HUB.scale)
      };
    }
    if (frame.startsWith('artist-')) {
      const artist = artistById(frame.slice(7));
      if (artist) {
        return {
          x: artist.pos[0], y: artist.pos[1],
          scale: scaleForNode(`.node-center[data-artist="${artist.id}"]`, artist.scale)
        };
      }
    }
    if (frame.startsWith('zone-')) {
      const z = ZONES[frame.slice(5)];
      if (z) return { x: z.center[0], y: z.center[1], scale: z.scale };
    }
    if (frame.startsWith('work-')) {
      const art = workById(frame.slice(5));
      if (art) {
        // 作品本身被放大時做反向補償，讓每件作品看起來一樣大
        return { x: art.pos[0], y: art.pos[1], scale: 1.0 / (art.scale || 1) };
      }
    }
    return { x: HUB.pos[0], y: HUB.pos[1], scale: HUB.scale };
  }

  // 上一層
  function parentFrame(frame) {
    if (frame.startsWith('work-')) {
      const art = workById(frame.slice(5));
      return art ? 'zone-' + art.zone : 'center';
    }
    if (frame.startsWith('zone-')) {
      const z = ZONES[frame.slice(5)];
      return z ? 'artist-' + z.artist : 'center';
    }
    return 'center';
  }

  function navigateTo(frame, art) {
    currentFrame = frame;
    const pos = getFramePosition(frame);
    viewAt(pos.x, pos.y, pos.scale);
    updateBreadcrumb();
    updateHighlights();

    if (art) {
      setTimeout(() => showInfoCard(art), 800);
    } else {
      hideInfoCard();
    }

    const tip = document.getElementById('introTip');
    if (tip) setTimeout(() => tip.classList.add('hidden'), 4000);
  }

  function goBack() {
    navigateTo(parentFrame(currentFrame));
  }

  function goHome() {
    navigateTo('center');
  }

  // ── 麵包屑 ───────────────────────────────────────────
  function crumb(text, frame, active) {
    const el = document.createElement('span');
    el.className = 'crumb' + (active ? ' active' : '');
    el.textContent = text;
    if (frame) el.addEventListener('click', () => navigateTo(frame));
    return el;
  }

  function sep(ch) {
    const el = document.createElement('span');
    el.className = 'sep';
    el.textContent = ch;
    return el;
  }

  function updateBreadcrumb() {
    const bc = document.getElementById('breadcrumb');
    bc.innerHTML = '';

    // 目前所在的藝術家 / 主題區 / 作品
    let artist = null, zoneNum = null, art = null;

    if (currentFrame.startsWith('artist-')) {
      artist = artistById(currentFrame.slice(7));
    } else if (currentFrame.startsWith('zone-')) {
      zoneNum = currentFrame.slice(5);
      artist = artistById(ZONES[zoneNum].artist);
    } else if (currentFrame.startsWith('work-')) {
      art = workById(currentFrame.slice(5));
      if (art) {
        zoneNum = String(art.zone);
        artist = artistById(art.artist);
      }
    }

    bc.appendChild(crumb('全覽', 'center', currentFrame === 'center'));
    if (currentFrame === 'center') return;

    if (artist) {
      bc.appendChild(sep('›'));
      bc.appendChild(crumb(
        artist.zh, 'artist-' + artist.id,
        currentFrame === 'artist-' + artist.id
      ));
    }

    if (zoneNum) {
      bc.appendChild(sep('›'));
      bc.appendChild(crumb(
        ZONES[zoneNum].name, 'zone-' + zoneNum,
        currentFrame === 'zone-' + zoneNum
      ));
    }

    if (art) {
      bc.appendChild(sep('›'));
      bc.appendChild(crumb(art.zh, null, true));
    }

    bc.appendChild(sep('·'));
    const back = crumb('← 返回', null, false);
    back.classList.add('back');
    back.addEventListener('click', goBack);
    bc.appendChild(back);
  }

  // ── 高亮 / 淡出 ──────────────────────────────────────
  // 依目前所在層級，算出「作用中」的藝術家與主題區
  function activeScope() {
    if (currentFrame.startsWith('artist-')) {
      return { artist: currentFrame.slice(7), zone: null };
    }
    if (currentFrame.startsWith('zone-')) {
      const n = currentFrame.slice(5);
      return { artist: ZONES[n].artist, zone: n };
    }
    if (currentFrame.startsWith('work-')) {
      const art = workById(currentFrame.slice(5));
      if (art) return { artist: art.artist, zone: String(art.zone), work: art.id };
    }
    return { artist: null, zone: null };
  }

  function updateHighlights() {
    const scope = activeScope();

    document.querySelectorAll('.zone-label').forEach(el => {
      if (!scope.artist) el.style.opacity = 1;
      else if (scope.zone) el.style.opacity = el.dataset.zone === scope.zone ? 1 : 0.15;
      else el.style.opacity = el.dataset.artist === scope.artist ? 1 : 0.15;
    });

    document.querySelectorAll('.node-center').forEach(el => {
      if (!scope.artist) el.style.opacity = 1;
      else el.style.opacity = el.dataset.artist === scope.artist ? 1 : 0.2;
    });

    document.querySelectorAll('.artwork').forEach(el => {
      let opacity = 1;
      if (scope.work) opacity = el.dataset.id === scope.work ? 1 : 0.2;
      else if (scope.zone) opacity = el.dataset.zone === scope.zone ? 1 : 0.15;
      else if (scope.artist) opacity = el.dataset.artist === scope.artist ? 1 : 0.15;
      el.style.opacity = opacity;
      el.classList.toggle('is-current', scope.work === el.dataset.id);
    });

    document.querySelectorAll('.hall-switch button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.frame === 'artist-' + scope.artist);
    });
  }

  // ── 信息卡 ───────────────────────────────────────────
  function setMetaRow(name, value) {
    const row = document.querySelector(`.info-meta tr[data-row="${name}"]`);
    if (!row) return;
    row.style.display = value ? '' : 'none';
    const cell = row.querySelector('td');
    if (cell) cell.textContent = value || '';
  }

  function showInfoCard(art) {
    const artist = artistById(art.artist);
    const card = document.getElementById('infoCard');
    card.classList.remove('hidden');
    card.style.setProperty('--zone-color', ZONES[art.zone].color);
    document.getElementById('infoImage').src = art.image;
    document.getElementById('infoImage').alt = `${art.zh} · ${art.en}`;
    document.getElementById('infoArtist').textContent =
      artist ? `${artist.zh} · ${ZONES[art.zone].name}` : ZONES[art.zone].name;
    document.getElementById('infoZh').textContent = art.zh;
    document.getElementById('infoEn').textContent = art.en;
    setMetaRow('year', art.year);
    setMetaRow('medium', art.medium);
    setMetaRow('size', art.size);
    document.getElementById('infoNote').textContent = art.note;
  }

  function hideInfoCard() {
    document.getElementById('infoCard').classList.add('hidden');
  }

  document.getElementById('closeInfo').addEventListener('click', goBack);

  // ── 縮放控制 ─────────────────────────────────────────
  function zoomByFactor(factor) {
    zoomAround(window.innerWidth / 2, window.innerHeight / 2, view.scale * factor);
  }

  document.getElementById('zoomIn').addEventListener('click', () => zoomByFactor(1.4));
  document.getElementById('zoomOut').addEventListener('click', () => zoomByFactor(1 / 1.4));
  document.getElementById('zoomReset').addEventListener('click', goHome);

  // ── 展廳切換 ─────────────────────────────────────────
  document.querySelectorAll('.hall-switch button').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.frame));
  });

  // ── 卡片點擊 ─────────────────────────────────────────
  document.querySelectorAll('.node-center').forEach(el => {
    el.addEventListener('click', () => {
      const frame = el.dataset.frame;
      if (currentFrame !== frame) navigateTo(frame);
    });
  });

  document.querySelectorAll('.hub-name[data-goto]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      navigateTo(el.dataset.goto);
    });
  });

  document.querySelector('.node-hub').addEventListener('click', () => {
    if (currentFrame !== 'center') goHome();
  });

  // ── Tour 導覽 ───────────────────────────────────────
  document.getElementById('tourBtn').addEventListener('click', () => {
    if (isTouring) stopTour();
    else startTour();
  });

  // 在某位藝術家的展廳裡啟動時，只導覽該展廳
  function tourScope() {
    const scope = activeScope();
    return scope.artist ? worksOfArtist(scope.artist) : ARTWORKS;
  }

  function startTour() {
    tourList = tourScope();
    if (!tourList.length) return;
    isTouring = true;
    tourIndex = 0;
    document.getElementById('tourBtn').classList.add('active');
    document.querySelector('.tour-btn .play-icon').textContent = '■';
    document.querySelector('.tour-btn .tour-text').textContent = 'Stop · 停止導覽';
    document.getElementById('tourProgress').classList.remove('hidden');
    updateTourProgress();
    tourTimer = setTimeout(nextTourStep, 600);
  }

  function stopTour() {
    isTouring = false;
    clearTimeout(tourTimer);
    document.getElementById('tourBtn').classList.remove('active');
    document.querySelector('.tour-btn .play-icon').textContent = '▶';
    document.querySelector('.tour-btn .tour-text').textContent = 'Guide Me · 帶我走一遍';
    document.getElementById('tourProgress').classList.add('hidden');
  }

  function nextTourStep() {
    if (!isTouring) return;
    if (tourIndex >= tourList.length) {
      stopTour();
      goHome();
      return;
    }
    const art = tourList[tourIndex];
    navigateTo('work-' + art.id, art);
    tourIndex++;
    updateTourProgress();
    tourTimer = setTimeout(nextTourStep, 6000);
  }

  function updateTourProgress() {
    document.getElementById('progressFill').style.width =
      (tourIndex / tourList.length * 100) + '%';
    document.getElementById('progressText').textContent =
      `${tourIndex} / ${tourList.length}`;
  }

  // ── 鍵盤導航 ─────────────────────────────────────────
  // 目前層級下可以左右切換的清單
  function siblingWorks() {
    const scope = activeScope();
    if (scope.zone) return worksOfZone(scope.zone);
    if (scope.artist) return worksOfArtist(scope.artist);
    return ARTWORKS;
  }

  function stepWork(delta) {
    if (!currentFrame.startsWith('work-')) return false;
    const list = siblingWorks();
    const idx = list.findIndex(a => a.id === currentFrame.slice(5));
    if (idx === -1) return false;
    const next = list[(idx + delta + list.length) % list.length];
    navigateTo('work-' + next.id, next);
    return true;
  }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (isTouring && (e.key === 'Escape' || e.key === ' ')) {
      e.preventDefault();
      stopTour();
      return;
    }

    if (e.key === 'Escape') {
      if (currentFrame !== 'center') goBack();
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (stepWork(1)) return;
      const scope = activeScope();
      if (scope.zone) {
        const first = worksOfZone(scope.zone)[0];
        if (first) navigateTo('work-' + first.id, first);
      } else if (scope.artist) {
        navigateTo('zone-' + artistById(scope.artist).zones[0]);
      } else {
        navigateTo('artist-' + ARTISTS[0].id);
      }
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (stepWork(-1)) return;
      goBack();
      return;
    }

    if (e.key >= '1' && e.key <= '7' && ZONES[e.key]) {
      navigateTo('zone-' + e.key);
      return;
    }
    if (e.key === '0' || e.key === 'h') goHome();
    if (e.key === 'q') navigateTo('artist-' + ARTISTS[0].id);
    if (e.key === 'w') navigateTo('artist-' + ARTISTS[1].id);
  });

  // ── 滑鼠拖曳平移 ─────────────────────────────────────
  let isDragging = false;
  const dragStart = { x: 0, y: 0, tx: 0, ty: 0 };

  stage.addEventListener('mousedown', e => {
    if (e.target.closest('.artwork') || e.target.closest('.zone-label')) return;
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    dragStart.tx = view.tx;
    dragStart.ty = view.ty;
    stage.classList.add('no-transition');
    document.body.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    view.tx = dragStart.tx + (e.clientX - dragStart.x);
    view.ty = dragStart.ty + (e.clientY - dragStart.y);
    applyView();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.cursor = '';
    stage.classList.remove('no-transition');
  });

  // ── 滾輪縮放 ─────────────────────────────────────────
  window.addEventListener('wheel', e => {
    if (e.target.closest('.info-card')) return;
    e.preventDefault();
    setLive();
    const delta = e.deltaY > 0 ? 1 / 1.08 : 1.08;
    zoomAround(e.clientX, e.clientY, view.scale * delta);
  }, { passive: false });

  // ── 觸控：單指平移、雙指縮放 ─────────────────────────
  let touchMode = null;
  const touchStart = { x: 0, y: 0, tx: 0, ty: 0, dist: 0, scale: 1 };

  const touchDist = t =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  const touchMid = t => ({
    x: (t[0].clientX + t[1].clientX) / 2,
    y: (t[0].clientY + t[1].clientY) / 2
  });

  stage.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      if (e.target.closest('.artwork') || e.target.closest('.zone-label')) {
        touchMode = null;
        return;
      }
      touchMode = 'pan';
      touchStart.x = e.touches[0].clientX;
      touchStart.y = e.touches[0].clientY;
      touchStart.tx = view.tx;
      touchStart.ty = view.ty;
    } else if (e.touches.length === 2) {
      touchMode = 'pinch';
      touchStart.dist = touchDist(e.touches) || 1;
      touchStart.scale = view.scale;
    }
    if (touchMode) stage.classList.add('no-transition');
  }, { passive: true });

  stage.addEventListener('touchmove', e => {
    if (!touchMode) return;
    if (touchMode === 'pan' && e.touches.length === 1) {
      e.preventDefault();
      view.tx = touchStart.tx + (e.touches[0].clientX - touchStart.x);
      view.ty = touchStart.ty + (e.touches[0].clientY - touchStart.y);
      applyView();
    } else if (touchMode === 'pinch' && e.touches.length === 2) {
      e.preventDefault();
      const mid = touchMid(e.touches);
      zoomAround(mid.x, mid.y, touchStart.scale * (touchDist(e.touches) / touchStart.dist));
    }
  }, { passive: false });

  stage.addEventListener('touchend', e => {
    if (e.touches.length === 0) {
      touchMode = null;
      stage.classList.remove('no-transition');
    }
  }, { passive: true });

  // ── 背景粒子動畫 ─────────────────────────────────────
  function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(212, 165, 116, ${(1 - d / 120) * 0.1})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pos = getFramePosition(currentFrame);
    viewAt(pos.x, pos.y, pos.scale);
  });

  // ── 初始化 ───────────────────────────────────────────
  function init() {
    stage.style.width = STAGE_W + 'px';
    stage.style.height = STAGE_H + 'px';
    constellation.style.width = STAGE_W + 'px';
    constellation.style.height = STAGE_H + 'px';

    placeFixedNodes();
    buildZoneLabels();
    buildArtworks();
    buildConstellation();
    initParticles();

    updateBreadcrumb();
    updateHighlights();

    requestAnimationFrame(() => {
      const pos = getFramePosition('center');
      stage.style.opacity = '1';
      viewAt(pos.x, pos.y, pos.scale);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
