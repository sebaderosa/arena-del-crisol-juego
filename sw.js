// service worker de Arena del Crisol (lo genera tools/build.py)
const CACHE='crisol-b282152faa';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('crisol-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // imágenes con huella: primero la caché (nunca cambian)
  if(u.pathname.includes('/recursos/')||/\.(png|webp|woff2?)$/.test(u.pathname)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
  // la página y lo demás: primero la red (para tener siempre la última versión) y, sin conexión, la copia guardada
  e.respondWith(fetch(r).then(res=>{if(res.ok&&(u.origin===location.origin||u.host.includes('fonts.')))caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>caches.match(r)));
});
