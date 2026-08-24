---
name: "Did You Know Your Browser Says All This?"
order: 1
width: "col-lg-10"
---
No cookies, no login, no account. Just by loading this page, a website already knows more about you than
you'd guess. The checks below run automatically and never leave your browser. There's one optional check
further down that does contact two outside services to show you what they'd see, and I'll explain exactly
what that means before it runs.

<div id="fp-results"></div>

<div class="text-center my-4">
  <button id="net-check-btn" class="btn btn-primary btn-sm">Did you know where the internet thinks you are?</button>
</div>
<div id="net-results"></div>

<p class="small text-muted text-center mt-3">
  Want the deep version of this, checked against real data from other visitors? The EFF's
  <a class="text-secondary" href="https://coveryourtracks.eff.org/">Cover Your Tracks</a> does that.
</p>

<script>
(function () {
  const el = document.getElementById('fp-results');

  function card(question, answer) {
    return `<div class="rounded-3 p-3 mb-2" style="background: rgba(255,255,255,0.05);">
      <div class="text-primary small fw-bold mb-1">Did you know...</div>
      <div class="text-light small">${question}</div>
      <div class="mt-2 pt-2 small text-muted" style="border-top: 1px solid rgba(255,255,255,0.08);">${answer}</div>
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
      if (!gl) return null;
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!dbg) return null;
      return gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || null;
    } catch (e) {
      return null;
    }
  }

  const fonts = detectFonts();
  const gl = webglInfo();
  const nav = navigator;
  const cores = nav.hardwareConcurrency;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const langs = (nav.languages || [nav.language]).join(', ');

  const cards = [];

  cards.push(card(
    'a website can guess a fair amount about what software you have installed just by quietly testing which fonts your browser can render?',
    fonts.length
      ? `This page found ${fonts.length} of the 10 fonts it checked for on your device: ${fonts.join(', ')}. Combined with everything else here, that's one more thing that makes your browser a little more identifiable.`
      : `This page couldn't detect any of the 10 fonts it checked for. Either your browser is blocking this kind of check, or it's just being cagey.`
  ));

  cards.push(card(
    'your exact screen size and zoom level get sent to every site you visit, automatically?',
    `Yours is ${screen.width}&times;${screen.height} pixels, zoomed to ${Math.round((window.devicePixelRatio || 1) * 100)}%. Not identifying on its own, but it's one more puzzle piece.`
  ));

  cards.push(card(
    'your timezone alone can narrow down roughly where in the world you are, no GPS needed?',
    `Yours is <strong>${tz || 'not detected'}</strong>.`
  ));

  cards.push(card(
    `the language your browser is set to can hint at where you're from, even if you never typed a word?`,
    `Yours is set to <strong>${langs}</strong>.`
  ));

  if (cores) {
    cards.push(card(
      'a website can tell how powerful your device is, right down to how many processor cores it has?',
      `Yours has <strong>${cores}</strong>. Combined with your screen size, that starts to narrow down what kind of device you're on.`
    ));
  }

  if (gl) {
    cards.push(card(
      'a website can read the exact model of your graphics card, without ever asking permission?',
      `Yours reports itself as: <strong>${gl}</strong>. That's a genuinely unusual thing for a website to know about your computer.`
    ));
  } else {
    cards.push(card(
      'most browsers let a website read your exact graphics card model, without asking permission?',
      `Yours is hiding that from this check, which is your browser (or an extension) actively protecting you.`
    ));
  }

  el.innerHTML = cards.join('');
})();

