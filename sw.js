// Cache simple : l'appli s'ouvre sans internet après la première visite.
// Pense à changer VERSION à chaque mise à jour pour que les élèves reçoivent la nouvelle version.
var VERSION='cap-examens-1';
var FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}));
  }).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit||fetch(e.request).catch(function(){return caches.match('index.html')});
  }));
});
