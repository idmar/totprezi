/* ═══════════════════════════════════════════════════════════
   王國召 · Prezi-style 互動畫布導航
   ═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const stage = document.getElementById('stage');
  const artworksContainer = document.getElementById('artworks');
  const constellation = document.getElementById('constellation');
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  const STAGE_W = 4000;
  const STAGE_H = 2800;

  // ── 畫布載入 ─────────────────────────────────────────
  let currentFrame = 'center';
  let history = ['center'];
  let isTouring = false;
  let tourTimer = null;
  let tourIndex = 0;

  // ── 載入狀態管理 ─────────────────────────────────────
  let loadedCount = 0;
  const totalToLoad = ARTWORKS.length;

  const loaderFill = document.getElementById('loaderFill');
  const loader = document.getElementById('loader');

  // 預載作品圖
  ARTWORKS.forEach((art, idx) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      loadedCount++;
      loaderFill.style.width = (loadedCount / totalToLoad * 100) + '%';
      if (loadedCount === totalToLoad) {
        setTimeout(() => {
          loader.classList.add('hidden');
          setTimeout(() => loader.style.display = 'none', 1200);
        }, 400);
      }
    };
    img.src = art.image;
  });

  // 5 秒後強制隱藏 loader
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loaderFill.style.width = '100%';
      loader.classList.add('hidden');
      setTimeout(() => loader.style.display = 'none', 1200);
    }
  }, 6000);

  // ── 建立作品節點 ─────────────────────────────────────
  function buildArtworks() {
    ARTWORKS.forEach((art, idx) => {
      const el = document.createElement('div');
      el.className = `artwork zone-${art.zone}`;
      el.style.left = art.pos[0] + 'px';
      el.style.top = art.pos[1] + 'px';
      if (art.scale && art.scale !== 1) {
        el.style.transform = `translate(-50%, -50%) scale(${art.scale})`;
      }
      el.dataset.id = art.id;
      el.dataset.frame = 'work-' + art.id;
      el.innerHTML = `
        <div class="artwork-image" style="background-image:url('${art.image}')"></div>
        <div class="artwork-caption">
          <h3>${art.zh}</h3>
          <span class="en">${art.en}</span>
        </div>
      `;
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateTo('work-' + art.id, art);
      });
      artworksContainer.appendChild(el);
    });

    // 初始化大小：CHAOS 較大、調整 transform-origin
    document.querySelectorAll('.artwork').forEach(el => {
      const rect = el.getBoundingClientRect();
      el.style.width = (280 * parseFloat(el.style.transform.match(/scale\(([\d.]+)\)/)?.[1] || 1)) + 'px';
    });
  }

  // ── 連線（星座線）──────────────────────────────────────
  function buildConstellation() {
    // 中心到三個區
    const cx = 2000, cy = 1400;
    const z1 = ZONES[1].center;
    const z2 = ZONES[2].center;
    const z3 = ZONES[3].center;

    addLine(cx, cy, z1[0], z1[1], 'lineGrad1', 2.5);
    addLine(cx, cy, z2[0], z2[1], 'lineGrad2', 2.5);
    addLine(cx, cy, z3[0], z3[1], 'lineGrad3', 2.5);

    // 區內作品之間的連線
    ARTWORKS.forEach((art, i) => {
      ARTWORKS.slice(i + 1).forEach(other => {
        if (other.zone === art.zone) {
          const dist = Math.hypot(art.pos[0] - other.pos[0], art.pos[1] - other.pos[1]);
          if (dist < 900) {
            const grad = art.zone === 1 ? 'lineGrad1' : art.zone === 2 ? 'lineGrad2' : 'lineGrad3';
            addLine(art.pos[0], art.pos[1], other.pos[0], other.pos[1], grad, 1);
          }
        }
      });
    });
  }

  function addLine(x1, y1, x2, y2, gradId, width = 1) {
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

    // 起點小圓點
    addDot(x1, y1, gradId, 3);
    addDot(x2, y2, gradId, 3);
  }

  function addDot(x, y, gradId, r = 2) {
    const ns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', r);
    const colorMap = {
      lineGrad1: '#d4a574',
      lineGrad2: '#7a9eb5',
      lineGrad3: '#a8b89d'
    };
    circle.setAttribute('fill', colorMap[gradId] || '#d4a574');
    circle.setAttribute('opacity', '0.7');
    constellation.appendChild(circle);
  }

  // ── 視圖定位 ─────────────────────────────────────────
  // 將畫布縮放 / 平移，使目標點 (x, y) 位於視窗中心，並以 scale 縮放
  function viewAt(targetX, targetY, scale = 1) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // transform-origin: 0 0
    // 對 viewport 中心 (vw/2, vh/2)，要讓 target (x, y) 出現在中心：
    // translate(-targetX, -targetY) 後再 scale(s) → 將 (0,0) 拉到 (0,0)，並把 (x, y) 拉到 (-targetX*s, -targetY*s)
    // 為使 (x, y) 在 viewport 中央，需再 translate(vw/2 - x*s, vh/2 - y*s)
    const tx = vw / 2 - targetX * scale;
    const ty = vh / 2 - targetY * scale;
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  // 各視圖預設位置（中心瞄準點 + 縮放）
  function getFramePosition(frame) {
    if (frame === 'center') {
      return { x: 2000, y: 1400, scale: 0.5 };
    }
    if (frame === 'zone-1') {
      return { x: ZONES[1].center[0], y: ZONES[1].center[1], scale: 0.85 };
    }
    if (frame === 'zone-2') {
      return { x: ZONES[2].center[0], y: ZONES[2].center[1], scale: 0.85 };
    }
    if (frame === 'zone-3') {
      return { x: ZONES[3].center[0], y: ZONES[3].center[1], scale: 0.95 };
    }
    if (frame.startsWith('work-')) {
      const id = frame.slice(5);
      const art = ARTWORKS.find(a => a.id === id);
      if (art) {
        // 作品被縮放，要做反向補償讓視覺接近 360x360
        const baseScale = 1.0 / (art.scale || 1);
        return { x: art.pos[0], y: art.pos[1], scale: baseScale };
      }
    }
    return { x: 2000, y: 1400, scale: 0.5 };
  }

  function navigateTo(frame, art) {
    currentFrame = frame;
    history.push(frame);
    const pos = getFramePosition(frame);
    viewAt(pos.x, pos.y, pos.scale);
    updateBreadcrumb();
    updateZoneHighlights();

    // 如果是作品，顯示信息卡
    if (art) {
      setTimeout(() => showInfoCard(art), 800);
    } else {
      hideInfoCard();
    }

    // 7 秒後隱藏 intro 提示
    setTimeout(() => {
      const tip = document.getElementById('introTip');
      if (tip) tip.classList.add('hidden');
    }, 4000);
  }

  function goBack() {
    if (history.length <= 1) return;
    history.pop(); // 移除當前
    history.pop(); // 移除前一
    const prev = history[history.length - 1] || 'center';
    history.push(prev);
    currentFrame = prev;
    const pos = getFramePosition(prev);
    viewAt(pos.x, pos.y, pos.scale);
    updateBreadcrumb();
    updateZoneHighlights();
    hideInfoCard();
  }

  function goHome() {
    history.length = 0;
    history.push('center');
    currentFrame = 'center';
    const pos = getFramePosition('center');
    viewAt(pos.x, pos.y, pos.scale);
    updateBreadcrumb();
    updateZoneHighlights();
    hideInfoCard();
  }

  // ── 麵包屑 ───────────────────────────────────────────
  function updateBreadcrumb() {
    const bc = document.getElementById('breadcrumb');
    const back = bc.querySelector('.back');
    const labels = bc.querySelectorAll('.crumb');

    // 重建
    bc.innerHTML = '';

    const homeCrumb = document.createElement('span');
    homeCrumb.className = 'crumb' + (currentFrame === 'center' ? ' active' : '');
    homeCrumb.textContent = '全覽';
    homeCrumb.addEventListener('click', goHome);
    bc.appendChild(homeCrumb);

    if (currentFrame === 'center') {
      homeCrumb.classList.add('active');
      return;
    }

    const sep1 = document.createElement('span');
    sep1.className = 'sep';
    sep1.textContent = '›';
    bc.appendChild(sep1);

    if (currentFrame.startsWith('zone-')) {
      const z = ZONES[currentFrame.slice(5)];
      const zCrumb = document.createElement('span');
      zCrumb.className = 'crumb active';
      zCrumb.textContent = z.name;
      bc.appendChild(zCrumb);
    } else if (currentFrame.startsWith('work-')) {
      const id = currentFrame.slice(5);
      const art = ARTWORKS.find(a => a.id === id);
      if (art) {
        const zoneNum = art.zone;
        const zCrumb = document.createElement('span');
        zCrumb.className = 'crumb';
        zCrumb.textContent = ZONES[zoneNum].name;
        zCrumb.addEventListener('click', () => navigateTo('zone-' + zoneNum));
        bc.appendChild(zCrumb);

        const sep2 = document.createElement('span');
        sep2.className = 'sep';
        sep2.textContent = '›';
        bc.appendChild(sep2);

        const artCrumb = document.createElement('span');
        artCrumb.className = 'crumb active';
        artCrumb.textContent = art.zh;
        bc.appendChild(artCrumb);
      }
    }

    // 返回按鈕
    const backSep = document.createElement('span');
    backSep.className = 'sep';
    backSep.textContent = '·';
    bc.appendChild(backSep);

    const backBtn = document.createElement('span');
    backBtn.className = 'crumb back';
    backBtn.textContent = '← 返回';
    backBtn.addEventListener('click', goBack);
    bc.appendChild(backBtn);
  }

  function updateZoneHighlights() {
    // 區標籤根據當前視圖高亮 / 淡化
    document.querySelectorAll('.zone-label').forEach(z => {
      if (currentFrame.startsWith('zone-')) {
        const zid = currentFrame.slice(5);
        if (z.dataset.frame === currentFrame) {
          z.style.opacity = 1;
        } else {
          z.style.opacity = 0.2;
        }
      } else if (currentFrame.startsWith('work-')) {
        const id = currentFrame.slice(5);
        const art = ARTWORKS.find(a => a.id === id);
        if (art && z.dataset.frame === 'zone-' + art.zone) {
          z.style.opacity = 1;
        } else {
          z.style.opacity = 0.2;
        }
      } else {
        z.style.opacity = 1;
      }
    });

    document.querySelectorAll('.artwork').forEach(a => {
      const id = a.dataset.id;
      if (currentFrame === 'center') {
        a.style.opacity = 1;
      } else if (currentFrame.startsWith('zone-')) {
        const aid = a.dataset.frame.slice(5);
        const art = ARTWORKS.find(x => x.id === aid);
        if (art && currentFrame === 'zone-' + art.zone) {
          a.style.opacity = 1;
        } else {
          a.style.opacity = 0.15;
        }
      } else if (currentFrame.startsWith('work-')) {
        if ('work-' + id === currentFrame) {
          a.style.opacity = 1;
          a.style.borderColor = 'rgba(212,165,116,0.4)';
        } else {
          a.style.opacity = 0.2;
        }
      }
    });
  }

  // ── 信息卡 ───────────────────────────────────────────
  function showInfoCard(art) {
    const card = document.getElementById('infoCard');
    card.classList.remove('hidden');
    document.getElementById('infoImage').src = art.image;
    document.getElementById('infoZh').textContent = art.zh;
    document.getElementById('infoEn').textContent = art.en;
    document.getElementById('infoYear').textContent = art.year;
    document.getElementById('infoMedium').textContent = art.medium;
    document.getElementById('infoSize').textContent = art.size;
    document.getElementById('infoNote').textContent = art.note;
  }

  function hideInfoCard() {
    const card = document.getElementById('infoCard');
    card.classList.add('hidden');
  }

  document.getElementById('closeInfo').addEventListener('click', () => {
    goBack();
  });

  // ── 縮放控制 ─────────────────────────────────────────
  document.getElementById('zoomIn').addEventListener('click', () => {
    const pos = getFramePosition(currentFrame);
    viewAt(pos.x, pos.y, Math.min(pos.scale * 1.4, 2));
  });
  document.getElementById('zoomOut').addEventListener('click', () => {
    const pos = getFramePosition(currentFrame);
    viewAt(pos.x, pos.y, Math.max(pos.scale / 1.4, 0.15));
  });
  document.getElementById('zoomReset').addEventListener('click', goHome);

  // ── 區標籤點擊 ───────────────────────────────────────
  document.querySelectorAll('.zone-label').forEach(z => {
    z.addEventListener('click', () => {
      navigateTo(z.dataset.frame);
    });
  });

  // 中心卡 → 全覽
  document.querySelector('.node-center').addEventListener('click', () => {
    // 如果已是中心則不改
    if (currentFrame !== 'center') goHome();
  });

  // ── Tour 導覽 ───────────────────────────────────────
  document.getElementById('tourBtn').addEventListener('click', () => {
    if (isTouring) stopTour();
    else startTour();
  });

  function startTour() {
    isTouring = true;
    tourIndex = 0;
    document.getElementById('tourBtn').classList.add('active');
    document.querySelector('.tour-btn .play-icon').textContent = '■';
    document.querySelector('.tour-btn .tour-text').textContent = 'Stop · 停止導覽';
    document.getElementById('tourProgress').classList.remove('hidden');
    updateTourProgress();
    // 先回中心
    goHome();
    setTimeout(() => nextTourStep(), 1200);
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
    if (tourIndex >= ARTWORKS.length) {
      stopTour();
      goHome();
      return;
    }
    const art = ARTWORKS[tourIndex];
    navigateTo('work-' + art.id, art);
    updateTourProgress();
    tourIndex++;
    tourTimer = setTimeout(nextTourStep, 6000);
  }

  function updateTourProgress() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    fill.style.width = ((tourIndex) / ARTWORKS.length * 100) + '%';
    text.textContent = `${tourIndex} / ${ARTWORKS.length}`;
  }

  // ── 鍵盤導航 ─────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (isTouring && (e.key === 'Escape' || e.key === ' ')) {
      e.preventDefault();
      stopTour();
      return;
    }

    if (e.key === 'Escape') {
      if (currentFrame === 'center') return;
      if (currentFrame.startsWith('work-')) {
        const id = currentFrame.slice(5);
        const art = ARTWORKS.find(a => a.id === id);
        navigateTo('zone-' + art.zone);
      } else {
        goHome();
      }
      return;
    }

    // →/↓：下一個作品
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (currentFrame.startsWith('work-')) {
        const id = currentFrame.slice(5);
        const idx = ARTWORKS.findIndex(a => a.id === id);
        const next = ARTWORKS[(idx + 1) % ARTWORKS.length];
        navigateTo('work-' + next.id, next);
      } else if (currentFrame.startsWith('zone-')) {
        const zn = parseInt(currentFrame.slice(5));
        const first = ARTWORKS.find(a => a.zone === zn);
        if (first) navigateTo('work-' + first.id, first);
      } else if (currentFrame === 'center') {
        navigateTo('zone-1');
      }
      e.preventDefault();
    }

    // ←/↑：上一個作品
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (currentFrame.startsWith('work-')) {
        const id = currentFrame.slice(5);
        const idx = ARTWORKS.findIndex(a => a.id === id);
        const prev = ARTWORKS[(idx - 1 + ARTWORKS.length) % ARTWORKS.length];
        navigateTo('work-' + prev.id, prev);
      } else if (currentFrame.startsWith('zone-')) {
        goHome();
      }
      e.preventDefault();
    }
  });

  // 鍵盤字母快捷鍵：1/2/3 → 區
  document.addEventListener('keydown', (e) => {
    if (e.key === '1') navigateTo('zone-1');
    if (e.key === '2') navigateTo('zone-2');
    if (e.key === '3') navigateTo('zone-3');
    if (e.key === '0' || e.key === 'h') goHome();
  });

  // ── 滑鼠拖曳平移 ─────────────────────────────────────
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentTransform = { tx: 0, ty: 0, scale: 1 };

  function getCurrentTransform() {
    const matrix = new WebKitCSSMatrix(window.getComputedStyle(stage).transform);
    return {
      tx: matrix.e,
      ty: matrix.f,
      scale: matrix.a
    };
  }

  stage.addEventListener('mousedown', (e) => {
    // 排除節點點擊
    if (e.target.closest('.artwork') || e.target.closest('.zone-label')) return;
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    currentTransform = getCurrentTransform();
    stage.style.transition = 'none';
    document.body.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    stage.style.transform = `translate(${currentTransform.tx + dx}px, ${currentTransform.ty + dy}px) scale(${currentTransform.scale})`;
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = '';
      stage.style.transition = '';
    }
  });

  // 滾輪縮放
  window.addEventListener('wheel', (e) => {
    if (e.target.closest('.info-card')) return;
    e.preventDefault();
    const pos = getFramePosition(currentFrame);
    const delta = e.deltaY > 0 ? 1/1.08 : 1.08;
    const newScale = Math.max(0.15, Math.min(2.5, pos.scale * delta));
    // 縮放向鼠標位置
    const rect = stage.getBoundingClientRect();
    const cx = e.clientX;
    const cy = e.clientY;
    // 計算鼠標在 stage 局部座標
    const sx = (cx - rect.left) / rect.width * STAGE_W;
    const sy = (cy - rect.top) / rect.height * STAGE_H;
    viewAt(sx, sy, newScale);
  }, { passive: false });

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

      // 連線（粒子之間距離近時）
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(212, 165, 116, ${(1 - d/120) * 0.1})`;
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
  });

  // ── 初始化 ───────────────────────────────────────────
  function init() {
    buildArtworks();
    buildConstellation();
    initParticles();

    // 設置初始視圖（先用過渡讓畫面從全黑緩慢展開）
    requestAnimationFrame(() => {
      const pos = getFramePosition('center');
      stage.style.opacity = '1';
      viewAt(pos.x, pos.y, pos.scale);
    });
  }

  // DOM 已就緒
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
