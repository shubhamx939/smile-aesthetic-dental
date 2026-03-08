import { useState, useEffect, useRef, useCallback } from "react";

// ── Google Fonts ──────────────────────────────────────────────
if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Poppins:wght@300;400;500;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap";
  document.head.appendChild(link);
}

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
  :root {
    --navy:      #0A1628;
    --navy-mid:  #1A3A5C;
    --teal:      #0ECFC4;
    --teal-dark: #09A099;
    --gold:      #C8A96A;
    --gold-light:#E5C98A;
    --mint:      #E8F4F3;
    --glass:     rgba(14,207,196,0.07);
    --glass2:    rgba(200,169,106,0.08);
    --white10:   rgba(255,255,255,0.10);
    --white20:   rgba(255,255,255,0.20);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; cursor: none; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--navy);
    color: var(--mint);
    font-family: 'Lora', serif;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, var(--teal), var(--gold)); border-radius: 2px; }

  .cursor-dot {
    position: fixed; top: 0; left: 0; width: 10px; height: 10px;
    background: var(--teal); border-radius: 50%; pointer-events: none;
    z-index: 9999; transform: translate(-50%,-50%);
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; width: 36px; height: 36px;
    border: 1.5px solid var(--gold); border-radius: 50%; pointer-events: none;
    z-index: 9998; transform: translate(-50%,-50%);
    transition: transform 0.14s ease;
  }

  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 900;
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 48px; transition: all 0.4s ease;
  }
  .navbar.scrolled {
    background: rgba(10,22,40,0.93);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(14,207,196,0.15);
    padding: 14px 48px;
    box-shadow: 0 4px 30px rgba(0,0,0,0.3);
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    background: linear-gradient(135deg, var(--teal), var(--gold-light), var(--teal));
    background-size: 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmerText 4s linear infinite; white-space: nowrap;
  }
  .nav-tabs { display: flex; gap: 6px; }
  .nav-tab {
    font-family: 'Poppins', sans-serif; font-size: 0.76rem; font-weight: 500;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 8px 18px; border-radius: 50px; border: 1px solid transparent;
    background: transparent; color: rgba(232,244,243,0.55); transition: all 0.3s ease;
  }
  .nav-tab:hover { color: var(--teal); border-color: rgba(14,207,196,0.25); }
  .nav-tab.active {
    color: var(--navy); border-color: var(--teal);
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    box-shadow: 0 0 18px rgba(14,207,196,0.4);
  }
  .nav-phone {
    font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600;
    color: var(--gold); text-decoration: none; letter-spacing: 0.04em;
    border: 1px solid rgba(200,169,106,0.3); padding: 8px 16px; border-radius: 50px;
    transition: all 0.3s;
  }
  .nav-phone:hover { background: rgba(200,169,106,0.1); }

  .mobile-nav {
    display: none; position: fixed; bottom: 0; left: 0; right: 0; z-index: 900;
    background: rgba(10,22,40,0.95); backdrop-filter: blur(16px);
    border-top: 1px solid rgba(14,207,196,0.15); padding: 8px 0 12px;
  }
  .mobile-nav-inner { display: flex; justify-content: space-around; }
  .mobile-tab {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    font-family: 'Poppins', sans-serif; font-size: 0.6rem; font-weight: 500;
    color: rgba(232,244,243,0.5); padding: 6px 10px; border-radius: 10px;
    border: none; background: transparent; transition: all 0.3s;
  }
  .mobile-tab.active { color: var(--teal); }
  .mobile-tab span:first-child { font-size: 1.2rem; }

  .page-wrap.page-out { animation: pageOut 0.25s ease forwards; }
  .page-wrap.page-in  { animation: pageIn  0.35s ease forwards; }

  @keyframes pageOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.97)} }
  @keyframes pageIn  { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }

  .hero {
    position: relative; height: 100vh; min-height: 640px;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .hero-canvas { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; }

  .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; animation: orbDrift 12s ease-in-out infinite alternate; }
  .orb1 { width:520px;height:520px;background:radial-gradient(circle,var(--teal) 0%,transparent 70%);top:-100px;left:-80px;animation-duration:14s; }
  .orb2 { width:440px;height:440px;background:radial-gradient(circle,var(--gold) 0%,transparent 70%);bottom:-60px;right:-60px;animation-duration:11s;animation-delay:-5s; }
  .orb3 { width:340px;height:340px;background:radial-gradient(circle,#1A3A5C 0%,transparent 70%);top:40%;left:40%;animation-duration:16s;animation-delay:-8s; }

  @keyframes orbDrift {
    0%   { transform:translate(0,0) scale(1) rotate(0deg); border-radius:50%; }
    33%  { transform:translate(40px,-30px) scale(1.1) rotate(60deg); border-radius:40% 60% 55% 45%; }
    66%  { transform:translate(-30px,40px) scale(0.95) rotate(120deg); border-radius:55% 45% 40% 60%; }
    100% { transform:translate(20px,20px) scale(1.05) rotate(180deg); border-radius:45% 55% 60% 40%; }
  }

  .hero-content { position:relative;z-index:2;text-align:center;padding:0 24px;max-width:860px; }
  .hero-badge {
    display:inline-flex;align-items:center;gap:8px;
    font-family:'Poppins',sans-serif;font-size:0.72rem;font-weight:600;
    letter-spacing:0.12em;text-transform:uppercase;color:var(--teal);
    border:1px solid rgba(14,207,196,0.3);padding:7px 18px;border-radius:50px;
    background:rgba(14,207,196,0.06);margin-bottom:24px;
    animation:fadeSlideIn 0.8s ease both;
  }
  .badge-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:pulse 2s ease-in-out infinite; }
  @keyframes pulse {
    0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 0 0 rgba(14,207,196,0.5);}
    50%{opacity:0.7;transform:scale(0.9);box-shadow:0 0 0 6px rgba(14,207,196,0);}
  }

  .hero-title {
    font-family:'Playfair Display',serif;
    font-size:clamp(2.6rem,6vw,5.2rem);font-weight:900;line-height:1.08;
    color:var(--mint);margin-bottom:18px;animation:fadeSlideIn 0.9s 0.1s ease both;
  }
  .shimmer-word {
    background:linear-gradient(135deg,var(--teal) 0%,var(--gold-light) 50%,var(--teal) 100%);
    background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:shimmerText 3s linear infinite;
  }
  @keyframes shimmerText { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  .hero-tagline {
    font-family:'Lora',serif;font-style:italic;font-size:clamp(1rem,2vw,1.25rem);
    color:rgba(232,244,243,0.7);margin-bottom:40px;animation:fadeSlideIn 1s 0.2s ease both;
  }
  .hero-btns { display:flex;gap:16px;justify-content:center;flex-wrap:wrap;animation:fadeSlideIn 1.1s 0.3s ease both; }

  .float-icon {
    position:absolute;font-size:2.4rem;z-index:1;pointer-events:none;
    animation:floatSin 6s ease-in-out infinite;
    filter:drop-shadow(0 0 12px rgba(14,207,196,0.4));
  }
  .float-icon:nth-child(1){top:18%;left:8%;animation-delay:0s;animation-duration:5.5s;}
  .float-icon:nth-child(2){top:22%;right:9%;animation-delay:-1.5s;animation-duration:7s;}
  .float-icon:nth-child(3){bottom:25%;left:10%;animation-delay:-3s;animation-duration:6.5s;}
  .float-icon:nth-child(4){bottom:20%;right:8%;animation-delay:-4.5s;animation-duration:5s;}
  @keyframes floatSin { 0%,100%{transform:translateY(0px) rotate(-8deg)} 50%{transform:translateY(-22px) rotate(8deg)} }

  .ribbon-wrap { overflow:hidden;padding:16px 0;border-top:1px solid rgba(14,207,196,0.1);border-bottom:1px solid rgba(14,207,196,0.1); }
  .ribbon-wrap.gold-ribbon { border-top-color:rgba(200,169,106,0.15);border-bottom-color:rgba(200,169,106,0.15); }
  .ribbon-track { display:flex;gap:0;white-space:nowrap;animation:ribbonScroll 28s linear infinite; }
  .ribbon-track.reverse { animation-direction:reverse;animation-duration:22s; }
  .ribbon-item { display:inline-flex;align-items:center;gap:18px;font-family:'Poppins',sans-serif;font-size:0.75rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;padding:0 28px; }
  .ribbon-item span { background:linear-gradient(90deg,var(--teal),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .ribbon-dot { color:var(--gold);opacity:0.5;font-size:0.5rem; }
  @keyframes ribbonScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .section { padding:90px 48px;max-width:1280px;margin:0 auto; }
  .section-label { font-family:'Poppins',sans-serif;font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--teal);margin-bottom:10px; }
  .section-title { font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3rem);font-weight:700;color:var(--mint);margin-bottom:16px;line-height:1.2; }
  .section-sub { font-family:'Lora',serif;font-size:1rem;font-style:italic;color:rgba(232,244,243,0.6);max-width:560px;line-height:1.7; }
  .section-header { margin-bottom:52px; }

  .cards-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px; }
  .cards-grid-2 { grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); }

  .tilt-card { border-radius:20px;overflow:hidden;border:1px solid rgba(14,207,196,0.1);transition:box-shadow 0.3s ease;transform-style:preserve-3d;will-change:transform; }
  .card-inner { padding:28px;height:100%; }
  .card-emoji { font-size:2.4rem;margin-bottom:14px;display:block; }
  .card-badge { display:inline-block;font-family:'Poppins',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:50px;margin-bottom:14px; }
  .badge-teal { background:rgba(14,207,196,0.15);color:var(--teal);border:1px solid rgba(14,207,196,0.3); }
  .badge-gold { background:rgba(200,169,106,0.15);color:var(--gold);border:1px solid rgba(200,169,106,0.3); }
  .badge-mint { background:rgba(232,244,243,0.08);color:var(--mint);border:1px solid rgba(232,244,243,0.2); }
  .card-name { font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:var(--mint);margin-bottom:6px;line-height:1.3; }
  .card-cat { font-family:'Poppins',sans-serif;font-size:0.72rem;font-weight:500;color:rgba(232,244,243,0.45);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px; }
  .card-desc { font-family:'Lora',serif;font-size:0.9rem;color:rgba(232,244,243,0.65);line-height:1.6;margin-bottom:20px; }
  .card-price { font-family:'Poppins',sans-serif;font-size:0.95rem;font-weight:700;color:var(--gold);margin-bottom:18px; }
  .card-img { width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:18px;filter:brightness(0.85) saturate(1.1); }

  .mag-btn { display:inline-flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:14px 32px;border-radius:50px;border:none;transition:box-shadow 0.3s,transform 0.15s;will-change:transform;text-decoration:none; }
  .mag-btn.primary { background:linear-gradient(135deg,var(--teal),var(--teal-dark));color:var(--navy);box-shadow:0 0 24px rgba(14,207,196,0.35); }
  .mag-btn.primary:hover { box-shadow:0 0 40px rgba(14,207,196,0.6); }
  .mag-btn.secondary { background:transparent;color:var(--mint);border:1.5px solid rgba(232,244,243,0.25); }
  .mag-btn.secondary:hover { border-color:var(--gold);color:var(--gold); }
  .mag-btn.gradient { background:linear-gradient(135deg,var(--gold),#A0824A,var(--gold));background-size:200%;color:var(--navy);animation:shimmerText 3s linear infinite;box-shadow:0 0 24px rgba(200,169,106,0.35); }
  .mag-btn.gradient:hover { box-shadow:0 0 40px rgba(200,169,106,0.6); }
  .mag-btn.small { padding:10px 20px;font-size:0.72rem; }

  .counters { display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(14,207,196,0.08);border:1px solid rgba(14,207,196,0.1);border-radius:20px;overflow:hidden;margin:60px 0; }
  .counter-cell { padding:36px 24px;text-align:center;background:rgba(10,22,40,0.8);transition:background 0.3s; }
  .counter-cell:hover { background:rgba(14,207,196,0.06); }
  .counter-num { font-family:'Playfair Display',serif;font-size:3rem;font-weight:900;background:linear-gradient(135deg,var(--teal),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1; }
  .counter-label { font-family:'Poppins',sans-serif;font-size:0.72rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,244,243,0.45);margin-top:8px; }

  .process-strip { display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin:60px 0; }
  .process-step { padding:36px 28px;background:var(--glass);border:1px solid rgba(14,207,196,0.08);position:relative;overflow:hidden;transition:all 0.3s; }
  .process-step:first-child { border-radius:20px 0 0 20px; }
  .process-step:last-child  { border-radius:0 20px 20px 0; }
  .process-step:hover { background:rgba(14,207,196,0.1);border-color:rgba(14,207,196,0.2); }
  .step-num { position:absolute;right:16px;top:12px;font-family:'Playfair Display',serif;font-size:4.5rem;font-weight:900;color:rgba(14,207,196,0.06);line-height:1;user-select:none; }
  .step-emoji { font-size:1.8rem;margin-bottom:12px; }
  .step-title { font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--mint);margin-bottom:8px; }
  .step-desc { font-family:'Lora',serif;font-size:0.85rem;color:rgba(232,244,243,0.55);line-height:1.6; }

  .cta-banner { position:relative;overflow:hidden;background:linear-gradient(135deg,var(--navy-mid),#0D2040,var(--navy-mid));border:1px solid rgba(14,207,196,0.15);border-radius:24px;padding:64px 56px;text-align:center;margin:60px 0; }
  .cta-banner::before { content:'';position:absolute;inset:0;background-image:radial-gradient(rgba(14,207,196,0.07) 1.5px,transparent 1.5px);background-size:24px 24px;pointer-events:none; }
  .cta-banner-title { font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:900;color:var(--mint);margin-bottom:16px;position:relative; }
  .cta-banner-sub { font-family:'Lora',serif;font-size:0.95rem;font-style:italic;color:rgba(232,244,243,0.6);margin-bottom:36px;position:relative; }
  .cta-btns { display:flex;gap:16px;justify-content:center;flex-wrap:wrap;position:relative; }

  .quote-mark { font-family:'Playfair Display',serif;font-size:4rem;line-height:0.5;opacity:0.25;margin-bottom:16px;display:block; }
  .review-text { font-family:'Lora',serif;font-size:0.93rem;font-style:italic;color:rgba(232,244,243,0.8);line-height:1.7;margin-bottom:20px; }
  .reviewer-name { font-family:'Poppins',sans-serif;font-size:0.82rem;font-weight:600;color:var(--mint); }
  .reviewer-meta { font-family:'Poppins',sans-serif;font-size:0.72rem;color:rgba(232,244,243,0.4);margin-top:3px; }
  .stars { color:var(--gold);font-size:0.85rem;letter-spacing:2px;margin-bottom:12px; }

  .about-grid { display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start; }
  .about-left { position:relative;background:var(--glass);border:1px solid rgba(14,207,196,0.12);border-radius:24px;overflow:hidden;min-height:500px;padding:40px; }
  .about-year { position:absolute;bottom:-20px;right:-10px;font-family:'Playfair Display',serif;font-size:8rem;font-weight:900;line-height:1;color:rgba(14,207,196,0.04);user-select:none;pointer-events:none; }
  .about-est { display:inline-flex;align-items:center;gap:8px;font-family:'Poppins',sans-serif;font-size:0.68rem;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(200,169,106,0.25);padding:6px 16px;border-radius:50px;background:rgba(200,169,106,0.06);margin-bottom:20px; }
  .about-headline { font-family:'Playfair Display',serif;font-style:italic;font-size:1.6rem;font-weight:600;color:var(--mint);line-height:1.4;margin-bottom:28px; }
  .about-stats { display:flex;gap:20px;flex-wrap:wrap; }
  .about-stat-num { font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;background:linear-gradient(135deg,var(--teal),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .about-stat-lbl { font-family:'Poppins',sans-serif;font-size:0.68rem;font-weight:500;color:rgba(232,244,243,0.45);letter-spacing:0.1em;text-transform:uppercase; }
  .about-p { font-family:'Lora',serif;font-size:0.95rem;color:rgba(232,244,243,0.7);line-height:1.8;margin-bottom:20px; }
  .feature-cards { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px; }
  .feature-card { background:var(--glass);border:1px solid rgba(14,207,196,0.1);border-radius:16px;padding:20px;backdrop-filter:blur(8px);transition:border-color 0.3s,background 0.3s; }
  .feature-card:hover { border-color:rgba(14,207,196,0.25);background:rgba(14,207,196,0.06); }
  .feature-card-icon { font-size:1.5rem;margin-bottom:8px; }
  .feature-card-title { font-family:'Poppins',sans-serif;font-size:0.82rem;font-weight:600;color:var(--mint);margin-bottom:5px; }
  .feature-card-desc { font-family:'Lora',serif;font-size:0.8rem;color:rgba(232,244,243,0.5);line-height:1.5; }

  .values-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:48px; }
  .value-cell { background:var(--glass2);border:1px solid rgba(200,169,106,0.1);border-radius:20px;padding:28px 20px;text-align:center;transition:all 0.3s; }
  .value-cell:hover { background:rgba(200,169,106,0.1);border-color:rgba(200,169,106,0.25);transform:translateY(-4px); }
  .value-icon { font-size:2rem;margin-bottom:12px; }
  .value-title { font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--gold);margin-bottom:8px; }
  .value-desc { font-family:'Lora',serif;font-size:0.82rem;color:rgba(232,244,243,0.5);line-height:1.5; }

  .masonry { columns:3;gap:18px; }
  .masonry-item { break-inside:avoid;margin-bottom:18px;border-radius:18px;overflow:hidden;border:1px solid rgba(14,207,196,0.08);transition:all 0.3s; }
  .masonry-item:hover { border-color:rgba(14,207,196,0.3);transform:translateY(-4px); }
  .masonry-card { padding:28px;min-height:160px;display:flex;flex-direction:column;justify-content:flex-end;position:relative; }
  .masonry-item:nth-child(1) .masonry-card{background:linear-gradient(145deg,#0D2A2A,#0A1628);min-height:200px}
  .masonry-item:nth-child(2) .masonry-card{background:linear-gradient(145deg,#1A2A0D,#0A1628);min-height:260px}
  .masonry-item:nth-child(3) .masonry-card{background:linear-gradient(145deg,#2A1A0D,#0A1628);min-height:180px}
  .masonry-item:nth-child(4) .masonry-card{background:linear-gradient(145deg,#0D1A2A,#0A1628);min-height:250px}
  .masonry-item:nth-child(5) .masonry-card{background:linear-gradient(145deg,#1A0D2A,#0A1628);min-height:190px}
  .masonry-item:nth-child(6) .masonry-card{background:linear-gradient(145deg,#0A2A1A,#0A1628);min-height:240px}
  .masonry-item:nth-child(7) .masonry-card{background:linear-gradient(145deg,#2A0D1A,#0A1628);min-height:180px}
  .masonry-item:nth-child(8) .masonry-card{background:linear-gradient(145deg,#1A1A0A,#0A1628);min-height:200px}
  .masonry-item:nth-child(9) .masonry-card{background:linear-gradient(145deg,#0A1A2A,#0A1628);min-height:210px}
  .masonry-emoji { font-size:2.2rem;margin-bottom:10px; }
  .masonry-name { font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--mint);margin-bottom:6px; }
  .masonry-bar { height:3px;border-radius:2px;margin-top:10px; }

  .contact-grid { display:grid;grid-template-columns:1fr 1fr;gap:40px; }
  .contact-left { background:var(--glass);border:1px solid rgba(14,207,196,0.1);border-radius:24px;padding:40px;position:relative;overflow:hidden; }
  .contact-right { background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:24px;padding:40px;backdrop-filter:blur(12px); }
  .detail-row { display:flex;align-items:flex-start;gap:16px;margin-bottom:24px; }
  .detail-icon { width:42px;height:42px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem; }
  .detail-icon.teal { background:rgba(14,207,196,0.15); }
  .detail-icon.gold { background:rgba(200,169,106,0.15); }
  .detail-label { font-family:'Poppins',sans-serif;font-size:0.68rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(232,244,243,0.4);margin-bottom:3px; }
  .detail-val { font-family:'Lora',serif;font-size:0.92rem;color:var(--mint);line-height:1.5; }
  .social-links { display:flex;gap:10px;flex-wrap:wrap;margin-top:28px; }
  .social-link { display:inline-flex;align-items:center;gap:7px;font-family:'Poppins',sans-serif;font-size:0.72rem;font-weight:600;padding:8px 16px;border-radius:50px;text-decoration:none;transition:all 0.3s; }
  .social-link.ig { background:rgba(193,53,132,0.12);color:#E1306C;border:1px solid rgba(193,53,132,0.25); }
  .social-link.fb { background:rgba(24,119,242,0.1);color:#1877F2;border:1px solid rgba(24,119,242,0.25); }
  .social-link:hover { filter:brightness(1.2);transform:translateY(-2px); }

  .form-group { margin-bottom:20px; }
  .form-label { font-family:'Poppins',sans-serif;font-size:0.72rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(232,244,243,0.5);margin-bottom:8px;display:block; }
  .form-input,.form-select,.form-textarea { width:100%;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:var(--mint);font-family:'Lora',serif;font-size:0.92rem;transition:border-color 0.3s,background 0.3s;outline:none; }
  .form-input:focus,.form-select:focus,.form-textarea:focus { border-color:var(--teal);background:rgba(14,207,196,0.05); }
  .form-select option { background:#0A1628;color:var(--mint); }
  .form-textarea { resize:vertical;min-height:110px; }
  .form-success { text-align:center;padding:40px 20px;animation:fadeSlideIn 0.5s ease; }
  .form-success-icon { font-size:3rem;margin-bottom:16px; }
  .form-success-title { font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:var(--teal);margin-bottom:12px; }
  .form-success-p { font-family:'Lora',serif;font-size:0.92rem;color:rgba(232,244,243,0.6); }

  .map-panel { background:linear-gradient(135deg,var(--navy-mid),var(--navy));border:1px solid rgba(14,207,196,0.1);border-radius:20px;padding:40px 48px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;margin-top:48px; }
  .map-addr { font-family:'Lora',serif;font-size:1rem;color:rgba(232,244,243,0.7);line-height:1.6;font-style:italic; }

  footer { background:#060E1A;padding:50px 48px 36px;position:relative; }
  footer::before { content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--teal),var(--gold),var(--teal),transparent); }
  .footer-inner { max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px; }
  .footer-logo { font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;background:linear-gradient(135deg,var(--teal),var(--gold-light));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
  .footer-tagline { font-family:'Lora',serif;font-size:0.82rem;font-style:italic;color:rgba(232,244,243,0.4);margin-top:6px; }
  .footer-links { display:flex;gap:20px;flex-wrap:wrap; }
  .footer-link { font-family:'Poppins',sans-serif;font-size:0.75rem;font-weight:500;color:rgba(232,244,243,0.45);text-transform:uppercase;letter-spacing:0.08em;transition:color 0.3s;text-decoration:none; }
  .footer-link:hover { color:var(--teal); }
  .footer-copy { font-family:'Poppins',sans-serif;font-size:0.7rem;color:rgba(232,244,243,0.25);margin-top:28px;text-align:center;max-width:1280px;margin:28px auto 0; }

  @keyframes fadeSlideIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideInLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  .anim-1{animation:fadeSlideIn 0.7s 0.0s ease both}
  .anim-2{animation:fadeSlideIn 0.7s 0.1s ease both}
  .anim-3{animation:fadeSlideIn 0.7s 0.2s ease both}
  .anim-4{animation:fadeSlideIn 0.7s 0.3s ease both}
  .slide-l{animation:slideInLeft  0.7s 0.1s ease both}
  .slide-r{animation:slideInRight 0.7s 0.15s ease both}

  .sub-hero { height:340px;position:relative;display:flex;align-items:center;overflow:hidden;padding:0 48px; }
  .sub-hero-content { position:relative;z-index:2; }
  .sub-hero-title { font-family:'Playfair Display',serif;font-size:clamp(2rem,5vw,3.8rem);font-weight:900;color:var(--mint);line-height:1.1; }
  .sub-hero-sub { font-family:'Lora',serif;font-style:italic;font-size:1rem;color:rgba(232,244,243,0.6);margin-top:12px; }

  @media(max-width:900px){
    .counters{grid-template-columns:repeat(2,1fr)}
    .process-strip{grid-template-columns:repeat(2,1fr)}
    .values-grid{grid-template-columns:repeat(2,1fr)}
    .about-grid{grid-template-columns:1fr}
    .masonry{columns:2}
    .contact-grid{grid-template-columns:1fr}
  }
  @media(max-width:768px){
    .navbar{padding:14px 20px}
    .navbar.scrolled{padding:10px 20px}
    .nav-tabs{display:none}
    .nav-phone{font-size:0.7rem;padding:6px 12px}
    .mobile-nav{display:block}
  }
  @media(max-width:600px){
    .section{padding:60px 20px}
    .sub-hero{padding:0 20px}
    .masonry{columns:1}
    .cards-grid{grid-template-columns:1fr}
    .hero-title{font-size:2.2rem}
    .cta-banner{padding:40px 24px}
    footer{padding:40px 20px 90px}
    .map-panel{flex-direction:column;padding:28px}
    .footer-inner{flex-direction:column;gap:12px}
    .feature-cards{grid-template-columns:1fr}
    .process-strip{grid-template-columns:1fr}
    .values-grid{grid-template-columns:1fr 1fr}
  }
`;

// ─── PARTICLE CANVAS ─────────────────────────────────────────
function ParticleCanvas({ colors = ["#0ECFC4", "#C8A96A", "#1A3A5C"] }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 55;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.phase += 0.01;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const a = 0.35 + 0.35 * Math.sin(p.phase);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx*dx+dy*dy);
        if (d < 90) {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(14,207,196,${(1 - d/90) * 0.18})`; ctx.lineWidth = 0.7; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} className="hero-canvas" />;
}

// ─── MAG BUTTON ──────────────────────────────────────────────
function MagBtn({ children, variant = "primary", onClick, href, target, size }) {
  const ref = useRef(null);
  const mv = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-(r.left+r.width/2))*0.22}px,${(e.clientY-(r.top+r.height/2))*0.22}px)`;
  }, []);
  const ml = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  const cls = `mag-btn ${variant}${size==="small"?" small":""}`;
  if (href) return <a ref={ref} href={href} target={target} className={cls} onMouseMove={mv} onMouseLeave={ml}>{children}</a>;
  return <button ref={ref} className={cls} onClick={onClick} onMouseMove={mv} onMouseLeave={ml}>{children}</button>;
}

// ─── TILT CARD ────────────────────────────────────────────────
function TiltCard({ children, style, className = "" }) {
  const ref = useRef(null);
  const mv = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-0.5)*18, y = ((e.clientY-r.top)/r.height-0.5)*18;
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
    el.style.boxShadow = `${-x*1.5}px ${y*1.5}px 40px rgba(0,0,0,0.4)`;
  }, []);
  const ml = useCallback(() => {
    if (ref.current) { ref.current.style.transform="perspective(800px) rotateY(0) rotateX(0)"; ref.current.style.boxShadow=""; }
  }, []);
  return <div ref={ref} className={`tilt-card ${className}`} style={style} onMouseMove={mv} onMouseLeave={ml}>{children}</div>;
}

// ─── COUNTER ─────────────────────────────────────────────────
function Counter({ to, suffix = "", prefix = "" }) {
  const [n, setN] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      const s = performance.now(); const dur = 1800;
      const tick = (now) => {
        const t = Math.min((now-s)/dur,1); setN(Math.round((1-Math.pow(1-t,3))*to));
        if (t<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },{threshold:0.3});
    obs.observe(el); return ()=>obs.disconnect();
  }, [to]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

// ─── RIBBON ──────────────────────────────────────────────────
const ribbonWords = ["Smile Makeover","Dental Implants","Teeth Whitening","Porcelain Veneers","Clear Aligners","Root Canal","Gum Treatment","Crowns & Bridges","Orthodontics","Pediatric Dentistry"];
function Ribbon({ reverse, goldStyle }) {
  const items = [...ribbonWords, ...ribbonWords];
  return (
    <div className={`ribbon-wrap${goldStyle?" gold-ribbon":""}`}>
      <div className={`ribbon-track${reverse?" reverse":""}`}>
        {items.map((w,i)=><span key={i} className="ribbon-item"><span>{w}</span><span className="ribbon-dot">◆</span></span>)}
      </div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────
const TREATMENTS = [
  { emoji:"✨",badge:"BESTSELLER",badgeCls:"badge-teal",name:"Smile Makeover",cat:"Cosmetic Dentistry",desc:"Complete smile transformation combining veneers, whitening, and contouring for a perfectly balanced, radiant smile.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80",bg:"linear-gradient(145deg,#0D2A28,#0A1628)"},
  { emoji:"💎",badge:"POPULAR",badgeCls:"badge-gold",name:"Porcelain Veneers",cat:"Aesthetic Restoration",desc:"Ultra-thin custom porcelain shells bonded to teeth surfaces to instantly correct shape, colour and size.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=600&q=80",bg:"linear-gradient(145deg,#2A200D,#0A1628)"},
  { emoji:"🦷",badge:"ADVANCED",badgeCls:"badge-mint",name:"Dental Implants",cat:"Restorative Dentistry",desc:"Permanent titanium implants that look, feel and function like natural teeth — the gold standard for missing teeth.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1609840112990-4265448268d1?w=600&q=80",bg:"linear-gradient(145deg,#0D1A2A,#0A1628)"},
  { emoji:"🌟",badge:"PAINLESS",badgeCls:"badge-teal",name:"Teeth Whitening",cat:"Cosmetic Dentistry",desc:"Professional in-office whitening using advanced LED activation to lift stains by up to 10 shades safely.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80",bg:"linear-gradient(145deg,#1A0D2A,#0A1628)"},
  { emoji:"😁",badge:"INVISIBLE",badgeCls:"badge-gold",name:"Clear Aligners",cat:"Orthodontics",desc:"Discreet removable aligner trays that gradually straighten teeth without the visibility of traditional braces.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1626264146977-0d9f5c7b2dde?w=600&q=80",bg:"linear-gradient(145deg,#0A2A15,#0A1628)"},
  { emoji:"🔬",badge:"PRECISION",badgeCls:"badge-mint",name:"Root Canal Treatment",cat:"Endodontics",desc:"Pain-free modern root canal therapy using rotary instrumentation to save badly infected teeth comfortably.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80",bg:"linear-gradient(145deg,#2A0D0D,#0A1628)"},
  { emoji:"🌿",badge:"GENTLE",badgeCls:"badge-teal",name:"Gum Treatment",cat:"Periodontics",desc:"Advanced gum disease management including deep cleaning, laser therapy and gum contouring for a healthy smile line.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80",bg:"linear-gradient(145deg,#0A1A2A,#0A1628)"},
  { emoji:"👑",badge:"DURABLE",badgeCls:"badge-gold",name:"Crowns & Bridges",cat:"Prosthodontics",desc:"Zirconia and porcelain crowns crafted to restore damaged or decayed teeth to full function and natural appearance.",price:"Contact for Pricing",img:"https://images.unsplash.com/photo-1599677880659-36b1a4fd14f8?w=600&q=80",bg:"linear-gradient(145deg,#1A2A0D,#0A1628)"},
];
const REVIEWS = [
  { text:"Dr. Niveditha completely transformed my smile. I was nervous about veneers but she walked me through every step with so much care. The result is beyond what I ever imagined possible.",name:"Priya M.",city:"Kochi",stars:"★★★★★"},
  { text:"I had severe dental anxiety and avoided clinics for years. Dr. Bhasi's gentle approach made this the most comfortable dental experience I've ever had. My implants look completely natural.",name:"Rahul K.",city:"Thrissur",stars:"★★★★★"},
  { text:"The smile makeover I received here changed my confidence entirely. The clinic is impeccably maintained, the staff is warm, and Dr. Niveditha's eye for aesthetics is truly artistic.",name:"Asha N.",city:"Ernakulam",stars:"★★★★★"},
];
const MASONRY_ITEMS = [
  {emoji:"✨",name:"Smile Makeover",bar:"linear-gradient(90deg,#0ECFC4,#09A099)"},
  {emoji:"💎",name:"Porcelain Veneers",bar:"linear-gradient(90deg,#C8A96A,#E5C98A)"},
  {emoji:"🦷",name:"Dental Implants",bar:"linear-gradient(90deg,#0ECFC4,#C8A96A)"},
  {emoji:"🌟",name:"Teeth Whitening",bar:"linear-gradient(90deg,#E5C98A,#C8A96A)"},
  {emoji:"😁",name:"Clear Aligners",bar:"linear-gradient(90deg,#09A099,#0ECFC4)"},
  {emoji:"🔬",name:"Root Canal",bar:"linear-gradient(90deg,#C8A96A,#0ECFC4)"},
  {emoji:"🌿",name:"Gum Treatment",bar:"linear-gradient(90deg,#0ECFC4,#1A3A5C)"},
  {emoji:"👑",name:"Crowns & Bridges",bar:"linear-gradient(90deg,#E5C98A,#09A099)"},
  {emoji:"🧒",name:"Pediatric Dentistry",bar:"linear-gradient(90deg,#0ECFC4,#E5C98A)"},
];
const TABS = ["Home","Treatments","Our Story","Smile Gallery","Book Now"];
const TAB_ICONS = ["🏠","🦷","✨","🖼️","📅"];

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cx, setCx] = useState(-100); const [cy, setCy] = useState(-100);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  useEffect(() => {
    const f = (e)=>{ setCx(e.clientX); setCy(e.clientY); };
    window.addEventListener("mousemove",f); return ()=>window.removeEventListener("mousemove",f);
  },[]);
  useEffect(()=>{
    const f=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",f); return()=>window.removeEventListener("scroll",f);
  },[]);

  const switchTab = useCallback((i) => {
    if (i===tab||transitioning) return;
    setTransitioning(true);
    setTimeout(()=>{ setTab(i); setTransitioning(false); window.scrollTo({top:0,behavior:"instant"}); }, 260);
  },[tab,transitioning]);

  return (
    <>
      <div className="cursor-dot" style={{left:cx,top:cy}} />
      <div className="cursor-ring" style={{left:cx,top:cy}} />

      <nav className={`navbar${scrolled?" scrolled":""}`}>
        <div className="nav-logo" onClick={()=>switchTab(0)} style={{cursor:"pointer"}}>Smile & Aesthetic</div>
        <div className="nav-tabs">
          {TABS.map((t,i)=><button key={i} className={`nav-tab${tab===i?" active":""}`} onClick={()=>switchTab(i)}>{t}</button>)}
        </div>
        <a href="tel:+919999999999" className="nav-phone">📞 +91 99999 99999</a>
      </nav>

      <div className={`page-wrap${transitioning?" page-out":" page-in"}`}>
        {tab===0&&<HomeTab switchTab={switchTab}/>}
        {tab===1&&<TreatmentsTab switchTab={switchTab}/>}
        {tab===2&&<AboutTab/>}
        {tab===3&&<GalleryTab switchTab={switchTab}/>}
        {tab===4&&<ContactTab formSent={formSent} setFormSent={setFormSent}/>}
        <Footer switchTab={switchTab}/>
      </div>

      <div className="mobile-nav">
        <div className="mobile-nav-inner">
          {TABS.map((t,i)=>(
            <button key={i} className={`mobile-tab${tab===i?" active":""}`} onClick={()=>switchTab(i)}>
              <span>{TAB_ICONS[i]}</span><span>{t}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── HOME ─────────────────────────────────────────────────────
function HomeTab({switchTab}) {
  return (
    <div>
      <div className="hero">
        <ParticleCanvas/>
        <div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/>
        <div className="float-icon">🦷</div>
        <div className="float-icon">✨</div>
        <div className="float-icon">😁</div>
        <div className="float-icon">💎</div>
        <div className="hero-content">
          <div className="hero-badge"><span className="badge-dot"/>Est. 2015 · Smile Specialists</div>
          <h1 className="hero-title">Where Every <span className="shimmer-word">Smile</span><br/>Becomes Art</h1>
          <p className="hero-tagline">Advanced cosmetic & aesthetic dental care by Dr. Niveditha Bhasi</p>
          <div className="hero-btns">
            <MagBtn variant="primary" onClick={()=>switchTab(1)}>Explore Treatments</MagBtn>
            <MagBtn variant="secondary" href="https://www.google.com/maps/search/Smile+and+aesthetic+dental+care+By+Dr.Niveditha+bhasi" target="_blank">Visit Us →</MagBtn>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 48px"}}>
        <div className="counters">
          {[{to:9,suf:"+",lbl:"Years of Excellence"},{to:3000,suf:"+",lbl:"Smiles Transformed"},{to:49,pre:"★",suf:"",lbl:"Patient Rating"},{to:120,suf:"+",lbl:"Google Reviews"}].map((c,i)=>(
            <div className="counter-cell" key={i}>
              <div className="counter-num"><Counter to={c.to} suffix={c.suf} prefix={c.pre||""}/></div>
              <div className="counter-label">{c.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <Ribbon/>

      <div className="section">
        <div className="section-header anim-1">
          <div className="section-label">Our Specialities</div>
          <h2 className="section-title">Featured <span className="shimmer-word">Treatments</span></h2>
          <p className="section-sub">Precision dentistry meets artistry — every treatment designed to give you a smile uniquely yours.</p>
        </div>
        <div className="cards-grid">
          {TREATMENTS.slice(0,3).map((t,i)=>(
            <TiltCard key={i} style={{background:t.bg}} className={`anim-${i+1}`}>
              <img src={t.img} alt={t.name} className="card-img"/>
              <div className="card-inner">
                <span className={`card-badge ${t.badgeCls}`}>{t.badge}</span>
                <span className="card-emoji">{t.emoji}</span>
                <div className="card-name">{t.name}</div>
                <div className="card-cat">{t.cat}</div>
                <div className="card-desc">{t.desc}</div>
                <div className="card-price">{t.price}</div>
                <MagBtn variant="primary" size="small" onClick={()=>switchTab(1)}>Learn More →</MagBtn>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="section-header anim-1">
          <div className="section-label">Your Journey</div>
          <h2 className="section-title">How We <span className="shimmer-word">Care</span></h2>
        </div>
        <div className="process-strip">
          {[
            {n:"01",emoji:"📋",title:"Consultation",desc:"Comprehensive oral examination and digital smile preview tailored to your face."},
            {n:"02",emoji:"🔬",title:"Treatment Plan",desc:"Custom plan prepared with transparent pricing and zero surprises."},
            {n:"03",emoji:"🦷",title:"Precision Care",desc:"Advanced treatments delivered with gentle precision using latest technology."},
            {n:"04",emoji:"✨",title:"Radiant Smile",desc:"Walk out with renewed confidence and a smile that transforms your life."},
          ].map((s,i)=>(
            <div className="process-step" key={i}>
              <div className="step-num">{s.n}</div>
              <div className="step-emoji">{s.emoji}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="section-header anim-1">
          <div className="section-label">Patient Stories</div>
          <h2 className="section-title">What Our <span className="shimmer-word">Patients</span> Say</h2>
        </div>
        <div className="cards-grid">
          {REVIEWS.map((r,i)=>(
            <TiltCard key={i} style={{background:["linear-gradient(145deg,#0D2A28,#0A1628)","linear-gradient(145deg,#2A200D,#0A1628)","linear-gradient(145deg,#0D1A2A,#0A1628)"][i]}}>
              <div className="card-inner">
                <span className="quote-mark">"</span>
                <div className="stars">{r.stars}</div>
                <div className="review-text">{r.text}</div>
                <div className="reviewer-name">{r.name}</div>
                <div className="reviewer-meta">{r.city}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      <div className="section" style={{paddingTop:0}}>
        <div className="cta-banner">
          <div className="cta-banner-title">Ready for Your Dream <span className="shimmer-word">Smile?</span></div>
          <div className="cta-banner-sub">Visit us · Advanced care · Gentle hands · Real results<br/>📍 Kerala, India &nbsp;|&nbsp; 📞 +91 99999 99999</div>
          <div className="cta-btns">
            <MagBtn variant="gradient" onClick={()=>switchTab(4)}>Book Appointment</MagBtn>
            <MagBtn variant="secondary" onClick={()=>switchTab(1)}>View All Treatments</MagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TREATMENTS ───────────────────────────────────────────────
function TreatmentsTab({switchTab}) {
  return (
    <div>
      <div className="sub-hero">
        <ParticleCanvas/><div className="orb orb1" style={{opacity:0.12}}/>
        <div className="sub-hero-content anim-1">
          <div className="section-label">Full Treatment Menu</div>
          <h1 className="sub-hero-title">Our <span className="shimmer-word">Treatments</span></h1>
          <p className="sub-hero-sub">Every procedure performed with artistry, precision and care.</p>
        </div>
      </div>
      <Ribbon goldStyle/>
      <div className="section">
        <div className="cards-grid cards-grid-2">
          {TREATMENTS.map((t,i)=>(
            <TiltCard key={i} style={{background:t.bg}} className={`anim-${(i%4)+1}`}>
              <img src={t.img} alt={t.name} className="card-img"/>
              <div className="card-inner">
                <span className={`card-badge ${t.badgeCls}`}>{t.badge}</span>
                <span className="card-emoji">{t.emoji}</span>
                <div className="card-name">{t.name}</div>
                <div className="card-cat">{t.cat}</div>
                <div className="card-desc">{t.desc}</div>
                <div className="card-price">{t.price}</div>
                <MagBtn variant="primary" size="small" onClick={()=>switchTab(4)}>Book Consultation →</MagBtn>
              </div>
            </TiltCard>
          ))}
        </div>
        <div className="cta-banner" style={{marginTop:48}}>
          <div className="cta-banner-title">Not Sure Which <span className="shimmer-word">Treatment</span> Is Right?</div>
          <div className="cta-banner-sub">Book a free consultation — Dr. Niveditha will guide you personally.</div>
          <div className="cta-btns"><MagBtn variant="gradient" onClick={()=>switchTab(4)}>Free Consultation</MagBtn></div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────
function AboutTab() {
  return (
    <div>
      <div className="sub-hero">
        <ParticleCanvas/><div className="orb orb2" style={{opacity:0.1}}/>
        <div className="sub-hero-content anim-1">
          <div className="section-label">Our Story</div>
          <h1 className="sub-hero-title">Meet <span className="shimmer-word">Dr. Niveditha</span></h1>
          <p className="sub-hero-sub">Crafting perfect smiles since 2015.</p>
        </div>
      </div>
      <Ribbon/>
      <div className="section">
        <div className="about-grid">
          <div className="about-left slide-l">
            <div style={{position:"relative",zIndex:1}}>
              <ParticleCanvas colors={["#0ECFC4","#C8A96A"]}/>
              <div className="about-est">✦ EST. 2015 · SMILE SPECIALISTS</div>
              <p className="about-headline">"Creating smiles that tell your story beautifully."</p>
              <div className="about-stats">
                {[["9+","Years"],["3000+","Patients"],["★4.9","Rating"]].map(([n,l],i)=>(
                  <div key={i} style={{textAlign:"center"}}>
                    <div className="about-stat-num">{n}</div>
                    <div className="about-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-year">2015</div>
          </div>
          <div className="slide-r">
            <div className="section-label">Our Story</div>
            <h2 className="section-title" style={{marginBottom:24}}>Passion for <span className="shimmer-word">Perfect Smiles</span></h2>
            <p className="about-p">Smile and Aesthetic Dental Care was founded by Dr. Niveditha Bhasi with a single purpose — to bring world-class cosmetic and comprehensive dental care to patients who deserve nothing less than the best. With advanced training in aesthetic dentistry and a deeply patient-centric philosophy, Dr. Bhasi has built a practice where clinical excellence meets genuine warmth.</p>
            <p className="about-p">Every patient who walks in receives personalised attention, honest counsel and treatment rooted in the latest evidence-based techniques. From a child's first dental visit to complex full-mouth rehabilitations, the clinic handles every smile journey with sensitivity and skill.</p>
            <div className="feature-cards">
              {[
                {icon:"🔬",title:"Latest Technology",desc:"Digital imaging, CAD/CAM crowns and laser dentistry."},
                {icon:"💛",title:"Pain-Free Promise",desc:"Gentle techniques and sedation options for anxious patients."},
                {icon:"🎨",title:"Artistic Eye",desc:"Dr. Bhasi treats every smile as a personal aesthetic statement."},
                {icon:"🏆",title:"Proven Results",desc:"Thousands of smile transformations with natural-looking outcomes."},
              ].map((f,i)=>(
                <div className="feature-card" key={i}>
                  <div className="feature-card-icon">{f.icon}</div>
                  <div className="feature-card-title">{f.title}</div>
                  <div className="feature-card-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="values-grid anim-2">
          {[
            {icon:"💎",title:"Excellence",desc:"Uncompromising standards in every procedure, every day."},
            {icon:"🤝",title:"Trust",desc:"Transparent, honest care — no unnecessary treatments, ever."},
            {icon:"🌟",title:"Artistry",desc:"Smile design is both science and art. We master both."},
            {icon:"❤️",title:"Compassion",desc:"Your comfort and confidence are always our priority."},
          ].map((v,i)=>(
            <div className="value-cell" key={i}>
              <div className="value-icon">{v.icon}</div>
              <div className="value-title">{v.title}</div>
              <div className="value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────
function GalleryTab({switchTab}) {
  return (
    <div>
      <div className="sub-hero">
        <ParticleCanvas/><div className="orb orb1" style={{opacity:0.12}}/>
        <div className="sub-hero-content anim-1">
          <div className="section-label">Portfolio</div>
          <h1 className="sub-hero-title">Smile <span className="shimmer-word">Gallery</span></h1>
          <p className="sub-hero-sub">A showcase of our most transformative dental work.</p>
        </div>
      </div>
      <Ribbon goldStyle/>
      <div className="section">
        <div className="masonry">
          {MASONRY_ITEMS.map((m,i)=>(
            <TiltCard key={i} className="masonry-item">
              <div className="masonry-card">
                <div className="masonry-emoji">{m.emoji}</div>
                <div className="masonry-name">{m.name}</div>
                <div className="masonry-bar" style={{background:m.bar}}/>
              </div>
            </TiltCard>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:48}}>
          <p className="section-sub" style={{margin:"0 auto 28px"}}>Follow us on social media for real patient smile transformations and before/after cases.</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="https://instagram.com" target="_blank" className="social-link ig">📷 Instagram</a>
            <a href="https://facebook.com" target="_blank" className="social-link fb">📘 Facebook</a>
            <MagBtn variant="primary" onClick={()=>switchTab(4)}>Book Your Transformation</MagBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────
function ContactTab({formSent,setFormSent}) {
  const [form,setF] = useState({name:"",phone:"",interest:"",message:""});
  const set = k => e => setF(f=>({...f,[k]:e.target.value}));
  return (
    <div>
      <div className="sub-hero">
        <ParticleCanvas/><div className="orb orb2" style={{opacity:0.1}}/>
        <div className="sub-hero-content anim-1">
          <div className="section-label">Get In Touch</div>
          <h1 className="sub-hero-title">Book <span className="shimmer-word">Appointment</span></h1>
          <p className="sub-hero-sub">Your journey to a perfect smile starts with one conversation.</p>
        </div>
      </div>
      <Ribbon/>
      <div className="section">
        <div className="contact-grid">
          <div className="contact-left slide-l">
            <div style={{position:"relative",zIndex:1}}>
              <ParticleCanvas colors={["#0ECFC4","#C8A96A"]}/>
              <h2 className="section-title" style={{marginBottom:32}}>Smile & Aesthetic<br/><span className="shimmer-word">Dental Care</span></h2>
              {[
                {icon:"📍",cls:"teal",label:"Address",val:"Dr. Niveditha Bhasi's Clinic\nKerala, India"},
                {icon:"📞",cls:"gold",label:"Phone",val:"+91 99999 99999"},
                {icon:"⏰",cls:"teal",label:"Hours",val:"Mon–Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 1:00 PM"},
                {icon:"🦷",cls:"gold",label:"Speciality",val:"Cosmetic & Aesthetic Dentistry\nImplants · Orthodontics · Veneers"},
              ].map((d,i)=>(
                <div className="detail-row" key={i}>
                  <div className={`detail-icon ${d.cls}`}>{d.icon}</div>
                  <div>
                    <div className="detail-label">{d.label}</div>
                    <div className="detail-val" style={{whiteSpace:"pre-line"}}>{d.val}</div>
                  </div>
                </div>
              ))}
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" className="social-link ig">📷 Instagram</a>
                <a href="https://facebook.com" target="_blank" className="social-link fb">📘 Facebook</a>
              </div>
            </div>
          </div>
          <div className="contact-right slide-r">
            {formSent ? (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <div className="form-success-title">Appointment Requested!</div>
                <p className="form-success-p">Thank you! We'll confirm your appointment shortly.<br/><br/>For urgent enquiries call <a href="tel:+919999999999" style={{color:"var(--teal)"}}>+91 99999 99999</a></p>
              </div>
            ) : (
              <>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",color:"var(--mint)",marginBottom:28}}>Request an Appointment</h3>
                <div className="form-group"><label className="form-label">Your Name</label><input className="form-input" placeholder="Full name" value={form.name} onChange={set("name")}/></div>
                <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set("phone")}/></div>
                <div className="form-group">
                  <label className="form-label">Treatment of Interest</label>
                  <select className="form-select" value={form.interest} onChange={set("interest")}>
                    <option value="">Select a treatment...</option>
                    {TREATMENTS.map((t,i)=><option key={i} value={t.name}>{t.name}</option>)}
                    <option value="General Checkup">General Checkup</option>
                    <option value="Consultation">Consultation Only</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Tell us about your concern or preferred timing..." value={form.message} onChange={set("message")}/></div>
                <MagBtn variant="gradient" onClick={()=>{ if(form.name&&form.phone) setFormSent(true); }}>Send Request ✨</MagBtn>
              </>
            )}
          </div>
        </div>
        <div className="map-panel">
          <div>
            <div className="section-label" style={{marginBottom:8}}>Find Us</div>
            <div className="map-addr">Smile and Aesthetic Dental Care by Dr. Niveditha Bhasi<br/>Kerala, India</div>
          </div>
          <MagBtn variant="primary" href="https://www.google.com/maps/search/Smile+and+aesthetic+dental+care+By+Dr.Niveditha+bhasi" target="_blank">Open in Google Maps 📍</MagBtn>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({switchTab}) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo">Smile & Aesthetic Dental Care</div>
          <div className="footer-tagline">By Dr. Niveditha Bhasi · Kerala, India</div>
        </div>
        <div className="footer-links">
          {TABS.map((t,i)=><span key={i} className="footer-link" onClick={()=>switchTab(i)} style={{cursor:"pointer"}}>{t}</span>)}
        </div>
        <div style={{display:"flex",gap:10}}>
          <a href="https://instagram.com" target="_blank" className="social-link ig" style={{fontSize:"0.68rem"}}>📷</a>
          <a href="https://facebook.com" target="_blank" className="social-link fb" style={{fontSize:"0.68rem"}}>📘</a>
        </div>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} Smile and Aesthetic Dental Care by Dr. Niveditha Bhasi · All Rights Reserved</div>
    </footer>
  );
}