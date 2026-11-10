// ===== 배경 장면 (SVG로 직접 그린 아기자기한 그래픽) =====

// 마스코트: 발끝이 (0,0), 위쪽이 음수 y
export function mascotSVG(type) {
  const eyes = (y) => `
    <circle cx="-11" cy="${y}" r="5.5" fill="#fff"/><circle cx="11" cy="${y}" r="5.5" fill="#fff"/>
    <circle class="pupil" cx="-10" cy="${y + 1}" r="3" fill="#1d1d24"/><circle class="pupil" cx="12" cy="${y + 1}" r="3" fill="#1d1d24"/>
    <circle cx="-9" cy="${y - 1}" r="1.2" fill="#fff"/><circle cx="13" cy="${y - 1}" r="1.2" fill="#fff"/>`;
  const cheeks = (y) => `<circle cx="-21" cy="${y}" r="5" fill="#ff9fb2" opacity=".8"/><circle cx="21" cy="${y}" r="5" fill="#ff9fb2" opacity=".8"/>`;
  const mouths = (y, stroke) => `
    <path class="m-happy" d="M-6 ${y} Q0 ${y + 7} 6 ${y}" stroke="${stroke}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path class="m-worry" d="M-6 ${y + 4} Q0 ${y - 2} 6 ${y + 4}" stroke="${stroke}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse class="m-panic" cx="0" cy="${y + 3}" rx="4.5" ry="5.5" fill="#7a2d3a"/>`;
  const sweat = `<path class="sweat" d="M30 -100 Q36 -90 30 -84 Q24 -90 30 -100 Z" fill="#8fd8ff" stroke="#4aa8e0" stroke-width="1.5"/>`;

  if (type === 'korea') {
    // 아기 반달가슴곰 '반디'
    return `
    <g class="mascot">
      <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".12"/>
      <ellipse cx="-14" cy="-6" rx="11" ry="8" fill="#2b2b35"/><ellipse cx="14" cy="-6" rx="11" ry="8" fill="#2b2b35"/>
      <ellipse cx="0" cy="-30" rx="31" ry="28" fill="#2b2b35"/>
      <ellipse class="arm-l" cx="-31" cy="-34" rx="9" ry="15" fill="#2b2b35"/>
      <ellipse class="arm-r" cx="31" cy="-34" rx="9" ry="15" fill="#2b2b35"/>
      <path d="M-17 -52 Q0 -30 17 -52 Q12 -47 0 -40 Q-12 -47 -17 -52 Z" fill="#fff"/>
      <circle cx="-24" cy="-103" r="11" fill="#2b2b35"/><circle cx="24" cy="-103" r="11" fill="#2b2b35"/>
      <circle cx="-24" cy="-103" r="5" fill="#5a5a68"/><circle cx="24" cy="-103" r="5" fill="#5a5a68"/>
      <circle cx="0" cy="-80" r="31" fill="#2b2b35"/>
      <ellipse cx="0" cy="-69" rx="15" ry="11" fill="#d9b48f"/>
      <ellipse cx="0" cy="-74" rx="5.5" ry="3.8" fill="#1d1d24"/>
      ${eyes(-87)}
      ${cheeks(-73)}
      ${mouths(-68, '#3a2a20')}
      ${sweat}
    </g>`;
  }
  // 아기 말레이맥 '타피'
  return `
  <g class="mascot">
    <ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".12"/>
    <ellipse cx="-14" cy="-6" rx="11" ry="8" fill="#2b2b35"/><ellipse cx="14" cy="-6" rx="11" ry="8" fill="#2b2b35"/>
    <ellipse cx="0" cy="-30" rx="31" ry="28" fill="#f4f4f6" stroke="#2b2b35" stroke-width="3"/>
    <ellipse class="arm-l" cx="-31" cy="-34" rx="9" ry="15" fill="#2b2b35"/>
    <ellipse class="arm-r" cx="31" cy="-34" rx="9" ry="15" fill="#2b2b35"/>
    <circle cx="-23" cy="-104" r="10" fill="#2b2b35" stroke="#fff" stroke-width="3"/>
    <circle cx="23" cy="-104" r="10" fill="#2b2b35" stroke="#fff" stroke-width="3"/>
    <circle cx="0" cy="-80" r="31" fill="#2b2b35"/>
    <path d="M-12 -76 Q-12 -58 0 -56 Q12 -58 12 -76 Z" fill="#4a4a58"/>
    <ellipse cx="-4" cy="-59" rx="1.6" ry="1.2" fill="#1d1d24"/><ellipse cx="4" cy="-59" rx="1.6" ry="1.2" fill="#1d1d24"/>
    ${eyes(-89)}
    ${cheeks(-76)}
    ${mouths(-52, '#fff')}
    ${sweat}
  </g>`;
}