(function () {
  const btn = document.getElementById('net-check-btn');
  const box = document.getElementById('net-results');

  function card(question, answer) {
    const d = document.createElement('div');
    d.className = 'rounded-3 p-3 mb-2';
    d.style.background = 'rgba(255,255,255,0.05)';
    d.innerHTML = `<div class="text-primary small fw-bold mb-1">Did you know...</div>
      <div class="text-light small">${question}</div>
      <div class="mt-2 pt-2 small text-muted" style="border-top: 1px solid rgba(255,255,255,0.08);">${answer}</div>`;
    box.appendChild(d);
  }

  function note(html) {
    const d = document.createElement('div');
    d.className = 'small text-muted text-center py-2';
    d.innerHTML = html;
    box.appendChild(d);
  }

  // Gathers ICE candidates from a WebRTC connection attempt. A "host"
  // candidate is your home network's private address (modern browsers mask
  // this with a random-looking name instead of showing the real number). A
  // "srflx" candidate is your real public address as seen from outside your
  // network -- this is NOT masked, and does NOT travel through a VPN's
  // encrypted tunnel the way your normal browsing does.
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
        resolve(found);
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
    box.innerHTML = '';
    note('Looking this up now...');

    // Wrapping everything in try/finally guarantees the button resets no
    // matter what fails -- a stuck "Checking..." button is worse than an
    // honest error message.
    try {
      let httpIp = null, place = null;
      try {
        // A plain fetch() with no timeout will hang forever if something
        // (a tracker blocklist, most likely) silently drops the connection
        // instead of rejecting it. AbortController forces a real timeout.
        const controller = new AbortController();
        const abortTimer = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(abortTimer);
        const data = await res.json();
        httpIp = data.ip;
        place = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
      } catch (e) {
        box.innerHTML = '';
        note("The lookup failed, was blocked, or timed out. If you run a tracker blocker, it may have just blocked a service whose entire business is location tracking, which is a little bit funny.");
      }

      box.innerHTML = '';

      if (httpIp) {
        card(
          'just visiting a page tells that site roughly where you are, using nothing but your internet connection?',
          place
            ? `This page can see you're browsing from near <strong>${place}</strong>. If that's not close to where you actually are, a VPN or proxy is doing its job.`
            : `This page can see your address, but couldn't pin down a city for it.`
        );
      }

      const raw = await getIceCandidates(3000);
      const { host, srflx } = parseCandidates(raw);

      if (srflx.length) {
        if (httpIp && srflx.includes(httpIp)) {
          card(
            'there\'s a second, completely separate way for a website to find your address, called WebRTC, that sometimes leaks even when a VPN is hiding you everywhere else?',
            `Good news for you: this second check came back with the exact same address as before, so nothing extra leaked here.`
          );
        } else if (httpIp) {
          card(
            'a VPN can hide you from most of the internet, but a feature called WebRTC has its own separate door that some VPNs forget to lock?',
            `This is exactly what just happened. The address above was <strong>${httpIp}</strong>, but this second check found <strong>${srflx[0]}</strong> instead &mdash; a different address, most likely your real internet provider's, leaking through the side door. This exact mismatch is what dedicated "VPN leak test" tools check for.`
          );
        }
      } else {
        card(
          'a feature called WebRTC can sometimes leak your real address even when a VPN is hiding you everywhere else?',
          `Yours didn't leak anything through this path, which means your browser or an extension is blocking it.`
        );
      }

      if (host.length) {
        const raw192 = host.filter(a => /^\d+\.\d+\.\d+\.\d+$/.test(a));
        if (raw192.length) {
          card(
            'a website can sometimes see the private address your own router assigned you at home, like 192.168.x.x?',
            `Yours is exposing it: <strong>${raw192[0]}</strong>. Most current browsers hide this by default, so yours is either older or set up to allow it.`
          );
        } else {
          card(
            'a website can sometimes see the private address your own router assigned you at home?',
            `Yours is hidden behind a randomized name instead of the real number, which is your browser protecting you, working as intended.`
          );
        }
      }
    } catch (e) {
      box.innerHTML = '';
      note('Something in this check failed in a way I did not expect. Not much to show, but at least the button still works.');
    } finally {
      btn.textContent = 'Check again';
      btn.disabled = false;
    }
  });
})();
</script>
