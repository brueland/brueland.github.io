/**
 * Pixel card deck.
 *
 * Two jobs:
 *   1. Paint each card's cover art. Every sprite below is a 16x16 grid of
 *      palette letters, drawn onto a 64x80 canvas over a procedural scene
 *      and scaled up with image-rendering: pixelated.
 *   2. Turn page scroll into a continuous position in the deck, then place
 *      every card from that one number. Cards ahead of you fan out behind
 *      the top card; the top card lifts, arcs over, and tucks into the back
 *      of the stack as you scroll past it.
 */
(function () {
  'use strict';

  // --------------------------------------------------------------- palette

  var PAL = {
    '.': null,          // transparent
    k: '#050D08',       // outline, green-black to match the phosphor ground
    d: '#16281D',
    s: '#2E4A3C',
    p: '#4F6E86',       // steel, the old purple
    l: '#9FC2D4',       // pale steel, the old lilac
    w: '#EAF6EC',
    h: '#B7C9BE',
    c: '#57C8E0',
    b: '#2E7FBF',
    t: '#1A4E73',
    o: '#E8A33D',
    y: '#FFD37A',
    r: '#D9564A',
    n: '#8B5A2B',
    m: '#5C3A1E',
    e: '#43C46E',
    f: '#1C6B39'
  };

  // ---------------------------------------------------------------- sprites
  //
  // 16 rows of exactly 16 characters, drawn with the palette letters above
  // ('.' is transparent). A short row draws nothing rather than erroring, so
  // count carefully -- or use tools/sprite-editor.html, which cannot produce
  // a malformed grid.
  //
  // Blank template to start from:
  //
  //   yourname: [
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................',
  //     '................',    '................'
  //   ],
  //
  // Then reference it from _data/projects.yml as `sprite: yourname`.

  var SPRITES = {
    planet: [
      '................',
      '................',
      '.....kkkkkk.....',
      '...kkccccccckk..',
      '..kcccccbbbbbtk.',
      '.kccccbbbbbbbtk.',
      '.kcccbbbbbbbbtk.',
      'kkccbbbbbbbbbttk',
      'yykkbbbbbbbbkkyy',
      '.yykbbbbbbbbtkyy',
      '..kbbbbbbbbbttk.',
      '..kkbbbbbbbttk..',
      '....kkkttttkk...',
      '......kkkkkk....',
      '................',
      '................'
    ],
    mech: [
      '................',
      '...k..kkkk..k...',
      '..kok..kbbk..kok',
      '..kok.kbbbbk.kok',
      '..kkkkkbbbbkkkkk',
      '.kobbbbbbbbbbok.',
      'kkobbbkkkkbbbokk',
      '.kobbkooookbbok.',
      '.kobbkooookbbok.',
      'kkobbbkkkkbbbokk',
      '.kobbbbbbbbbbok.',
      '..kkkkkbbbbkkkkk',
      '..kok.kbbbbk.kok',
      '..kok..kbbk..kok',
      '...k..kkkk..k...',
      '................'
    ],
    dog: [
      '................',
      '................',
      '..kk........kk..',
      '.knk........knk.',
      '.knkkkkkkkkkknk.',
      '.knnnnnnnnnnnnk.',
      '.knnwwnnnnwwnnk.',
      '.knnkwnnnnkwnnk.',
      '.knnnnnnnnnnnnk.',
      '.knnnnkkkknnnnk.',
      '.knnnkwwwwknnnk.',
      '..knnkkkkkknnk..',
      '...kknnnnnnkk...',
      '.....kkkkkk.....',
      '................',
      '................'
    ],
    fish: [
      '................',
      '................',
      '................',
      '......kkkk......',
      '.k...kccccck....',
      '.kk.kccccccckk..',
      '.kck.kcccccccck.',
      '.kcckkccccccwkck',
      '.kcckkccccccccck',
      '.kck.kcccccccck.',
      '.kk.kccccccckk..',
      '.k...kccccck....',
      '......kkkk......',
      '................',
      '................',
      '................'
    ],
    flask: [
      '................',
      '................',
      '.....kkkkkk.....',
      '.....khhhhk.....',
      '......khhk......',
      '......khhk......',
      '......khhk......',
      '.....khhhhk.....',
      '....khhhhhhk....',
      '...khefffffhk...',
      '..kheffffffehk..',
      '..khefffeffehk..',
      '..kkeeeeeeeekk..',
      '...kkkkkkkkkk...',
      '................',
      '................'
    ],
    spine: [
      '................',
      '.....kkkkkk.....',
      '....khhhhhhk....',
      '....khwwwwhk....',
      '.....kkkkkk.....',
      '......kkkk......',
      '....kkhhhhkk....',
      '...khhwwwwhhk...',
      '....kkhhhhkk....',
      '......kkkk......',
      '...kkkhhhhkkk...',
      '..khhhwwwwhhhk..',
      '...kkkhhhhkkk...',
      '.....kkkkkk.....',
      '................',
      '................'
    ],
    ball: [
      '................',
      '................',
      '.....kkkkkk.....',
      '...kkwwwwwwkk...',
      '..kwwwwkkwwwwk..',
      '.kwwwwkkkkwwwwk.',
      '.kwwwkkrrkkwwwk.',
      'kwwkkrrrrrrkkwwk',
      'kwwkkrrrrrrkkwwk',
      '.kwwwkkrrkkwwwk.',
      '.kwwwwkkkkwwwwk.',
      '..kwwwwkkwwwwk..',
      '...kkwwwwwwkk...',
      '.....kkkkkk.....',
      '................',
      '................'
    ],
    note: [
      '................',
      '....kkkkkkkkkkk.',
      '....klllllllllk.',
      '....klllllllkkk.',
      '....kkkkkkkkklk.',
      '....klk.....klk.',
      '....klk.....klk.',
      '....klk.....klk.',
      '....klk.....klk.',
      '..kkklk...kkklk.',
      '.kppplk..kppplk.',
      '.kppppk..kppppk.',
      '.kppppk..kppppk.',
      '.kkkkkk..kkkkkk.',
      '................',
      '................'
    ],
    house: [
      '................',
      '................',
      '.......kk.......',
      '......krrk......',
      '.....krrrrk.....',
      '....krrrrrrk....',
      '...krrrrrrrrk...',
      '..krrrrrrrrrrk..',
      '.kkkkkkkkkkkkkk.',
      '.knnnnnnnnnnnnk.',
      '.knkyyknnkyyknk.',
      '.knkyyknnkyyknk.',
      '.knnnnkmmknnnnk.',
      '.knnnnkmmknnnnk.',
      '.kkkkkkkkkkkkkk.',
      '................'
    ],
    squirrel: [
      '................',
      '..........kkk...',
      '.........knnnk..',
      '..kkk...knnnnnk.',
      '.knnk..knnkknnk.',
      '.knnnkknnk.knnk.',
      '.knwnknnk..knnk.',
      '.knnnnnnk..knnk.',
      '..knnnnnnk.knnk.',
      '..knnnnnnnkknnk.',
      '..knnnnnnnnnnnk.',
      '..knnnnnnnnnnk..',
      '..kknnkkknnkk...',
      '...kkk...kkk....',
      '................',
      '................'
    ]
  };

  // Backdrop palettes, keyed by the project's `kind`. Sky reads top to bottom.
  // One suit per CRT phosphor type, which is how four backdrops stay clearly
  // distinct without leaving the monochrome idea: P3 amber, P1 green,
  // P11 blue, P4 white. Sky reads top to bottom.
  var SCENES = {
    award: {                                  // P3 amber
      sky: ['#170F03', '#3A2708', '#8A5A12', '#E8A33D'],
      ground: '#120B02',
      groundLit: '#6B4410',
      star: '#FFE3AE'
    },
    jam: {                                    // P1 green
      sky: ['#05140B', '#0C2E19', '#1C6B39', '#43C46E'],
      ground: '#04100A',
      groundLit: '#17512F',
      star: '#B8F0C8'
    },
    experiment: {                             // P11 blue
      sky: ['#04101A', '#0B2A44', '#1A5C86', '#48A8D8'],
      ground: '#030C14',
      groundLit: '#134462',
      star: '#CBEDFF'
    },
    academic: {                               // P4 white
      sky: ['#0D1110', '#242B29', '#4E5A56', '#9FB0AA'],
      ground: '#0A0D0C',
      groundLit: '#3B4642',
      star: '#E8F0EC'
    }
  };;

  var ART_W = 64;          // logical pixels across; height follows the box
  var GROUND_LINE = 0.72;  // horizon as a fraction of canvas height

  // 4x4 ordered dither. Comparing a normalized threshold against the blend
  // factor is what gives the sky its stippled band edges instead of a ramp.
  var BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function rng(seed) {
    var a = (seed | 0) + 0x6d2b79f5;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function px(g, x, y, color, w, h) {
    if (!color) return;
    g.fillStyle = color;
    g.fillRect(x, y, w || 1, h || 1);
  }

  function drawSky(g, scene, horizon) {
    var stops = scene.sky;
    var last = stops.length - 1;
    for (var y = 0; y < horizon; y++) {
      var f = (y / (horizon - 1)) * last;
      var i = Math.min(Math.floor(f), last - 1);
      var blend = f - i;
      for (var x = 0; x < ART_W; x++) {
        var threshold = BAYER[y & 3][x & 3] / 16;
        px(g, x, y, blend > threshold ? stops[i + 1] : stops[i]);
      }
    }
  }

  function drawStars(g, scene, rand, horizon) {
    var count = 14 + Math.floor(rand() * 8);
    for (var i = 0; i < count; i++) {
      var x = Math.floor(rand() * ART_W);
      var y = Math.floor(rand() * Math.max(1, horizon - 12));
      px(g, x, y, scene.star);
      // A few stars get a one-pixel twinkle cross.
      if (rand() > 0.72) {
        px(g, x - 1, y, scene.star);
        px(g, x + 1, y, scene.star);
        px(g, x, y - 1, scene.star);
        px(g, x, y + 1, scene.star);
      }
    }
  }

  function drawGround(g, scene, rand, horizon, height) {
    var phase = rand() * 6.28;
    var phase2 = rand() * 6.28;
    for (var x = 0; x < ART_W; x++) {
      var hills =
        Math.sin(x * 0.19 + phase) * 3 +
        Math.sin(x * 0.07 + phase2) * 2.2;
      var top = Math.round(horizon + hills);
      px(g, x, top, scene.groundLit, 1, 2);
      px(g, x, top + 2, scene.ground, 1, height - top);
    }
  }

  function drawSprite(g, rows, ox, oy, scale) {
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      for (var x = 0; x < row.length; x++) {
        var color = PAL[row.charAt(x)];
        if (color) px(g, ox + x * scale, oy + y * scale, color, scale, scale);
      }
    }
  }

  // Paints one card face: backdrop, then the sprite standing on the horizon.
  // Takes the sprite grid directly so the editor can preview an unsaved one.
  function paintArt(canvas, rows, kind, seed, height) {
    var g = canvas.getContext('2d');
    if (!g) return;

    canvas.width = ART_W;
    canvas.height = height;
    g.imageSmoothingEnabled = false;

    var horizon = Math.round(height * GROUND_LINE);
    var scene = SCENES[kind] || SCENES.jam;
    var rand = rng(seed || 1);

    drawSky(g, scene, horizon);
    drawStars(g, scene, rand, horizon);
    drawGround(g, scene, rand, horizon, height);

    // Contact shadow, so the sprite sits on the hills instead of floating.
    g.globalAlpha = 0.45;
    px(g, 18, horizon - 4, '#000000', 28, 2);
    px(g, 21, horizon - 2, '#000000', 22, 1);
    g.globalAlpha = 1;

    // 16x16 sprite at 2x, standing on the horizon.
    drawSprite(g, rows, 16, horizon - 34, 2);
  }

  function paintCard(canvas) {
    // Match the canvas aspect to its box so the upscale stays square. The box
    // has no size while the deck is hidden, in which case there is nothing
    // worth painting yet.
    var boxW = canvas.offsetWidth;
    var boxH = canvas.offsetHeight;
    if (!boxW || !boxH) return;

    var height = Math.max(40, Math.round(ART_W * (boxH / boxW)));
    if (canvas.width === ART_W && canvas.height === height) return;

    paintArt(
      canvas,
      SPRITES[canvas.getAttribute('data-sprite')] || SPRITES.planet,
      canvas.getAttribute('data-kind'),
      parseInt(canvas.getAttribute('data-seed'), 10) || 1,
      height
    );
  }

  // ----------------------------------------------------------------- engine

  var VISIBLE = 4;     // stack depth drawn before cards fade out
  var EASE_IN = 0.2;   // how hard the deck chases the scroll position

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function init(stage) {
    var deck = stage.querySelector('[data-deck]');
    var sticky = stage.querySelector('.deck-sticky');
    var cards = [].slice.call(stage.querySelectorAll('[data-card]'));
    var panels = [].slice.call(stage.querySelectorAll('[data-panel]'));
    var pips = [].slice.call(stage.querySelectorAll('[data-pip]'));
    var prev = stage.querySelector('[data-deck-prev]');
    var next = stage.querySelector('[data-deck-next]');
    var count = cards.length;
    if (!deck || count === 0) return;

    var step = 1;
    var liftX = 120;   // how far left the flicked card swings
    var liftY = 110;   // how far up it swings
    var fanX = 10;     // per-card stagger of the stack
    var fanY = 14;
    var target = 0;
    var current = 0;
    var frame = 0;
    var activeIndex = -1;

    var shades = cards.map(function (card) {
      return card.querySelector('[data-shade]');
    });

    // A fixed, per-card tilt so the stack looks hand-stacked rather than
    // mechanically fanned. Faded in over the first card of depth, which keeps
    // whichever card is on top sitting square.
    var tilt = cards.map(function (_, i) {
      return (((i * 37) % 7) - 3) * 0.5;
    });

    // Where a card sits when it is `depth` cards back in the stack.
    function slot(depth, jitter) {
      var d = Math.min(depth, VISIBLE);
      return {
        x: -d * fanX,
        y: -d * fanY,
        rot: -d * 1.7 + (jitter || 0) * Math.min(depth, 1),
        scale: 1 - d * 0.03,
        shade: Math.min(0.62, d * 0.15),
        opacity: 1 - clamp(depth - VISIBLE, 0, 1),
        z: Math.round(1000 - depth * 10)
      };
    }

    function place(card, shade, s) {
      card.style.transform =
        'translate3d(' + s.x.toFixed(2) + 'px,' + s.y.toFixed(2) + 'px,0) ' +
        'rotate(' + s.rot.toFixed(2) + 'deg) ' +
        'scale(' + s.scale.toFixed(3) + ')';
      card.style.opacity = s.opacity.toFixed(3);
      card.style.zIndex = s.z;
      card.style.visibility = s.opacity <= 0.01 ? 'hidden' : 'visible';
      if (shade) shade.style.opacity = s.shade.toFixed(3);
    }

    function render(p) {
      for (var i = 0; i < count; i++) {
        // Wrap into (-1, count-1] so cards you scroll past reappear at the
        // back of the deck and the stack never looks half empty.
        var u = i - p;
        while (u <= -1) u += count;
        while (u > count - 1) u -= count;

        if (u >= 0) {
          place(cards[i], shades[i], slot(u, tilt[i]));
          continue;
        }

        // u in (-1, 0): the top card is being flicked to the back.
        var end = slot(count - 1, tilt[i]);   // where it lands
        var t = -u;
        var e = easeInOut(t);
        var arc = Math.sin(t * Math.PI);
        var fade = t < 0.55 ? 1 : lerp(1, end.opacity, (t - 0.55) / 0.45);

        place(cards[i], shades[i], {
          x: lerp(0, end.x, e) - arc * liftX,
          y: lerp(0, end.y, e) - arc * liftY,
          rot: lerp(0, end.rot, e) - arc * 12,
          scale: lerp(1, end.scale, e) + arc * 0.07,
          shade: lerp(0, end.shade, e),
          opacity: fade,
          // Rides over the deck on the way up, slips behind on the way down.
          z: t < 0.5 ? 3000 : Math.round(1000 - lerp(0, count - 1, e) * 10)
        });
      }

      // Below the halfway point the lifting card is still the star; past it,
      // the newly exposed card takes over.
      var frac = p - Math.floor(p);
      var wantActive = clamp(
        frac < 0.5 ? Math.floor(p) : Math.floor(p) + 1,
        0,
        count - 1
      );
      if (wantActive !== activeIndex) setActive(wantActive);
    }

    function setActive(i) {
      if (activeIndex >= 0) {
        cards[activeIndex].classList.remove('is-active');
        if (panels[activeIndex]) panels[activeIndex].classList.remove('is-active');
        if (pips[activeIndex]) {
          pips[activeIndex].classList.remove('is-active');
          pips[activeIndex].setAttribute('aria-current', 'false');
        }
      }
      activeIndex = i;
      cards[i].classList.add('is-active');
      if (panels[i]) panels[i].classList.add('is-active');
      if (pips[i]) {
        pips[i].classList.add('is-active');
        pips[i].setAttribute('aria-current', 'true');
      }
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === count - 1;
    }

    function tick() {
      var delta = target - current;
      if (Math.abs(delta) < 0.0004) {
        current = target;
        render(current);
        frame = 0;
        return;
      }
      current += delta * EASE_IN;
      render(current);
      frame = requestAnimationFrame(tick);
    }

    function kick() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function readScroll() {
      target = clamp(-stage.getBoundingClientRect().top / step, 0, count - 1);
    }

    function measure() {
      var arena = stage.querySelector('.deck-arena');
      step = Math.max(300, Math.round(window.innerHeight * 0.7));
      stage.style.height = step * (count - 1) + window.innerHeight + 'px';

      var box = deck.getBoundingClientRect();
      var clip = sticky.getBoundingClientRect();

      // Room measured against the sticky, because its overflow:hidden is what
      // actually clips. Measuring against the viewport would be wrong twice
      // over: the sticky may be narrower, and these run before it is pinned.
      var roomLeft = box.left - clip.left;
      var roomTop = box.top - clip.top;

      // The stack fans up and to the left, so it is bounded by the gutter on
      // those sides. Allow a couple of extra slots for the tilt on the
      // deepest card, which grows its box past the corner.
      fanX = Math.round(clamp(box.width * 0.05, 4, (roomLeft - 12) / (VISIBLE + 2)));
      fanY = Math.round(clamp(box.height * 0.035, 4, (roomTop - 12) / (VISIBLE + 2)));

      // At its apex the flicked card has travelled roughly half the fan, plus
      // the arc, plus whatever the tilt pushes past the corner. Fit the arc to
      // the gutter that is actually there, not to a fixed fraction of the card.
      var TILT = Math.sin((12 * Math.PI) / 180);
      liftX = Math.round(
        clamp(box.width * 0.30, 0, roomLeft - 2 * fanX - box.height * TILT - 28)
      );
      liftY = Math.round(
        clamp(box.height * 0.20, 0, roomTop - 2 * fanY - box.width * TILT - 28)
      );

      // The arena centres itself in the pinned viewport, which leaves a large
      // gap between the intro and the deck at the moment you land on the page.
      // Pulling the stage up closes it; the pinned state is untouched because
      // the sticky pins to top: 0 either way.
      var slack = (window.innerHeight - arena.offsetHeight) / 2;
      stage.style.marginTop = -Math.max(0, Math.round(slack * 0.62)) + 'px';


      // Plate height moves with the webfont, so the art aspect can change.
      cards.forEach(function (card) {
        var cv = card.querySelector('[data-card-art]');
        if (cv) paintCard(cv);
      });

      readScroll();
      current = target;
      render(current);
    }

    function goTo(i) {
      var top = stage.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: top + clamp(i, 0, count - 1) * step,
        behavior: 'smooth'
      });
    }

    // Deck is in view and owning the viewport.
    function isPinned() {
      var r = stage.getBoundingClientRect();
      return r.top <= 1 && r.bottom >= window.innerHeight - 1;
    }

    stage.classList.add('is-live');
    measure();

    window.addEventListener('scroll', function () {
      readScroll();
      kick();
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 120);
    });

    if (prev) prev.addEventListener('click', function () { goTo(activeIndex - 1); });
    if (next) next.addEventListener('click', function () { goTo(activeIndex + 1); });

    pips.forEach(function (pip, i) {
      pip.addEventListener('click', function () { goTo(i); });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
      if (!isPinned()) return;
      if (ev.key === 'ArrowRight') { goTo(activeIndex + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft') { goTo(activeIndex - 1); ev.preventDefault(); }
    });

    // Fonts land after first paint and change the plate height; re-measure.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
  }

  function boot() {
    [].forEach.call(document.querySelectorAll('[data-card-art]'), paintCard);

    var stage = document.querySelector('[data-deck-stage]');
    if (!stage) return;

    var reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion keeps the plain grid that is already in the markup.
    if (reduced || !('requestAnimationFrame' in window)) return;

    init(stage);
  }

  // Shared with tools/sprite-editor.html so it previews with the real
  // renderer rather than a second implementation that could drift.
  window.BrueDeckArt = {
    PAL: PAL,
    SPRITES: SPRITES,
    SCENES: SCENES,
    paintArt: paintArt,
    WIDTH: ART_W
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
