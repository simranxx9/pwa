// to register app with the service worker

if('serviceWorker' in navigator)
{
    navigator.serviceWorker.register('/sw.js')
    .then((reg)=>console.log('registered successfully',reg))
    .catch((err)=>console.log('not registered',err));
}