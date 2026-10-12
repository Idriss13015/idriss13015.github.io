/* Avatar Pikacheck — rendu SVG à partir de parts.json (style 2).
 * Même logique que lib/avatar/avatar_parts.dart (app). */
(function (root) {
  const VERSION = '2';
  const CAT = {
    t: 'skin', j: 'face', e: 'eyes', y: 'eyeColor', m: 'mouth', d: 'detail', b: 'beard', h: 'hair', c: 'hairColor',
    o: 'top', q: 'topColor', i: 'hold', k: 'hat', g: 'glasses', a: 'acc', n: 'pin', f: 'bg', r: 'frame',
  };
  const KEYS = Object.keys(CAT);

  function decode(code) {
    const cfg = {mons: []};
    KEYS.forEach(k => cfg[k] = 0);
    if (!code || code.split('.')[0] !== VERSION) return cfg;
    code.split('.').slice(1).forEach(f => {
      const k = f[0], v = f.slice(1);
      if (k === 'p') {
        cfg.mons = v.split(',').filter(Boolean).slice(0, 3).map(m => {
          const [id, x, y, s, fl] = m.split('~');
          return {id, x: +x || 50, y: +y || 50, s: +s || 100, flip: (+fl & 1) === 1, behind: (+fl & 2) === 2};
        });
      } else if (CAT[k]) cfg[k] = parseInt(v, 10) || 0;
    });
    return cfg;
  }

  function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
  function shade(c, f) {
    if (!c || c[0] !== '#') return c;
    return '#' + hex(c).map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))).toString(16).padStart(2, '0')).join('');
  }
  function lum(c) { const [r, g, b] = hex(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
  const pick = (parts, cat, i) => { const l = parts.cats[cat]; return l[i] || l[0]; };

  /** {bg, char} : le fond, puis le personnage sur fond transparent. */
  function render(parts, cfg, opt) {
    opt = opt || {};
    const uid = opt.uid || 'a';
    const P = (k) => pick(parts, CAT[k], cfg[k]);
    const skin = P('t'), face = P('j'), eyes = P('e'), ey = P('y'), beard = P('b'), hair = P('h'), hc = P('c');
    const top = P('o'), tc = P('q'), hold = P('i'), hat = P('k'), glasses = P('g'), acc = P('a');
    const B = parts.base, mood = opt.mood;
    const bgc = (opt.monType && parts.types[opt.monType]) || ['#c9c6ff', '#514df0'];
    const col = {
      dark: parts.dark,
      skin: `url(#sk${uid})`, skinF: skin.c, skinL: skin.l || shade(skin.c, 0.22), skinD: skin.d || shade(skin.c, -0.2), skinS: shade(skin.c, -0.32),
      hair: `url(#hr${uid})`, hairF: hc.c, hairL: hc.l || shade(hc.c, lum(hc.c) < 0.2 ? 0.32 : 0.4), hairD: hc.d || shade(hc.c, -0.35),
      brow: hc.b || (lum(hc.c) < 0.25 ? hc.c : shade(hc.c, -0.4)),
      top: `url(#tp${uid})`, topF: tc.c, topL: tc.l || shade(tc.c, 0.28), topD: tc.d || shade(tc.c, -0.28),
      iris: `url(#ir${uid})`, irisF: ey.c, irisL: shade(ey.c, 0.45), irisD: shade(ey.c, -0.55),
      face: face.d, bgA: bgc[0], bgB: bgc[1],
    };
    const fill = (s) => (s || '').replace(/\{(\w+)\}/g, (m, k) => col[k] !== undefined ? col[k] : m).replace(/\{uid\}/g, uid);
    const G = B.grad;
    const cover = !!hat.cover;
    const [browPath, browWidth] = B.brows[mood === 'down' ? 'w' : mood === 'up' ? 'h' : (eyes.b || 'n')];
    const mouthIdx = mood === 'up' ? B.mood.upMouth : mood === 'down' ? B.mood.downMouth : cfg.m;
    const mouth = pick(parts, 'mouth', mouthIdx);
    const blink = opt.blink && eyes.blink !== 0;
    const shadeFrag = cover ? hat.shade : hair.shade;
    const defs = [skin.g || G.sk, hc.g || G.hr, tc.g || G.tp, G.ir, G.hc, glasses.g].filter(Boolean).join('');
    const layers = [
      cover ? (hair.cb !== undefined ? hair.cb : hair.back) : hair.back,
      acc.back, top.back, B.neck, top.body, P('n').svg, acc.neck, hold.svg, B.ears, acc.ear, B.head,
      shadeFrag ? `<g clip-path="url(#hc{uid})" opacity=".42">${shadeFrag}</g>` : '',
      P('d').svg, beard.u,
      `<path d="${browPath}" stroke="{brow}" stroke-width="${browWidth}" stroke-linecap="round" fill="none"/>`,
      blink ? B.closed : eyes.svg,
      B.nose, mouth.svg, beard.o,
      cover ? (hair.cf !== undefined ? hair.cf : B.sides) : hair.front,
      hat.svg, glasses.svg, acc.head,
      mood === 'up' ? B.mood.up : mood === 'down' ? B.mood.down : '',
    ];
    const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${body}</svg>`;
    return {
      bg: svg(fill(P('f').svg)),
      char: svg(`<defs>${fill(defs)}</defs>` + layers.map(fill).join('')),
      bgAnim: P('f').anim || null,
      frame: P('r'),
    };
  }

  /** Construit l'avatar (fond, Pokémon et leur ombre, personnage, cadre)
   * dans [el]. av : {c: code, i: {id: url}, t: type du 1er Pokémon, p: PRO}. */
  let mounted = 0;
  function mount(el, parts, av) {
    const cfg = decode(av.c);
    // Identifiants uniques par avatar : plusieurs avatars sur une page.
    const n = mounted++;
    const r = render(parts, cfg, {uid: 'p' + n, monType: av.t});
    const closed = render(parts, cfg, {uid: 'q' + n, monType: av.t, blink: true}).char;
    const style = (r.frame && r.frame.sw) || 'none';
    el.className = 'pk-avatar' + (style !== 'none' ? ' pk-frame-' + style : '');
    const mon = (m, i) => {
      const url = av.i && av.i[m.id];
      if (!url) return '';
      const s = 50 * m.s / 100;
      return '<div class="pk-sh" style="left:' + (m.x - s * .3) + '%;top:' + (m.y + s * .4 - s * .065) + '%;width:' + (s * .6) + '%;height:' + (s * .13) + '%"></div>' +
        '<img class="pk-mon' + (m.flip ? ' pk-flip' : '') + '" alt="" onerror="this.remove()" src="' + url + '" style="left:' + (m.x - s / 2) + '%;top:' + (m.y - s / 2) + '%;width:' + s + '%;height:' + s + '%;animation-delay:' + (i * 1.1) + 's">';
    };
    el.innerHTML = '<div class="pk-in"><div class="pk-l">' + r.bg + '</div>' +
      (r.bgAnim ? '<div class="pk-l pk-fx-' + r.bgAnim + '"></div>' : '') +
      cfg.mons.map((m, i) => m.behind ? mon(m, i) : '').join('') +
      '<div class="pk-l pk-char"><div class="pk-l pk-open">' + r.char + '</div><div class="pk-l pk-closed">' + closed + '</div></div>' +
      cfg.mons.map((m, i) => m.behind ? '' : mon(m, i)).join('') + '</div>' +
      (av.p ? '<div class="pk-pro">PRO</div>' : '');
  }

  root.PikaAvatar = {decode, render, mount, KEYS, CAT, shade, VERSION};
})(typeof window !== 'undefined' ? window : globalThis);
