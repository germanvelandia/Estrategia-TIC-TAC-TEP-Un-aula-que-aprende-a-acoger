/* Ruta Nido · utilidades compartidas de los recursos (no guarda ni envía datos) */
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const store = { get(k){ try{ return localStorage.getItem(k) }catch(e){ return null } }, set(k,v){ try{ localStorage.setItem(k,v) }catch(e){} } };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const calm = () => document.documentElement.classList.contains('calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;
let voiceOn = store.get('rn-voz') !== '0';

function say(text, force){
  if(!(voiceOn || force) || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang = 'es-CO'; u.rate = .92; u.pitch = 1.05;
  const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.startsWith('es')); if(v) u.voice = v;
  speechSynthesis.speak(u);
}
if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};

/* barra superior común: volver + accesibilidad */
(function(){
  const root = document.documentElement;
  let scale = parseFloat(store.get('rn-scale')) || 1;
  const setScale = s => { scale = Math.min(1.6, Math.max(.85, s)); root.style.setProperty('--scale', scale); store.set('rn-scale', scale); };
  setScale(scale);
  ['hc','calm'].forEach(c => { if(store.get('rn-' + c) === '1') root.classList.add(c); });
  const bar = document.createElement('header'); bar.className = 'rbar';
  bar.innerHTML = `<div class="wrap">
    <a class="home" href="index.html">🪺 Kit Ruta Nido</a>
    <div class="tools-bar" role="group" aria-label="Accesibilidad">
      <button data-t="minus" aria-label="Reducir texto">A−</button>
      <button data-t="plus" aria-label="Aumentar texto">A+</button>
      <button data-t="hc" aria-pressed="${root.classList.contains('hc')}" aria-label="Alto contraste">🌓</button>
      <button data-t="calm" aria-pressed="${root.classList.contains('calm')}" aria-label="Pausar animaciones">⏸️</button>
      <button data-t="voz" aria-pressed="${voiceOn}" aria-label="Voz automática">🔊</button>
    </div></div>`;
  document.body.prepend(bar);
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if(!b) return; const t = b.dataset.t;
    if(t === 'minus') setScale(scale - .1);
    else if(t === 'plus') setScale(scale + .1);
    else if(t === 'voz'){ voiceOn = !voiceOn; b.setAttribute('aria-pressed', voiceOn); store.set('rn-voz', voiceOn ? '1' : '0'); if(!voiceOn && 'speechSynthesis' in window) speechSynthesis.cancel(); }
    else { const on = root.classList.toggle(t); b.setAttribute('aria-pressed', on); store.set('rn-' + t, on ? '1' : '0'); }
  });
  const f = document.createElement('footer'); f.className = 'rfoot';
  f.innerHTML = `<div class="wrap">Kit Ruta Nido · Equipo Tejido Diverso · Universidad El Bosque · 2026 · <a href="../index.html">Ver la presentación</a><br>Esta página no pide, no guarda ni envía datos. Pictogramas representados con emojis; en el aula se usan los de <a href="https://arasaac.org/" target="_blank" rel="noopener">ARASAAC</a>.</div>`;
  document.body.append(f);
})();