function wavePath(amp, step) {
  let d = 'M -400 0';
  for (let x = -400; x < 2100; x += step) {
    d += ` Q ${x + step / 4} ${-amp} ${x + step / 2} 0 T ${x + step} 0`;
  }
  return d + ' L 2100 800 L -400 800 Z';
}

function fish(x, y, color, flip, dur, delay) {
  return `
  <g class="fish-swim ${flip ? 'rev' : ''}" style="animation-duration:${dur}s;animation-delay:${delay}s">
    <g transform="translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}">
      <ellipse cx="0" cy="0" rx="22" ry="13" fill="${color}"/>
      <path d="M18 0 L36 -12 L34 0 L36 12 Z" fill="${color}"/>
      <circle cx="-10" cy="-3" r="3.5" fill="#fff"/><circle cx="-11" cy="-3" r="2" fill="#222"/>
      <path d="M-2 -10 Q4 0 -2 10" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>
    </g>
  </g>`;
}

function reeds(x0, x1, yBase) {
  let s = '';
  for (let x = x0; x <= x1; x += 13) {
    const h = 40 + ((x * 7) % 25);
    const lean = ((x * 3) % 9) - 4;
    s += `<path d="M${x} ${yBase} Q${x + lean} ${yBase - h / 2} ${x + lean * 2} ${yBase - h}" stroke="#b9975b" stroke-width="3" fill="none" stroke-linecap="round"/>
          <ellipse cx="${x + lean * 2}" cy="${yBase - h - 6}" rx="4" ry="10" fill="#d8b878" transform="rotate(${lean * 4} ${x + lean * 2} ${yBase - h - 6})"/>`;
  }
  return `<g class="sway">${s}</g>`;
}

function palm(x, y, s = 1, flip = false) {
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
    <path d="M0 0 Q-8 -60 10 -130" stroke="#a9773f" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M0 0 Q-8 -60 10 -130" stroke="#c89558" stroke-width="13" fill="none" stroke-dasharray="4 10" stroke-linecap="butt"/>
    <g transform="translate(10 -130)"><g class="sway-top">
      <path d="M0 0 Q-40 -30 -80 5 Q-40 -10 0 0" fill="#3fae5a"/>
      <path d="M0 0 Q40 -35 85 0 Q40 -12 0 0" fill="#45bb60"/>
      <path d="M0 0 Q-30 -55 -60 -50 Q-25 -35 0 0" fill="#52c46c"/>
      <path d="M0 0 Q25 -60 65 -50 Q25 -35 0 0" fill="#3fae5a"/>
      <path d="M0 0 Q-10 -50 5 -75 Q5 -40 0 0" fill="#59cc73"/>
      <circle cx="-6" cy="6" r="7" fill="#8a5a2b"/><circle cx="7" cy="7" r="7" fill="#7a4e24"/>
    </g></g>
  </g>`;
}

function pine(x, y, s = 1) {
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <rect x="-6" y="-30" width="12" height="32" rx="4" fill="#8a5a3a"/>
    <path d="M0 -120 L-34 -60 L-20 -62 L-44 -26 L44 -26 L20 -62 L34 -60 Z" fill="#3e9a5b"/>
    <path d="M0 -120 L-18 -88 L18 -88 Z" fill="#4fb36b"/>
  </g>`;
}

function mangrove(x, y) {
  return `
  <g transform="translate(${x} ${y})">
    <path d="M-30 10 Q-26 -20 -6 -30 M-12 12 Q-12 -14 -2 -30 M30 10 Q26 -20 6 -30 M12 12 Q12 -14 2 -30" stroke="#7a5534" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="-5" y="-70" width="10" height="44" rx="4" fill="#7a5534"/>
    <circle cx="-26" cy="-78" r="24" fill="#2f8f55"/>
    <circle cx="24" cy="-80" r="26" fill="#2f8f55"/>
    <circle cx="0" cy="-98" r="30" fill="#3aa463"/>
    <circle cx="-8" cy="-106" r="8" fill="#5cc581" opacity=".7"/>
  </g>`;
}

