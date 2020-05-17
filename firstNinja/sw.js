const staticCacheName = 'site-static-v23';
const dynamicCacheName = 'site-dynamic-v23';
//

const assets = [
    '/',
  '/index.html',
  '/pages/fallback.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'

]

const limitCacheSize=(cacheName,size)=>{
    caches.open(cacheName).then(cache=>{
        cache.keys().then(keys=>{
            if(keys.length > size)
            {
                cache.delete(keys[0]).then(limitCacheSize(cacheName,size));
            }
        })
    })
}

// install the service worker
self.addEventListener('install',(evt)=>{
    console.log('installed successfully');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            cache.addAll(assets);
            console.log('shell created');
        })
    )
})

// to activate the service worker 
self.addEventListener('activate',evt=>{
    console.log('activated successfully');
    evt.waitUntil(
        caches.keys().then(keys=>{
            return Promise.all(keys
                .filter(key=> key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
                )
        })
    )
})

self.addEventListener('fetch',evt=>{
    
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1)
    {
        evt.respondWith(
        caches.match(evt.request).then(cacheRes=>{
            return cacheRes || fetch(evt.request).then(fetchRes=>{
                return caches.open(dynamicCacheName).then(cache=>{
                    cache.put(evt.request.url,fetchRes.clone());
                    limitCacheSize(dynamicCacheName,15);
                    return fetchRes;
                })
            });
        }).catch(()=>{
            if(evt.request.url.indexOf('.html')>-1)
            {
                return caches.match('/pages/fallback.html')
            }
        })
    )
    }
    

})