---
name: "What Your Browser (and Your Network) Leaks"
order: 1
width: "col-lg-10"
---
No cookies, no login, no tracking script, and a website can still learn more about you than you'd expect.
The passive checks below run automatically and never leave your browser. The network check is optional and
does contact two outside services to show you what they'd see, which I'll explain as it runs.

<div id="fp-results" class="rounded-3 p-4 mb-3" style="background: rgba(255,255,255,0.05);">
  <div class="text-center text-muted small">Checking...</div>
</div>

<div class="text-center mb-3">
  <button id="net-check-btn" class="btn btn-primary btn-sm">Where does the internet think I am?</button>
</div>
<div id="net-results" class="rounded-3 p-4" style="background: rgba(255,255,255,0.05); display:none;"></div>

<p class="small text-muted text-center mt-3">
  Curious how far this goes for real? The EFF's
  <a class="text-secondary" href="https://coveryourtracks.eff.org/">Cover Your Tracks</a> runs a much deeper
  version of this against a live dataset of other visitors.
</p>

<script>
(function () {
  const el = document.getElementById('fp-results');

  function row(label, value) {
    return `<div class="d-flex justify-content-between border-bottom py-2" style="border-color: rgba(255,255,255,0.08) !important;">
      <span class="text-muted small">${label}</span>
      <span class="text-light small text-end" style="max-width: 60%;">${value}</span>
    </div>`;
  }

  function detectFonts() {
    const testFonts = ['Arial', 'Georgia', 'Comic Sans MS', 'Impact', 'Courier New', 'Verdana',
                        'Trebuchet MS', 'Times New Roman', 'Segoe UI', 'Helvetica Neue'];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute; left:-9999px; font-size:72px; visibility:hidden;';
    span.textContent = testString;
    document.body.appendChild(span);

    const baseSizes = {};
    baseFonts.forEach(bf => {
      span.style.fontFamily = bf;
      baseSizes[bf] = { w: span.offsetWidth, h: span.offsetHeight };
    });

    const found = testFonts.filter(font => baseFonts.some(bf => {
      span.style.fontFamily = `"${font}", ${bf}`;
      return span.offsetWidth !== baseSizes[bf].w || span.offsetHeight !== baseSizes[bf].h;
    }));

    document.body.removeChild(span);
    return found;
  }

  function webglInfo() {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return 'unavailable';
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!dbg) return 'hidden by browser';
      return gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'unknown';
    } catch (e) {
      return 'blocked';
    }
  }

  const fonts = detectFonts();
  const gl = webglInfo();
  const nav = navigator;

  el.innerHTML = [
    row('Fonts detected', fonts.length ? `${fonts.length} of 10 tested &mdash; ${fonts.join(', ')}` : 'none (blocked, or none installed)'),
    row('Screen', `${screen.width}&times;${screen.height} @ ${window.devicePixelRatio || 1}x`),
    row('Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'),
    row('Languages', (nav.languages || [nav.language]).join(', ')),
    row('Hardware threads', nav.hardwareConcurrency || 'not reported'),
    row('WebGL renderer', gl),
  ].join('');
})();

(function () {
  const btn = document.getElementById('net-check-btn');
  const box = document.getElementById('net-results');

  function line(html) {
    const d = document.createElement('div');
    d.className = 'small py-1';
    d.innerHTML = html;
    box.appendChild(d);
  }

  // Gathers ICE candidates from a WebRTC connection attempt. "host" candidates
  // are your local network address (modern browsers mask these with a random
  // .local hostname). "srflx" candidates are your real public IP as seen by
  // the STUN server -- this is NOT masked, and is NOT routed through a VPN's
  // encrypted tunnel the way normal web traffic is.
  function getIceCandidates(timeoutMs) {
    return new Promise((resolve) => {
      const found = [];
      try {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        pc.createDataChannel('');
        pc.onicecandidate = (e) => { if (e.candidate) found.push(e.candidate.candidate); };
        pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {});
        setTimeout(() => { try { pc.close(); } catch (e) {} resolve(found); }, timeoutMs);
      } catch (e) {
        resolve([]);
      }
    });
  }

  function parseCandidates(raw) {
    const out = { host: new Set(), srflx: new Set() };
    raw.forEach(c => {
      const parts = c.split(' ');
      const address = parts[4];
      const typIdx = parts.indexOf('typ');
      const type = typIdx !== -1 ? parts[typIdx + 1] : null;
      if (type === 'host' || type === 'srflx') out[type].add(address);
    });
    return { host: [...out.host], srflx: [...out.srflx] };
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Checking...';
    box.style.display = 'block';
    box.innerHTML = '';

    line('<span class="text-muted">Asking ipapi.co what your HTTP request looks like from the outside (this is the same info every website\'s server logs quietly capture on every visit)...</span>');
    let httpIp = null, place = null;
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      httpIp = data.ip;
      place = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
    } catch (e) {
      line('<span class="text-muted">IP lookup failed or was blocked \u2014 an ad blocker doing its job is the most likely reason.</span>');
    }

    if (httpIp) {
      box.innerHTML = '';
      line(row('IP address (via HTTP)', `<code>${httpIp}</code>`));
      if (place) line(row('Approximate location', place));
      if (place) line(`<span class="text-muted">If that's not close to where you actually are, your VPN or proxy is doing its job for normal browsing.</span>`);
    }

    line('<span class="text-muted mt-2 d-block">Now checking what WebRTC leaks separately, over a different path than your normal traffic...</span>');
    const raw = await getIceCandidates(3000);
    const { host, srflx } = parseCandidates(raw);

    if (srflx.length) {
      srflx.forEach(ip => line(row('IP address (via WebRTC/STUN)', `<code>${ip}</code>`)));
      if (httpIp && srflx.includes(httpIp)) {
        line('<span style="color:#5fd68a;">These match. WebRTC isn\'t telling this site anything your normal connection didn\'t already.</span>');
      } else if (httpIp) {
        line('<span style="color:#e8b45f;">These do NOT match. If you think you\'re behind a VPN right now, this is your real ISP-assigned address leaking through a separate, unencrypted path. This exact mismatch is what VPN "leak tests" check for.</span>');
      }
    } else {
      line('<span style="color:#5fd68a;">No public IP leaked via WebRTC \u2014 your browser or an extension is blocking it.</span>');
    }

    if (host.length) {
      const raw192 = host.filter(a => /^\d+\.\d+\.\d+\.\d+$/.test(a));
      if (raw192.length) {
        raw192.forEach(ip => line(row('Local network address', `<code>${ip}</code>`)));
        line('<span class="text-muted">Your browser is exposing your raw local IP rather than masking it. Older, or configured to allow it.</span>');
      } else {
        line(row('Local network address', 'masked (.local hostname) &mdash; this is your browser protecting you, working as intended'));
      }
    }

    btn.textContent = 'Check again';
    btn.disabled = false;
  });
})();
</script>
