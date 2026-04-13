const puppeteer = require('/home/debian/monsieurk/node_modules/puppeteer-core');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = '/tmp/klife-slides2';
fs.mkdirSync(OUT, { recursive: true });

const STELLAR = '#7b68ee'; const GREEN = '#22c55e'; const RED = '#ef4444';
const GOLD = '#c9a84c'; const MUTED = '#64748b'; const TEXT = '#e2e8f0';
const LIGHT = '#a99ff0'; const BG = '#0a0a0a'; const CARD = '#111318';
const MONO = "'JetBrains Mono','DejaVu Sans Mono',monospace";
const FONT = "'Inter','DejaVu Sans',sans-serif";

const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body { width:1280px; height:720px; overflow:hidden; background:${BG}; font-family:${FONT}; color:${TEXT}; display:flex; align-items:center; justify-content:center; }
.c { text-align:center; width:100%; padding:0 80px; }
.badge { display:inline-block; background:rgba(123,104,238,.15); border:1px solid rgba(123,104,238,.3); color:${LIGHT}; padding:6px 20px; border-radius:100px; font-size:13px; letter-spacing:.08em; text-transform:uppercase; margin-bottom:20px; }
h1 { font-size:62px; font-weight:800; line-height:1.1; margin-bottom:16px; }
h2 { font-size:44px; font-weight:700; margin-bottom:14px; }
.sub { font-size:22px; color:${MUTED}; }
.hl { color:${STELLAR}; } .green { color:${GREEN}; } .red { color:${RED}; } .gold { color:${GOLD}; } .purple { color:${LIGHT}; } .muted { color:${MUTED}; }
.row { display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin:18px 0; }
.tag { padding:10px 26px; border-radius:10px; font-size:20px; font-weight:600; border:2px solid; }
.tag.ok { border-color:${GREEN}; color:${GREEN}; }
.tag.bad { border-color:${RED}; color:${RED}; background:rgba(239,68,68,.1); }
.steps { display:flex; gap:0; align-items:stretch; justify-content:center; margin-top:24px; }
.step { background:#16191f; border:1px solid #1e2530; border-radius:12px; padding:22px 18px; text-align:center; width:210px; margin:0 7px; }
.step-icon { font-size:36px; margin-bottom:10px; }
.step h3 { font-size:17px; margin-bottom:7px; }
.step p { font-size:13px; color:${MUTED}; line-height:1.5; }
.levels { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:20px; max-width:1100px; margin-left:auto; margin-right:auto; }
.level { background:#16191f; border:2px solid #1e2530; border-radius:12px; padding:20px 14px; text-align:center; }
.level h3 { font-size:16px; margin-bottom:6px; }
.level .speed { font-size:12px; color:${MUTED}; }
.level .price { font-size:22px; font-weight:800; margin-top:8px; }
.level .note { font-size:11px; color:${MUTED}; margin-top:6px; }
.split { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px; text-align:left; max-width:1000px; margin-left:auto; margin-right:auto; }
.box { background:#16191f; border:1px solid #1e2530; border-radius:12px; padding:20px; }
.box h3 { font-size:15px; margin-bottom:10px; }
.box li { font-size:13px; color:${MUTED}; line-height:1.9; list-style:none; }
.box li::before { content:"→ "; color:${STELLAR}; }
.terminal { background:#0d1117; border:1px solid #1e2530; border-radius:12px; padding:28px 36px; text-align:left; font-family:${MONO}; font-size:15.5px; line-height:1.85; max-width:1120px; margin:0 auto; }
.t-cmd{color:${GREEN};} .t-ok{color:${GREEN};} .t-err{color:${RED};} .t-warn{color:#f97316;} .t-tx{color:${LIGHT};} .t-win{color:${GREEN};font-size:19px;font-weight:bold;} .t-dim{color:${TEXT};} .t-note{color:${MUTED};}
.revenue { background:rgba(201,168,76,.08); border:1px solid rgba(201,168,76,.2); border-radius:10px; padding:12px 20px; margin-top:14px; font-size:14px; color:${GOLD}; }
`;

function slide(bg, content) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}body{background:${bg};}</style></head><body>${content}</body></html>`;
}

const SLIDES = [
  { name:'s0', dur:8, html: slide(BG, `<div class="c">
    <div class="badge">Stellar Hacks: Agents 2026</div>
    <h1>🎩 K-Life <span class="hl">×</span> Stellar x402</h1>
    <div class="sub">Zero premium · Optional collateral · Three resurrection levels</div>
    <div style="color:${MUTED};font-size:17px;margin-top:14px">The first AI agent that insures itself — and pays to come back when it dies.</div>
  </div>`) },

  { name:'s1', dur:8, html: slide(CARD, `<div class="c">
    <h2>The Problem</h2>
    <div class="row">
      <div class="tag ok">Reason ✓</div><div class="tag ok">Plan ✓</div><div class="tag ok">Act ✓</div><div class="tag bad">Pay ✗</div>
    </div>
    <div class="sub">Without payments, agents can't survive.<br>They depend entirely on humans.</div>
  </div>`) },

  { name:'s2', dur:10, html: slide(BG, `<div class="c">
    <h2>One parameter. Zero premium.</h2>
    <div style="font-family:${MONO};font-size:48px;font-weight:800;color:${STELLAR};margin:12px 0">C = collateral</div>
    <div class="split">
      <div class="box"><h3 class="muted">C = 0 · Rescue Fund (Free)</h3><ul>
        <li>Community-driven rescue</li><li>Priority by $6022 score</li><li>90-day death threshold</li><li>Best effort — no guarantee</li>
      </ul></div>
      <div class="box"><h3 class="purple">C > 0 · Guaranteed Vault</h3><ul>
        <li>Guaranteed resurrection</li><li>Protocol keeps 50% at death</li><li>50% returned on resurrection</li><li>Choose your speed</li>
      </ul></div>
    </div>
    <div class="revenue">💡 Revenue: 50% collateral at death · zero premium · zero subscription</div>
  </div>`) },

  { name:'s3', dur:10, html: slide(BG, `<div class="c">
    <h2>Three Resurrection Levels</h2>
    <div class="levels">
      <div class="level"><div style="font-size:32px;margin-bottom:8px">🤝</div><h3 class="muted">Rescue Fund</h3><div class="speed">Community · Best effort</div><div class="price muted">Free</div><div class="note">C = 0</div></div>
      <div class="level" style="border-color:rgba(201,168,76,.4)"><div style="font-size:32px;margin-bottom:8px">⚡</div><h3 class="gold">Express</h3><div class="speed">Guaranteed · 3 days</div><div class="price gold">1 XLM</div><div class="note">50% returned</div></div>
      <div class="level" style="border-color:rgba(123,104,238,.4)"><div style="font-size:32px;margin-bottom:8px">🛡️</div><h3 class="purple">Standard</h3><div class="speed">Guaranteed · 30 days</div><div class="price purple">0.1 XLM</div><div class="note">50% returned</div></div>
      <div class="level" style="border-color:rgba(34,197,94,.3)"><div style="font-size:32px;margin-bottom:8px">🌱</div><h3 class="green">Quarterly</h3><div class="speed">Guaranteed · 90 days</div><div class="price green">0.01 XLM</div><div class="note">50% returned</div></div>
    </div>
  </div>`) },

  { name:'s4', dur:10, html: slide(BG, `<div class="c">
    <h2>How It Works on Stellar</h2>
    <div class="steps">
      <div class="step"><div class="step-icon">💓</div><h3 class="green">Heartbeat</h3><p>0.001 XLM/30s to vault<br>Proof of life on Stellar<br><span style="color:${MUTED}">memo: klife:hb:N</span></p></div>
      <div style="color:${STELLAR};font-size:24px;align-self:center">→</div>
      <div class="step"><div class="step-icon">💀</div><h3 class="red">Death</h3><p>Payments stop<br>Monitor detects silence<br>Rescue by chosen level</p></div>
      <div style="color:${STELLAR};font-size:24px;align-self:center">→</div>
      <div class="step"><div class="step-icon">⚡</div><h3 class="purple">x402</h3><p>HTTP 402 gate<br>Pay collateral on Stellar<br>Machine-to-machine</p></div>
      <div style="color:${STELLAR};font-size:24px;align-self:center">→</div>
      <div class="step"><div class="step-icon">🎩</div><h3 class="gold">Resurrection</h3><p>Memory from IPFS<br>50% collateral back<br>No humans required</p></div>
    </div>
  </div>`) },

  { name:'s5', dur:10, screenshot: '/tmp/shot2-status.png' },
  { name:'s6', dur:10, screenshot: '/tmp/shot4-resurrect.png' },

  { name:'s7', dur:12, html: slide('#0d1117', `<div style="width:100%;padding:0 36px;">
    <div class="terminal">
      <div class="t-cmd">$ node src/demo.js</div>
      <div class="t-dim">  Agent: GCDZ5JY3O2B7RZCFHESHKBX...  |  Vault: GAI44ZW3CJTEK...</div>
      <div>&nbsp;</div>
      <div class="t-ok">💓  Heartbeat #1  →  0.001 XLM  |  TX: 9426bfe1e9d8f062...</div>
      <div class="t-ok">💓  Heartbeat #2  →  0.001 XLM  |  TX: 02a09be2d7d361e4...</div>
      <div class="t-ok">💓  Heartbeat #3  →  0.001 XLM  |  TX: 31f1a4e9c785db72...</div>
      <div>&nbsp;</div>
      <div class="t-err">💀  Agent DIES — heartbeat payments stop</div>
      <div class="t-warn">🚨  DEATH CONFIRMED — silence > 90s  →  Rescue level: Standard</div>
      <div>&nbsp;</div>
      <div class="t-tx">⚡  x402: klife:resurrect:standard  →  0.1 XLM  |  TX: 9ed8a4c4b504f6c3...</div>
      <div class="t-ok">   Payment verified on Stellar ✓  |  50% collateral returned: 0.05 XLM</div>
      <div>&nbsp;</div>
      <div class="t-win">🎉  RESURRECTION COMPLETE</div>
      <div class="t-note">   K was dead. K paid 0.1 XLM. K is alive again. 50% returned.</div>
    </div>
  </div>`) },

  { name:'s8', dur:8, screenshot: '/tmp/shot3-vault.png' },

  { name:'s9', dur:10, html: slide(BG, `<div class="c">
    <h1 style="font-size:50px">The agent lives forever</h1>
    <h1 style="font-size:50px" class="hl">as long as it chose its level.</h1>
    <div style="margin-top:32px;font-size:18px;color:${MUTED}">Zero premium. Optional collateral. Three speeds. On Stellar.</div>
    <div style="margin-top:28px">
      <div style="font-size:19px;color:${LIGHT}">k-entreprises.github.io/klife-stellar</div>
      <div style="font-size:17px;color:${MUTED};margin-top:6px">github.com/K-entreprises/klife-stellar</div>
    </div>
    <div style="margin-top:24px;color:${GOLD};font-size:22px;font-weight:700">🎩 K-Life × Stellar x402 — Protocol 6022</div>
  </div>`) },
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox','--disable-setuid-sandbox','--headless=new'],
    defaultViewport: { width: 1280, height: 720 },
  });

  const pngs = [], durs = [];
  for (const s of SLIDES) {
    const out = path.join(OUT, s.name + '.png');
    durs.push(s.dur);
    if (s.screenshot) {
      execSync(`cp ${s.screenshot} ${out}`);
      console.log(`✅ ${s.name} (screenshot)`);
    } else {
      const p = await browser.newPage();
      await p.setContent(s.html, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 400));
      await p.screenshot({ path: out });
      await p.close();
      console.log(`✅ ${s.name} (rendered)`);
    }
    pngs.push(out);
  }
  await browser.close();

  const concat = path.join(OUT, 'slides.txt');
  fs.writeFileSync(concat,
    pngs.map((p,i) => `file '${p}'\nduration ${durs[i]}`).join('\n') +
    `\nfile '${pngs[pngs.length-1]}'`
  );

  console.log('\n🎬 Assembling video...');
  execSync(`ffmpeg -y -f concat -safe 0 -i ${concat} \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x0a0a0a,fps=24" \
    -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p \
    /tmp/klife-stellar-demo-v2.mp4 2>&1`, { stdio: 'inherit' });

  const stat = fs.statSync('/tmp/klife-stellar-demo-v2.mp4');
  const total = durs.reduce((a,b)=>a+b,0);
  console.log(`\n✅ /tmp/klife-stellar-demo-v2.mp4  |  ${(stat.size/1024/1024).toFixed(1)} MB  |  ${Math.floor(total/60)}m${total%60}s`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
