const CACHE='kyushu-2026-static-v4';
const STATIC=['./','./index.html','./styles.css','./app.js','./assets/icon.svg','./assets/kyushu-hero.webp','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(response=>{if(response.ok&&STATIC.some(p=>u.pathname.endsWith(p.replace('./','')))){const clone=response.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}return response;})))});
