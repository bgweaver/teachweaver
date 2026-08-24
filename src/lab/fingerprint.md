---
name: "Did You Know Your Browser Says All This?"
order: 1
width: "col-lg-10"
---
No cookies, no login, no account. Just by loading this page, a website already knows more about you than
you'd guess. The checks below run automatically and never leave your browser. There's one optional check
further down that contacts two outside services to show you what they'd see.

<div id="fp-results"></div>

<div class="text-center my-4">
  <button id="net-check-btn" class="btn btn-primary btn-sm">Check what my connection reveals</button>
</div>
<div id="net-results"></div>

<p class="small text-center mt-3" style="color: rgba(255,255,255,0.55);">
  Want the deep version of this, checked against real data from other visitors? The EFF's
  <a class="text-secondary" href="https://coveryourtracks.eff.org/">Cover Your Tracks</a> does that.
</p>

<script>
(function () {
  const el = document.getElementById('fp-results');

  // Bootstrap's .text-muted resolves to a near-black color meant for light
  // backgrounds, and this site never sets a dark theme override -- so
  // .text-muted on a dark card is invisible. Using an explicit color here
  // instead of that class.
  function card(question, answer) {
    return `<div class="rounded-3 px-3 py-2 mb-2" style="background: rgba(255,255,255,0.05);">
      <span class="text-primary fw-bold small">Did you know</span>
      <span class="small" style="color: rgba(255,255,255,0.9);"> ${question}</span>
      <span class="small d-block mt-1" style="color: rgba(255,255,255,0.6);">${answer}</span>
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

  // Four compact cards instead of six -- related facts are combined into one
  // line each so this doesn't take over the page.
  const cards = [];

  cards.push(card(
    `a website can guess software you have installed just by testing which fonts render?`,
    fonts.length
      ? `Found ${fonts.length} of 10 tested: ${fonts.join(', ')}`
      : `None detected here, which itself is a little unusual.`
  ));

  cards.push(card(
    `your timezone and language settings can hint at where you live, with no GPS involved?`,
    `Yours: <strong>${tz || 'unknown'}</strong>, set to <strong>${langs}</strong>`
  ));

  cards.push(card(
    `your screen size and processor count are visible to every site, automatically?`,
    `Yours: <strong>${screen.width}&times;${screen.height}</strong> px${cores ? `, <strong>${cores}</strong> cores` : ''}`
  ));

  if (gl) {
    cards.push(card(
      `a website can read the exact model of your graphics card, without asking permission?`,
      `Yours reports itself as: <strong>${gl}</strong>`
    ));
  } else {
    cards.push(card(
      `most browsers let a website read your exact graphics card model?`,
      `Yours is hiding that here, which is your browser protecting you.`
    ));
  }

  el.innerHTML = cards.join('');
})();

(function () {
  const btn = document.getElementById('net-check-btn');
  const box = document.getElementById('net-results');

  function card(question, answer) {
    const d = document.createElement('div');
    d.className = 'rounded-3 px-3 py-2 mb-2';
    d.style.background = 'rgba(255,255,255,0.05)';
    d.innerHTML = `<span class="text-primary fw-bold small">Did you know</span>
      <span class="small" style="color: rgba(255,255,255,0.9);"> ${question}</span>
      <span class="small d-block mt-1" style="color: rgba(255,255,255,0.6);">${answer}</span>`;
    box.appendChild(d);
  }

  function note(html) {
    const d = document.createElement('div');
    d.className = 'small text-center py-2';
    d.style.color = 'rgba(255,255,255,0.55)';
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
        note("The lookup failed, was blocked, or timed out. If you run a tracker blocker, it may have just blocked a service whose entire business is location tracking.");
      }

      box.innerHTML = '';

      if (httpIp) {
        card(
          `just visiting a page tells that site roughly where you are, using nothing but your connection?`,
          place
            ? `You're browsing from near <strong>${place}</strong>. If that's not close to where you actually are, a VPN is doing its job.`
            : `This page can see your address, but couldn't pin down a city.`
        );
      }

      const raw = await getIceCandidates(3000);
      const { host, srflx } = parseCandidates(raw);

      if (srflx.length) {
        if (httpIp && srflx.includes(httpIp)) {
          card(
            `there's a second, separate way for a site to find your address, called WebRTC, that sometimes leaks past a VPN?`,
            `Good news: this second check came back with the exact same address, so nothing extra leaked here.`
          );
        } else if (httpIp) {
          card(
            `a VPN can hide you from most of the internet, but WebRTC has its own door that some VPNs forget to lock?`,
            `That just happened. The address above was <strong>${httpIp}</strong>, but this check found <strong>${srflx[0]}</strong> instead &mdash; likely your real ISP, leaking through the side door.`
          );
        }
      } else {
        card(
          `WebRTC can sometimes leak your real address even behind a VPN?`,
          `Yours didn't leak here, meaning your browser or an extension is blocking it.`
        );
      }

      if (host.length) {
        const raw192 = host.filter(a => /^\d+\.\d+\.\d+\.\d+$/.test(a));
        if (raw192.length) {
          card(
            `a site can sometimes see the private address your own router assigned you at home?`,
            `Yours is exposing it: <strong>${raw192[0]}</strong>. Most current browsers hide this by default.`
          );
        } else {
          card(
            `a site can sometimes see your home router's private address?`,
            `Yours is hidden behind a randomized name, which is your browser protecting you.`
          );
        }
      }
    } catch (e) {
      box.innerHTML = '';
      note('Something in this check failed unexpectedly. Not much to show, but at least the button still works.');
    } finally {
      btn.textContent = 'Check again';
      btn.disabled = false;
    }
  });
})();
</script>