export function buildScene(el) {
  el.innerHTML = `
  <svg id="sceneSvg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a6e3ff"/><stop offset=".7" stop-color="#e3f7ff"/><stop offset="1" stop-color="#fff4dc"/>
      </linearGradient>
      <linearGradient id="gStormSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7f8fa6"/><stop offset="1" stop-color="#c9d3df"/>
      </linearGradient>
      <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5fd0ef" stop-opacity=".86"/><stop offset=".2" stop-color="#46b4e4"/><stop offset=".6" stop-color="#3399d6"/><stop offset="1" stop-color="#2a74b8"/>
      </linearGradient>
      <linearGradient id="gSeaBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8fe2f7"/><stop offset="1" stop-color="#4bb5e2"/>
      </linearGradient>
    </defs>

    <rect width="1600" height="900" fill="url(#gSky)"/>
    <rect id="stormSky" width="1600" height="900" fill="url(#gStormSky)" opacity="0"/>

    <!-- 해님 -->
    <g id="sun" transform="translate(800 150)">
      <g class="sun-rays">
        ${Array.from({ length: 12 }, (_, i) => `<rect x="-6" y="-100" width="12" height="26" rx="6" fill="#ffd34d" transform="rotate(${i * 30})"/>`).join('')}
      </g>
      <circle r="62" fill="#ffdb5c"/>
      <circle r="62" fill="none" stroke="#ffc83a" stroke-width="5"/>
      <circle cx="-20" cy="-8" r="6" fill="#5b3a1a"/><circle cx="20" cy="-8" r="6" fill="#5b3a1a"/>
      <circle cx="-34" cy="12" r="9" fill="#ff9f7a" opacity=".6"/><circle cx="34" cy="12" r="9" fill="#ff9f7a" opacity=".6"/>
      <path class="m-happy" d="M-16 14 Q0 30 16 14" stroke="#5b3a1a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="m-worry" d="M-14 22 Q0 12 14 22" stroke="#5b3a1a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse class="m-panic" cx="0" cy="20" rx="9" ry="10" fill="#5b3a1a"/>
    </g>

    <!-- 구름 -->
    <g class="cloud c1"><g transform="translate(250 130)">
      <ellipse cx="0" cy="0" rx="70" ry="30" fill="#fff"/><circle cx="-25" cy="-18" r="30" fill="#fff"/><circle cx="20" cy="-24" r="36" fill="#fff"/>
    </g></g>
    <g class="cloud c2"><g transform="translate(1320 110)">
      <ellipse cx="0" cy="0" rx="80" ry="30" fill="#fff"/><circle cx="-30" cy="-18" r="30" fill="#fff"/><circle cx="25" cy="-26" r="38" fill="#fff"/>
    </g></g>
    <g class="cloud c3"><g transform="translate(1050 230)" opacity=".85">
      <ellipse cx="0" cy="0" rx="50" ry="20" fill="#fff"/><circle cx="-15" cy="-12" r="20" fill="#fff"/><circle cx="15" cy="-14" r="24" fill="#fff"/>
    </g></g>

    <!-- 먹구름 (해수면이 많이 오르면 나타남) -->
    <g id="storm" opacity="0">
      <g transform="translate(800 200)">
        <g class="rain">
          ${Array.from({ length: 14 }, (_, i) => `<line x1="${-140 + i * 21}" y1="20" x2="${-150 + i * 21}" y2="60" stroke="#6fb6ea" stroke-width="4" stroke-linecap="round"/>`).join('')}
        </g>
        <ellipse cx="0" cy="0" rx="170" ry="42" fill="#8d97a8"/>
        <circle cx="-70" cy="-25" r="48" fill="#8d97a8"/><circle cx="20" cy="-45" r="60" fill="#98a2b3"/><circle cx="100" cy="-15" r="44" fill="#8d97a8"/>
      </g>
    </g>

    <!-- 새 -->
    <g class="birds">
      <path d="M460 230 q12 -12 24 0 q12 -12 24 0" stroke="#4a5568" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M520 200 q9 -9 18 0 q9 -9 18 0" stroke="#4a5568" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>

    <!-- 뒤쪽 바다 -->
    <g id="waterBack" class="water-move">
      <g class="wave-slide slow"><path d="${wavePath(10, 140)}" fill="url(#gSeaBack)"/></g>
    </g>

    <!-- 한국 섬 -->
    <g id="islandKorea">
      <path d="M -50 900 L -50 575 Q 130 480 340 492 Q 590 500 720 620 L 740 900 Z" fill="#f3dca0"/>
      <path d="M -50 900 L -50 560 Q 120 470 330 480 Q 560 490 680 600 L 700 900 Z" fill="#9bd67f"/>
      <path d="M -50 560 Q 120 470 330 480 Q 560 490 680 600" stroke="#7cc463" stroke-width="6" fill="none"/>
      ${pine(70, 520, 1)}
      ${pine(125, 505, 0.75)}
      <!-- 한옥 -->
      <g transform="translate(225 490)">
        <rect x="-62" y="-52" width="124" height="52" rx="4" fill="#f7e9cc" stroke="#8a6a46" stroke-width="3"/>
        <rect x="-15" y="-38" width="30" height="38" rx="2" fill="#b98250"/>
        <g stroke="#8a6a46" stroke-width="2" fill="#fff8e6">
          <rect x="-50" y="-40" width="26" height="22"/><path d="M-37 -40 V-18 M-50 -29 H-24" fill="none"/>
          <rect x="24" y="-40" width="26" height="22"/><path d="M37 -40 V-18 M24 -29 H50" fill="none"/>
        </g>
        <path d="M-92 -50 Q-80 -42 -64 -48 L64 -48 Q80 -42 92 -50 Q72 -56 62 -82 L-62 -82 Q-72 -56 -92 -50 Z" fill="#53657d"/>
        <rect x="-66" y="-90" width="132" height="10" rx="5" fill="#3e4d61"/>
        <path d="M-62 -78 H62 M-60 -68 H60 M-58 -58 H58" stroke="#6b7f99" stroke-width="2"/>
      </g>
      <!-- 마스코트 반디 -->
      <g id="mascotKorea" class="mascot-wrap" transform="translate(400 488)">${mascotSVG('korea')}</g>
      <!-- 순천만 갈대 -->
      ${reeds(505, 615, 535)}
    </g>

    <!-- 말레이시아 섬 -->
    <g id="islandMalaysia">
      <path d="M 1650 900 L 1650 575 Q 1470 480 1260 492 Q 1010 500 880 620 L 860 900 Z" fill="#f3dca0"/>
      <path d="M 1650 900 L 1650 560 Q 1480 470 1270 480 Q 1040 490 920 600 L 900 900 Z" fill="#8ccf6e"/>
      <path d="M 1650 560 Q 1480 470 1270 480 Q 1040 490 920 600" stroke="#72bd57" stroke-width="6" fill="none"/>
      ${palm(1530, 520, 1)}
      ${palm(1470, 505, 0.8, true)}
      <!-- 수상가옥(룸마 팡궁) -->
      <g transform="translate(1340 490)">
        <g fill="#8a5a33">
          <rect x="-52" y="-36" width="9" height="40"/><rect x="-18" y="-36" width="9" height="40"/>
          <rect x="10" y="-36" width="9" height="40"/><rect x="43" y="-36" width="9" height="40"/>
        </g>
        <rect x="-62" y="-42" width="124" height="10" rx="3" fill="#a86c3c"/>
        <rect x="-54" y="-96" width="108" height="56" rx="3" fill="#eaa960" stroke="#a86c3c" stroke-width="3"/>
        <path d="M-54 -82 H54 M-54 -68 H54 M-54 -54 H54" stroke="#d8934a" stroke-width="2"/>
        <rect x="-14" y="-82" width="28" height="42" rx="2" fill="#a86c3c"/>
        <rect x="-44" y="-84" width="20" height="18" fill="#fff4dc" stroke="#a86c3c" stroke-width="2"/>
        <rect x="24" y="-84" width="20" height="18" fill="#fff4dc" stroke="#a86c3c" stroke-width="2"/>
        <path d="M-76 -92 L0 -150 L76 -92 Z" fill="#b5532f"/>
        <path d="M-76 -92 L0 -150 L76 -92" stroke="#8c3d22" stroke-width="5" fill="none" stroke-linejoin="round"/>
        <path d="M-6 -150 L0 -164 L6 -150 Z" fill="#8c3d22"/>
        <g stroke="#8a5a33" stroke-width="4"><path d="M-34 -32 L-48 6 M-22 -32 L-36 6 M-46 -18 H-30 M-44 -4 H-34"/></g>
      </g>
      <!-- 마스코트 타피 -->
      <g id="mascotMalaysia" class="mascot-wrap" transform="translate(1190 486)">${mascotSVG('malaysia')}</g>
      <!-- 맹그로브 -->
      ${mangrove(1010, 548)}
      ${mangrove(950, 578)}
    </g>

    <!-- 앞쪽 바다 -->
    <g id="water" class="water-move">
      <g class="wave-slide"><path d="${wavePath(14, 100)}" fill="url(#gSea)"/></g>
      <g class="wave-slide"><path d="${wavePath(6, 100).replace(' L 2100 800 L -400 800 Z', '')}" stroke="#d8f6ff" stroke-width="4" fill="none" opacity=".8" transform="translate(0 4)"/></g>
      ${fish(-80, 110, '#ffb347', false, 26, 0)}
      ${fish(1700, 170, '#ff7fa8', true, 32, -8)}
      ${fish(-80, 230, '#ffe066', false, 38, -20)}
      ${fish(1700, 90, '#7ad7a8', true, 29, -15)}
      <!-- 바다거북 -->
      <g class="turtle"><g transform="translate(1150 140)">
        <ellipse cx="-34" cy="-8" rx="14" ry="6" fill="#8fd18a" transform="rotate(-30 -34 -8)"/>
        <ellipse cx="34" cy="-8" rx="14" ry="6" fill="#8fd18a" transform="rotate(30 34 -8)"/>
        <ellipse cx="-28" cy="16" rx="10" ry="5" fill="#8fd18a" transform="rotate(30 -28 16)"/>
        <ellipse cx="28" cy="16" rx="10" ry="5" fill="#8fd18a" transform="rotate(-30 28 16)"/>
        <circle cx="0" cy="-30" r="12" fill="#8fd18a"/>
        <circle cx="-4" cy="-33" r="2.4" fill="#222"/><circle cx="4" cy="-33" r="2.4" fill="#222"/>
        <ellipse cx="0" cy="0" rx="30" ry="24" fill="#4c9a5a"/>
        <path d="M0 -20 L12 -6 L6 12 L-6 12 L-12 -6 Z" fill="#62b56f" stroke="#3b7d47" stroke-width="2"/>
      </g></g>
      <!-- 거품 -->
      <g class="bubbles">
        <circle cx="760" cy="300" r="6" fill="none" stroke="#e7fbff" stroke-width="2"/>
        <circle cx="790" cy="340" r="4" fill="none" stroke="#e7fbff" stroke-width="2"/>
        <circle cx="830" cy="320" r="8" fill="none" stroke="#e7fbff" stroke-width="2"/>
      </g>
    </g>
  </svg>`;
  setLevel(40, true);
}

