importScripts(
    "https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js",
);
importScripts(
    "https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
    apiKey: "AIzaSyAnhNNjunvjYESytZToYFAs7MMUax_KGQ0",
    authDomain: "lunisolar-31842.firebaseapp.com",
    projectId: "lunisolar-31842",
    storageBucket: "lunisolar-31842.firebasestorage.app",
    messagingSenderId: "652281157317",
    appId: "1:652281157317:web:2ae4268ac8421babedc2ac",
    measurementId: "G-8RPEJMWQ0M",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
