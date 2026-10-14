const V='prokachka-1ff4ec51';const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{for(const u of SHELL){try{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,r)}catch(err){}}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==V+'-fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.origin===location.origin){const nav=req.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
    if(nav){e.respondWith(fetch(req,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>{c.put('./index.html',cp.clone());c.put('./',cp)})}return res}).catch(()=>caches.match('./index.html')));return}
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(req,cp))}return res})));return}
  if(u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com')){e.respondWith(caches.open(V+'-fonts').then(async c=>{const hit=await c.match(req);const net=fetch(req).then(res=>{if(res.ok)c.put(req,res.clone());return res}).catch(()=>hit);return hit||net}))}});
