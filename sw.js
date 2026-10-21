const V='prokachka-8ce05c4b',H=V.slice(10),ST='prokachka-static-1',PREV='prokachka-prev',DATA=['./d-efb33aa41b.js','./d-feefe552ff.js'];
const isStatic=p=>/\/(fonts|voice)\/|\/d-[0-9a-f]+\.js$|\/icon-|\/og\./.test(p);
const HTML=b=>new Response(b,{headers:{'Content-Type':'text/html; charset=utf-8'}});
/* установка мгновенная: ничего не качаем (на iPhone долгую установку система обрывает); страницу берём, если её уже скачало приложение */
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);try{for(const k of await caches.keys()){if(k===V||k===ST)continue;const hit=await (await caches.open(k)).match('./index.html');if(!hit)continue;const t=await hit.clone().text();if(t.indexOf("APP_H='"+H+"'")>=0){await c.put('./index.html',HTML(t));await c.put('./',HTML(t));break}}}catch(err){}
  if(!(await c.match('./index.html'))){try{const ac=new AbortController(),to=setTimeout(()=>ac.abort(),8000);const r=await fetch('./index.html',{signal:ac.signal});clearTimeout(to);if(r.ok){const t=await r.text();if(t.indexOf("APP_H='"+H+"'")>=0){await c.put('./index.html',HTML(t));await c.put('./',HTML(t))}}}catch(err){}}})().then(()=>self.skipWaiting()))});
/* включение: прежняя страница — в запас (без сети откроется она), шрифты и голоса — в постоянный кэш, старое — удалить */
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const st=await caches.open(ST),pv=await caches.open(PREV);
  for(const k of await caches.keys()){if(k===V||k===ST||k===PREV||!k.startsWith('prokachka-'))continue;const c=await caches.open(k);
    for(const q of await c.keys()){const p=new URL(q.url).pathname;try{if(p.endsWith('/index.html')){const r=await c.match(q);if(r)await pv.put('./index.html',r)}else if(isStatic(p)&&!(await st.match(q))){const r=await c.match(q);if(r)await st.put(q,r)}}catch(err){}}
    await caches.delete(k)}
  for(const q of await st.keys()){const p=new URL(q.url).pathname;if(/\/d-[0-9a-f]+\.js$/.test(p)&&DATA.length&&!DATA.some(d=>p.endsWith(d.slice(1))))await st.delete(q)}
  await self.clients.claim()})())});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if('focus' in c)return c.focus()}return clients.openWindow('./')}))});
const UPD=`<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#1d2140"><title>Самплан</title>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f1f2f8;font:16px -apple-system,system-ui,sans-serif;color:#1b1e33">
<div style="text-align:center;padding:24px;width:290px"><div style="width:68px;height:68px;margin:0 auto 18px;border-radius:20px;background:#14a383;display:grid;place-items:center;box-shadow:0 14px 28px -12px rgba(20,163,131,.7)"><svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg></div>
<b style="font-size:20px">Обновляю «Самплан»</b><p id="t" style="color:#666b86;margin:8px 0 18px;line-height:1.45">Скачиваю новую версию. Это один раз — прогресс и записи на месте.</p>
<div style="height:7px;border-radius:4px;background:#e1e4f0;overflow:hidden"><i id="b" style="display:block;height:100%;width:6%;border-radius:4px;background:#14a383;transition:width .4s"></i></div>
<p id="a" hidden style="margin-top:18px"><button id="r" style="border:0;border-radius:12px;background:#3b7ddd;color:#fff;font:600 15px system-ui;padding:11px 16px">Повторить</button> <button id="o" style="border:1px solid #e1e4f0;border-radius:12px;background:#fff;color:#1b1e33;font:600 15px system-ui;padding:11px 16px">Прежняя версия</button></p></div>
<script>
(async()=>{const V='__V__',t=document.getElementById('t'),b=document.getElementById('b'),a=document.getElementById('a');
 document.getElementById('r').onclick=()=>location.reload();document.getElementById('o').onclick=()=>location.replace('./?old=1');
 const fail=m=>{t.textContent=m;a.hidden=false;setTimeout(()=>{if(!document.hidden)location.replace('./?old=1')},12000)};
 try{const ctl=new AbortController(),to=setTimeout(()=>ctl.abort(),120000);
  const res=await fetch('./index.html?fresh='+Date.now(),{cache:'no-store',signal:ctl.signal});if(!res.ok)throw 0;
  let txt='';if(res.body&&res.body.getReader){const rd=res.body.getReader(),dec=new TextDecoder();let n=0;for(;;){const {done,value}=await rd.read();if(done)break;n+=value.length;txt+=dec.decode(value,{stream:true});b.style.width=Math.min(92,6+n/13000)+'%'}txt+=dec.decode()}else txt=await res.text();
  clearTimeout(to);if(txt.indexOf("APP_H='")<0)throw 0;
  const st=await caches.open('prokachka-static-1');for(const m of txt.matchAll(/<script src="\\.\\/(d-[0-9a-f]+\\.js)"><\\/script>/g)){const u='./'+m[1];if(!(await caches.match(u))){const r=await fetch(u);if(!r.ok)throw 0;await st.put(u,r)}}
  const c=await caches.open(V),mk=()=>new Response(txt,{headers:{'Content-Type':'text/html; charset=utf-8'}});await c.put('./index.html',mk());await c.put('./',mk());
  b.style.width='100%';setTimeout(()=>location.replace('./'),250)
 }catch(e){fail(navigator.onLine===false?'Нет интернета. Открою прежнюю версию — обновлю, когда появится связь.':'Связь оборвалась. Можно повторить или открыть прежнюю версию.')}})();
</script>`;
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);
  if(u.origin!==location.origin)return;if(u.pathname.endsWith('/version.json')||u.searchParams.has('fresh')||req.headers.has('range'))return;const nav=req.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(nav){e.respondWith((async()=>{
    if(u.searchParams.has('old')){const r=await (await caches.open(PREV)).match('./index.html');if(r)return r}
    const hit=await (await caches.open(V)).match('./index.html');if(hit)return hit;
    if(!u.searchParams.has('old'))return HTML(UPD.replace('__V__',V));
    try{return await fetch('./index.html',{cache:'no-cache'})}catch(err){return HTML('<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><body style="font:16px system-ui;padding:40px 24px;text-align:center"><h2>Нет сети</h2><p>Открой «Самплан» один раз с интернетом — дальше он работает без сети.</p>')}})());return}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{if(res.status===200){const cp=res.clone();caches.open(isStatic(u.pathname)?ST:V).then(c=>c.put(req,cp)).catch(()=>{})}return res})))});
