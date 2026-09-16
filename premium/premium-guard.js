// =============================================
// 🛡️ PREMIUM GUARD — Email Key Protection
// =============================================
// ဒီဖိုင်ကို premium/ Folder ထဲမှာ ထားပါ
// premium-jft1.html မှ premium-jft20.html အားလုံးက
// ဒီဖိုင်တစ်ခုတည်း ခေါ်ရုံပါပဲ
// =============================================

(function () {
  'use strict';

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyCWiTxC_B_H9GZYhvQc3jdTR_LLsE0gdvA",
    authDomain: "real-jft-premium.firebaseapp.com",
    projectId: "real-jft-premium",
    storageBucket: "real-jft-premium.firebasestorage.app",
    messagingSenderId: "439056027697",
    appId: "1:439056027697:web:b37a75ccf5da922714c510"
  };

  // Firebase Init (တစ်ခါသာ)
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Paths
  const ACCESS_DENIED = 'access-denied.html';
  const MAIN_PAGE = '../cindex.html';

  let isVerified = false;

  // =============================================
  // 🎬 Page Load — Body Hide (Flash ရှင်းဖို့)
  // =============================================
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.visibility = 'hidden';
  });

  // =============================================
  // 🔐 AUTH STATE
  // =============================================
  auth.onAuthStateChanged(async (user) => {
    // 1. Login မဝင်ရင် → Access Denied
    if (!user) {
      console.warn('⛔ Not logged in');
      window.location.href = ACCESS_DENIED;
      return;
    }

    try {
      // 2. Email Key နဲ့ Premium စစ်
      const emailKey = user.email.toLowerCase();
      const doc = await db.collection('premiumUsers').doc(emailKey).get();

      // 3. Premium မရှိရင် → Access Denied
      if (!doc.exists) {
        console.warn('⛔ Not Premium:', emailKey);
        window.location.href = ACCESS_DENIED;
        return;
      }

      // 4. Expiry စစ်
      const data = doc.data();
      const expiry = data.expiryDate?.toDate?.() || new Date(data.expiryDate);
      if (new Date() > expiry) {
        console.warn('⛔ Premium Expired:', emailKey);
        window.location.href = ACCESS_DENIED;
        return;
      }

      // 5. ✅ အားလုံး အောင်မြင်
      isVerified = true;
      console.log('✅ Premium Access Granted:', user.email, '| Expiry:', expiry);

      // Body Show
      document.body.style.visibility = 'visible';

      // Exam Start
      if (typeof initializeExam === 'function') {
        initializeExam();
      }

    } catch (error) {
      console.error('Premium check error:', error);
      window.location.href = ACCESS_DENIED;
    }
  });

  // =============================================
  // ⏱️ AUTO CHECK — 30 စက္ကန့်တစ်ခါ
  // =============================================
  setInterval(async () => {
    if (!isVerified || !auth.currentUser) return;

    try {
      const emailKey = auth.currentUser.email.toLowerCase();
      const doc = await db.collection('premiumUsers').doc(emailKey).get();

      if (!doc.exists) {
        console.warn('⚠️ Premium revoked');
        window.location.href = ACCESS_DENIED;
        return;
      }

      const data = doc.data();
      const expiry = data.expiryDate?.toDate?.() || new Date(data.expiryDate);
      if (new Date() > expiry) {
        console.warn('⚠️ Premium expired');
        window.location.href = ACCESS_DENIED;
      }
    } catch (error) {
      console.error('Auto check error:', error);
    }
  }, 30000);

  // =============================================
  // 🔒 Safety Timeout — 5 စက္ကန့်အတွင်း မဖွင့်ရင်
  // =============================================
  setTimeout(() => {
    if (!isVerified) {
      document.body.style.visibility = 'hidden';
    }
  }, 5000);

})();