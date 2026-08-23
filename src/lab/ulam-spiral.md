---
name: "Ulam Spiral Generator"
order: 2
width: "col-lg-10"
---
Plot the integers in a spiral and mark the primes, and they don't fall randomly. They cluster along diagonal
lines more than chance would predict. Nobody's turned that into a shortcut for factoring, but it's a genuinely
pretty pattern. This runs a Sieve of Eratosthenes client-side in your browser and walks the spiral live.

<div id="ulam-controls" class="d-flex flex-wrap gap-3 align-items-end mb-3 p-3 rounded-3" style="background: rgba(255,255,255,0.05);">
            <label class="d-flex flex-column gap-1 small text-light">
              Palette
              <select id="ulam-palette" class="form-select form-select-sm">
                <option value="fire">Fire</option>
                <option value="ice">Ice</option>
                <option value="neon">Neon</option>
                <option value="mono" selected>Mono (classic)</option>
                <option value="sunset">Sunset</option>
              </select>
            </label>
            <label class="d-flex flex-column gap-1 small text-light">
              Points across
              <input type="range" id="ulam-size" min="150" max="700" value="400" step="10">
            </label>
            <label class="d-flex flex-column gap-1 small text-light">
              Background
              <input type="color" id="ulam-bg" value="#050507">
            </label>
            <button id="ulam-regen" class="btn btn-primary btn-sm">Generate</button>
            <button id="ulam-download" class="btn btn-outline-light btn-sm">Download PNG</button>
          </div>

          <div class="d-flex justify-content-center">
            <canvas id="ulam-spiral" width="900" height="900" class="rounded-3" style="max-width: 100%; height: auto; background: #000;"></canvas>
          </div>
          <div id="ulam-status" class="text-center text-muted small py-3">Tap Generate to draw. Larger "points across" = finer detail, slower render.</div>

<script>
(function () {
  const canvas = document.getElementById('ulam-spiral');
  const ctx = canvas.getContext('2d');
  const statusEl = document.getElementById('ulam-status');

  function sieve(n) {
    const isComposite = new Uint8Array(n + 1);
    const primes = new Uint8Array(n + 1);
    for (let i = 2; i <= n; i++) {
      if (!isComposite[i]) {
        primes[i] = 1;
        for (let j = i * i; j <= n; j += i) {
          isComposite[j] = 1;
        }
      }
    }
    return primes;
  }

  function palette(name, t) {
    switch (name) {
      case 'fire':
        return `hsl(${20 + t * 30}, 100%, ${55 + t * 15}%)`;
      case 'ice':
        return `hsl(${190 + t * 40}, 90%, ${55 + t * 20}%)`;
      case 'neon':
        return `hsl(${(t * 360) % 360}, 100%, 60%)`;
      case 'sunset':
        return `hsl(${300 + t * 60}, 90%, ${50 + t * 20}%)`;
      case 'mono':
      default:
        return `rgba(255,255,255,${0.55 + t * 0.45})`;
    }
  }

  function draw() {
    const targetPointsAcross = parseInt(document.getElementById('ulam-size').value, 10);
    const bg = document.getElementById('ulam-bg').value;
    const pal = document.getElementById('ulam-palette').value;

    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const cell = Math.min(W, H) / targetPointsAcross;
    const ringsNeeded = Math.ceil(Math.max(W, H) / cell / 2) + 1;
    const side = ringsNeeded * 2 + 1;
    const n = side * side;

    statusEl.textContent = `Sieving up to ${n.toLocaleString()}...`;

    setTimeout(() => {
      const primes = sieve(n);

      let x = 0, y = 0;
      let dx = 1, dy = 0;
      let steps = 1;
      let turns = 0;
      const cx = W / 2, cy = H / 2;
      const maxIndex = n;

      let idx = 1;
      plotIfPrime(idx, x, y);

      while (idx < maxIndex) {
        for (let s = 0; s < steps; s++) {
          x += dx; y += dy;
          idx++;
          if (idx > maxIndex) break;
          plotIfPrime(idx, x, y);
        }
        const ndx = -dy, ndy = dx;
        dx = ndx; dy = ndy;
        turns++;
        if (turns % 2 === 0) steps++;
      }

      function plotIfPrime(value, gx, gy) {
        if (!primes[value]) return;
        const px = cx + gx * cell;
        const py = cy + gy * cell;
        if (px < -cell || py < -cell || px > W + cell || py > H + cell) return;
        const t = Math.min(1, Math.sqrt(gx * gx + gy * gy) / ringsNeeded);
        ctx.fillStyle = palette(pal, t);
        const r = Math.max(0.8, cell * 0.42);
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      statusEl.textContent = `Done, plotted primes up to ${n.toLocaleString()} (${side}×${side} grid).`;
    }, 30);
  }

  document.getElementById('ulam-regen').addEventListener('click', draw);
  document.getElementById('ulam-download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ulam-spiral.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  draw();
})();
</script>
