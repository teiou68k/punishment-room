// sw.js
self.addEventListener('push', function(event) {
    let data = { title: '通知', body: '新着メッセージがあります' };

    if (event.data) {
        try {
            // JSONとして解析を試みる
            data = event.data.json();
        } catch (e) {
            // JSONじゃない（テストボタンなど）場合は、そのままテキストとして扱う
            data = { title: 'テスト通知', body: event.data.text() };
        }
    }
    
    const options = {
        body: data.body,
        icon: 'favicon.ico',
        badge: 'favicon.ico',
        data: { url: './' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// (notificationclick の処理は今のままでOKです)