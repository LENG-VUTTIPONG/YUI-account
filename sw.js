// ไฟล์เสริม: วางไว้โฟลเดอร์เดียวกับ index.html เพื่อให้เปิดแอปได้แม้ไม่มีอินเทอร์เน็ต
const CACHE="minimal-ledger-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(["./","./index.html"])).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.origin===location.origin){ // หน้าแอป: ใช้เวอร์ชันใหม่ถ้ามีเน็ต ไม่มีก็ใช้ที่เก็บไว้
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html"))));
  }else{ // ฟอนต์และตัวอ่าน OCR: ใช้ของในเครื่องก่อน
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res})));
  }
});
