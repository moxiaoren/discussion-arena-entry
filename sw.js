self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  // 核心壳资源走缓存（离线也能打开入口页并提示），地址文件 latest.txt 永远实时
  if(url.endsWith('latest.txt')){ e.respondWith(fetch(e.request)); return; }
  e.respondWith(
    caches.open('ta-v1').then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
      if(res.ok && e.request.method==='GET') c.put(e.request,res.clone());
      return res;
    }).catch(()=>c.match('index.html'))))
  );
});
