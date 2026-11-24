(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav ---------- */
  const nav = document.getElementById("nav");
  const links = document.getElementById("navLinks");
  const toggle = document.getElementById("navToggle");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- reveal + counters ---------- */
  const countUp = el => {
    const target = +el.dataset.count;
    if (reduce) { el.textContent = target.toLocaleString(); return; }
    const start = performance.now(), dur = 1600;
    const tick = t => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    io.observe(el);
  });

  /* ---------- services tabs ---------- */
  const services = [
    { name: "Data Engineering", intro: "Build a modern, governed data foundation that every team — and every AI model — can trust.", items: [
      ["Data Strategy & Consulting", "Roadmaps tied to business value"],
      ["ETL/ELT Modernisation", "Migrate legacy pipelines to the lakehouse"],
      ["Data Integration & Governance", "Unity Catalog, Collibra, lineage & quality"],
      ["AI-Powered DataOps", "Automated, observable data pipelines"],
      ["Enterprise Data Analytics", "Unified analytics across SAP, ERP & CRM"],
      ["BI & Visualisation", "Power BI and Sigma at enterprise scale"] ] },
    { name: "AI / ML & GenAI", intro: "Move from experiments to production AI with governance, security and measurable ROI built in.", items: [
      ["Generative AI", "Copilots, agents and RAG on your data"],
      ["AIOps", "Intelligent operations and incident automation"],
      ["Predictive Analytics", "Structured ML for forecasting and risk"],
      ["Vision Framework", "Computer vision for safety and quality"],
      ["AI-powered Migration", "Use AI to accelerate modernisation"],
      ["AI Center of Excellence", "Operating model, MLOps and enablement"] ] },
    { name: "Cloud & Security", intro: "Secure, compliant cloud foundations designed for data-intensive workloads.", items: [
      ["Enterprise Landing Zone", "Well-architected, policy-driven foundations"],
      ["Cloud Migration", "Lift, re-platform or re-architect with confidence"],
      ["Security", "Zero-trust, identity and data protection"],
      ["Enterprise Integration", "APIs and event streaming with Confluent"] ] },
    { name: "SAP & Enterprise Analytics", intro: "Unlock SAP data for analytics and AI without breaking business semantics.", items: [
      ["SAP Datasphere", "Business-ready SAP data fabric"],
      ["SAP Business Data Cloud", "SAP data meets Databricks"],
      ["EPM Solutions", "Planning, budgeting and forecasting"],
      ["App Modernisation", "Re-engineer legacy apps for the cloud"] ] },
    { name: "Business Apps", intro: "Low-code apps and automation that put insights directly into everyday workflows.", items: [
      ["Power Apps", "Custom business apps, built fast"],
      ["Power Automate", "Workflow automation across systems"],
      ["Apps on Microsoft Teams", "Bring data and AI where people work"],
      ["CT Plan Apps on Sigma", "Collaborative planning in the warehouse"] ] }
  ];
  const tabs = document.getElementById("serviceTabs");
  const panel = document.getElementById("servicePanel");
  const render = i => {
    const s = services[i];
    tabs.querySelectorAll(".tab").forEach((t, j) => t.setAttribute("aria-selected", i === j));
    panel.innerHTML = `
      <div>
        <h3>${s.name}</h3>
        <p class="intro">${s.intro}</p>
        <a href="#contact" class="panel-cta">Talk to a ${s.name.split(" ")[0]} expert →</a>
      </div>
      <ul class="svc-list">${s.items.map((it, k) => `<li style="animation-delay:${k * 60}ms"><b>${it[0]}</b><span>${it[1]}</span></li>`).join("")}</ul>`;
  };
  services.forEach((s, i) => {
    const b = document.createElement("button");
    b.className = "tab"; b.role = "tab"; b.textContent = s.name;
    b.addEventListener("click", () => render(i));
    tabs.appendChild(b);
  });
  render(0);

  /* ---------- hero network canvas ---------- */
  const hc = document.getElementById("heroCanvas");
  const hx = hc.getContext("2d");
  let W, H, pts = [];
  const sizeHero = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hc.offsetWidth; H = hc.offsetHeight;
    hc.width = W * dpr; hc.height = H * dpr;
    hx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor(W * H / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  };
  const mouse = { x: -999, y: -999 };
  hc.parentElement.addEventListener("mousemove", e => { const r = hc.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  const drawHero = () => {
    hx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { hx.strokeStyle = `rgba(120,150,255,${(1 - d / 140) * .25})`; hx.beginPath(); hx.moveTo(a.x, a.y); hx.lineTo(b.x, b.y); hx.stroke(); }
      }
      const p = pts[i], dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 180) { hx.strokeStyle = `rgba(0,212,200,${(1 - dm / 180) * .6})`; hx.beginPath(); hx.moveTo(p.x, p.y); hx.lineTo(mouse.x, mouse.y); hx.stroke(); }
      hx.fillStyle = "rgba(180,200,255,.8)";
      hx.beginPath(); hx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); hx.fill();
    }
    if (!reduce) requestAnimationFrame(drawHero);
  };
  sizeHero(); drawHero();
  window.addEventListener("resize", sizeHero);

  /* ---------- dotted globe with offices ---------- */
  const gc = document.getElementById("globe");
  const gx = gc.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const S = 520; gc.width = S * dpr; gc.height = S * dpr; gx.scale(dpr, dpr);
  const R = 220, C = S / 2;
  const offices = [
    [26.9, 75.8, "Jaipur"], [28.5, 77.3], [18.5, 73.8], [12.97, 77.6], [17.4, 78.5], [23.0, 72.6],
    [1.35, 103.8, "Singapore"], [35.7, 139.8, "Tokyo"], [3.1, 101.7], [13.75, 100.5], [10.8, 106.7], [14.55, 121.0], [-33.86, 151.1, "Sydney"],
    [25.2, 55.3, "Dubai"], [24.45, 54.4], [24.7, 46.7],
    [51.5, -0.12, "London"], [47.17, 8.5], [52.37, 9.73], [59.33, 18.07],
    [29.76, -95.37, "Houston"], [43.65, -79.38, "Toronto"], [4.7, -74.07, "Bogotá"]
  ];
  // Fibonacci sphere dots
  const dots = Array.from({ length: 1400 }, (_, i) => {
    const y = 1 - (i / 1399) * 2, r = Math.sqrt(1 - y * y), t = i * 2.399963;
    return [Math.cos(t) * r, y, Math.sin(t) * r];
  });
  const toVec = (lat, lon) => {
    const la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
    return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
  };
  const offVecs = offices.map(o => ({ v: toVec(o[0], o[1]), label: o[2] }));
  const hq = offVecs[0].v;
  let rot = -1.3, tilt = 0.35;
  const project = ([x, y, z]) => {
    const cx = Math.cos(rot), sx = Math.sin(rot);
    let X = x * cx + z * sx, Z = -x * sx + z * cx;
    const ct = Math.cos(tilt), st = Math.sin(tilt);
    const Y = y * ct - Z * st; Z = y * st + Z * ct;
    return [C + X * R, C - Y * R, Z];
  };
  const drawGlobe = t => {
    gx.clearRect(0, 0, S, S);
    const g = gx.createRadialGradient(C - 60, C - 80, 20, C, C, R + 20);
    g.addColorStop(0, "rgba(37,99,255,.10)"); g.addColorStop(1, "rgba(124,58,237,.02)");
    gx.fillStyle = g; gx.beginPath(); gx.arc(C, C, R, 0, Math.PI * 2); gx.fill();
    for (const d of dots) {
      const [x, y, z] = project(d);
      if (z < 0) continue;
      gx.fillStyle = `rgba(80,100,160,${.12 + z * .35})`;
      gx.fillRect(x, y, 1.6, 1.6);
    }
    const [hx0, hy0, hz0] = project(hq);
    offVecs.forEach((o, i) => {
      const [x, y, z] = project(o.v);
      if (i > 0 && z > -0.1 && hz0 > -0.1) {
        const mx = (x + hx0) / 2, my = (y + hy0) / 2 - 60;
        gx.strokeStyle = "rgba(124,58,237,.35)"; gx.lineWidth = 1;
        gx.beginPath(); gx.moveTo(hx0, hy0); gx.quadraticCurveTo(mx, my, x, y); gx.stroke();
      }
      if (z < 0) return;
      const pulse = 4 + Math.sin(t / 400 + i) * 2;
      gx.fillStyle = "rgba(0,212,200,.25)"; gx.beginPath(); gx.arc(x, y, pulse + 3, 0, Math.PI * 2); gx.fill();
      gx.fillStyle = i === 0 ? "#7c3aed" : "#00b8ad"; gx.beginPath(); gx.arc(x, y, i === 0 ? 5 : 3.2, 0, Math.PI * 2); gx.fill();
      if (o.label && z > .25) { gx.fillStyle = "#0b1220"; gx.font = "600 12px Inter, sans-serif"; gx.fillText(o.label, x + 8, y - 6); }
    });
    if (!reduce) { rot += 0.0025; requestAnimationFrame(drawGlobe); }
  };
  requestAnimationFrame(drawGlobe);

  /* ---------- demo form ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(f => {
      const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    if (!ok) { note.textContent = "Please fill in the highlighted fields."; note.className = "form-note"; return; }
    note.textContent = "Thanks! In the live site this would route to a solution architect.";
    note.className = "form-note ok";
    form.reset();
  });
})();
