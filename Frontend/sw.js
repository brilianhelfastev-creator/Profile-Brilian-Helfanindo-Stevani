self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Diterima.');
    
    let payloadText = 'Ada pembaruan profil baru!'; 

    if (event.data) {
        payloadText = event.data.text();
    }

    const title = 'Notifikasi Web Profil';
    const options = {
        body: payloadText,
        icon: 'assets/Foto_Brilian.jpeg', // Using existing asset as icon
        badge: 'assets/Foto_Brilian.jpeg',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notifikasi di-klik.');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/') 
    );
});
