/* Avatar Pikacheck — rendu SVG à partir de avatar_parts.json.
 * Même logique que lib/avatar/avatar_render.dart (app). */
(function (root) {
  const KEYS = ['t', 'e', 'm', 'd', 'b', 'h', 'c', 'o', 'q', 'k', 'g', 'a', 'n', 'f', 'r'];
  const CAT = {t: 'skin', e: 'eyes', m: 'mouth', d: 'detail', b: 'beard', h: 'hair', c: 'hairColor', o: 'top', q: 'topColor', k: 'hat', g: 'glasses', a: 'acc', n: 'pin', f: 'bg', r: 'frame'};

  function decode(code) {
    const cfg = {mons: []};
    KEYS.forEach(k => cfg[k] = 0);
    if (!code || code.split('.')[0] !== '1') return cfg;
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

  /** {bg, char} : deux SVG (le fond, puis le personnage sur fond transparent). */
  function render(parts, cfg, opt) {
    opt = opt || {};
    const uid = opt.uid || 'a';
    const P = (cat) => pick(parts, cat, cfg[Object.keys(CAT).find(k => CAT[k] === cat)]);
    const skin = P('skin'), hc = P('hairColor'), tc = P('topColor'), hair = P('hair'), hat = P('hat');
    const eyes = P('eyes'), beard = P('beard'), top = P('top'), acc = P('acc'), glasses = P('glasses');
    const B = parts.base, mood = opt.mood;
    const hb = hc.c[0] === '#' ? hc.c : (hc.sw || '#8c89ff');
    const bgc = (opt.monType && parts.types[opt.monType]) || ['#8c89ff', '#514df0'];
    const col = {
      dark: parts.dark,
      skin: skin.c, skinD: skin.d || shade(skin.c, -0.16),
      hair: hc.c, hairD: hc.d || shade(hb, -0.25), hairL: hc.l || shade(hb, 0.35),
      brow: hc.b || (lum(hb) < 0.25 ? hb : shade(hb, -0.35)),
      top: tc.c, topD: tc.d || shade(tc.c, -0.22), topL: tc.l || shade(tc.c, 0.35),
      bgA: bgc[0], bgB: bgc[1],
    };
    const fill = (s) => (s || '').replace(/\{(\w+)\}/g, (m, k) => col[k] !== undefined ? col[k] : m).replace(/\{uid\}/g, uid);
    const cover = !!hat.cover;
    const browKey = mood === 'down' ? 'w' : mood === 'up' ? 'h' : (eyes.b || 'n');
    const mouthIdx = mood === 'up' ? B.mood.upMouth : mood === 'down' ? B.mood.downMouth : cfg.m;
    const mouth = pick(parts, 'mouth', mouthIdx);
    const blink = opt.blink && eyes.blink !== 0;
    const defs = [skin.g, hc.g, tc.g, glasses.g].filter(Boolean).join('');
    const layers = [
      cover ? (hair.cb !== undefined ? hair.cb : hair.back) : hair.back,
      top.back, B.neck, top.body, P('pin').svg, acc.neck, B.ears, acc.ear, B.head, P('detail').svg, beard.u,
      `<path d="${B.brows[browKey]}" stroke="{brow}" stroke-width="3.6" stroke-linecap="round" fill="none"/>`,
      blink ? B.closed : eyes.svg,
      mouth.svg, beard.o,
      cover ? (hair.cf !== undefined ? hair.cf : B.sides) : hair.front,
      hat.svg, glasses.svg, acc.head,
      mood === 'up' ? B.mood.up : mood === 'down' ? B.mood.down : '',
    ];
    const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${body}</svg>`;
    return {
      bg: svg(fill(P('bg').svg)),
      char: svg((defs ? `<defs>${fill(defs)}</defs>` : '') + layers.map(fill).join('')),
      bgAnim: P('bg').anim || null,
      frame: P('frame'),
    };
  }

  /** Construit l'avatar (fond, Pokémon, personnage, cadre) dans [el].
   * av : {c: code, i: {id: url}, t: type du 1er Pokémon}. */
  function mount(el, parts, av) {
    const cfg = decode(av.c);
    const r = render(parts, cfg, {uid: 'p', monType: av.t});
    const closed = render(parts, cfg, {uid: 'q', monType: av.t, blink: true}).char;
    const style = (r.frame && r.frame.sw) || 'none';
    el.className = 'pk-avatar' + (style !== 'none' ? ' pk-frame-' + style : '');
    const mon = (m, i) => {
      const url = av.i && av.i[m.id];
      if (!url) return '';
      const s = 50 * m.s / 100;
      return '<img class="pk-mon' + (m.flip ? ' pk-flip' : '') + '" alt="" onerror="this.remove()" src="' + url + '" style="left:' + (m.x - s / 2) + '%;top:' + (m.y - s / 2) + '%;width:' + s + '%;height:' + s + '%;animation-delay:' + (i * 1.1) + 's">';
    };
    el.innerHTML = '<div class="pk-in"><div class="pk-l">' + r.bg + '</div>' +
      (r.bgAnim ? '<div class="pk-l pk-fx-' + r.bgAnim + '"></div>' : '') +
      cfg.mons.map((m, i) => m.behind ? mon(m, i) : '').join('') +
      '<div class="pk-l pk-char"><div class="pk-l pk-open">' + r.char + '</div><div class="pk-l pk-closed">' + closed + '</div></div>' +
      cfg.mons.map((m, i) => m.behind ? '' : mon(m, i)).join('') + '</div>';
  }

  root.PikaAvatar = {decode, render, mount, KEYS, CAT, shade};
})(typeof window !== 'undefined' ? window : globalThis);
