/* ============================================================
   INTI service worker
   Hoog VERSIE op bij elke wijziging aan index.html, dan komt de
   nieuwe versie binnen en verschijnt onderin het vernieuw-balkje.
   ============================================================ */
const VERSIE = "v1";
const CACHE  = "inti-" + VERSIE;

// wat we meteen bewaren zodat de app ook zonder netwerk opent
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./inti-sun.jpg"
];

// live Firebase en Firestore: nooit cachen, altijd vers van het netwerk
function isLive(url){
  const h = url.hostname;
  return h.endsWith("firestore.googleapis.com")
    || h === "identitytoolkit.googleapis.com"
    || h === "securetoken.googleapis.com"
    || h === "firebaseinstallations.googleapis.com"
    || h.endsWith("firebaseio.com")
    || h.endsWith("firebasedatabase.app")
    || h.endsWith("firebasestorage.app")
    || h.endsWith("firebasestorage.googleapis.com");
}

// lettertypen, Firebase-programmacode, pictogrammen en manifest: cache eerst
function isCacheEerst(url){
  const h = url.hostname;
  if(h === "fonts.googleapis.com" || h === "fonts.gstatic.com") return true;           // lettertypen
  if(h === "www.gstatic.com" && url.pathname.includes("/firebasejs/")) return true;     // Firebase-code (vast per versie)
  if(url.origin === location.origin && /\.(png|webmanifest|jpg|jpeg|svg|ico)$/.test(url.pathname)) return true;
  return false;
}

async function netwerkEerst(req){
  const cache = await caches.open(CACHE);
  try{
    const res = await fetch(req);
    if(res && res.ok) cache.put(req, res.clone());   // cache bijwerken
    return res;
  }catch(e){
    const hit = await cache.match(req);
    if(hit) return hit;
    if(req.mode === "navigate"){
      const idx = await cache.match("./index.html") || await cache.match("./");
      if(idx) return idx;
    }
    throw e;
  }
}

async function cacheEerst(req){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if(hit) return hit;
  const res = await fetch(req);
  if(res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
  return res;
}

self.addEventListener("install", e => {
  // niet meteen overnemen: we wachten tot de gebruiker op vernieuwen tikt.
  // vers ophalen (langs de browsercache heen) zodat een nieuwe versie echt binnenkomt
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))));
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));  // oude caches opruimen
    await self.clients.claim();
  })());
});

self.addEventListener("message", e => {
  if(e.data === "skipWaiting") self.skipWaiting();   // op tik van de gebruiker de nieuwe versie activeren
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);

  if(isLive(url)) return;   // Firebase en Firestore laten we ongemoeid naar het netwerk gaan

  // index.html en gewone navigatie: netwerk eerst, cache als terugval
  if(req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html")){
    e.respondWith(netwerkEerst(req));
    return;
  }
  if(isCacheEerst(url)){
    e.respondWith(cacheEerst(req));
    return;
  }
  e.respondWith(netwerkEerst(req));
});