// 해수면 0~100 → 물 표면 y좌표
export function setLevel(level, instant = false) {
  const y = 700 - 2.7 * level;
  ['water', 'waterBack'].forEach((id, i) => {
    const g = document.getElementById(id);
    if (!g) return;
    g.style.transition = instant ? 'none' : '';
    g.style.transform = `translateY(${y - (i ? 14 : 0)}px)`;
  });
  setMood(level);
}

export function setMood(level) {
  const svg = document.getElementById('sceneSvg');
  if (!svg) return;
  const mood = level < 45 ? 'happy' : level < 72 ? 'worry' : 'panic';
  svg.classList.remove('mood-happy', 'mood-worry', 'mood-panic');
  svg.classList.add('mood-' + mood);
  const storm = level >= 72 ? 1 : level >= 58 ? 0.55 : 0;
  document.getElementById('storm').style.opacity = storm;
  document.getElementById('stormSky').style.opacity = storm * 0.6;
}

// 라운드 결과 효과
export function effect(kind) {
  const fx = document.getElementById('fx');
  const svg = document.getElementById('sceneSvg');
  const sets = {
    good: ['💙', '🌱', '✨', '🐟', '💚', '🌏'],
    half: ['💦', '💧'],
    bad: ['💧', '💦', '🌧️']
  };
  const items = sets[kind] || [];
  const n = kind === 'good' ? 14 : kind === 'bad' ? 10 : 5;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'fx-item ' + kind;
    s.textContent = items[i % items.length];
    s.style.left = (35 + Math.random() * 30) + 'vw';
    s.style.top = (35 + Math.random() * 25) + 'vh';
    s.style.animationDelay = (Math.random() * 0.4) + 's';
    s.style.fontSize = (2 + Math.random() * 2) + 'vw';
    fx.appendChild(s);
    setTimeout(() => s.remove(), 2200);
  }
  if (kind === 'good') {
    svg.classList.add('cheer');
    setTimeout(() => svg.classList.remove('cheer'), 1200);
  }
  if (kind === 'bad') {
    svg.classList.add('shake');
    setTimeout(() => svg.classList.remove('shake'), 700);
  }
}

export function cheerMascot(country) {
  const wrap = document.getElementById(country === 'korea' ? 'mascotKorea' : 'mascotMalaysia');
  const el = wrap && wrap.querySelector('.mascot');
  if (!el) return;
  el.classList.remove('jump');
  void el.getBoundingClientRect();
  el.classList.add('jump');
}
