import { GoogleAuthProvider, getAuth } from 'firebase/auth'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyDx-tI6iKPq9ypdL1Le94dLy2vDyRUwXlg',
  authDomain: 'gpms-118ff.firebaseapp.com',
  projectId: 'gpms-118ff',
  storageBucket: 'gpms-118ff.firebasestorage.app',
  messagingSenderId: '930768156057',
  appId: '1:930768156057:web:add63cc7d752c682ae0f08'
}

const app = initializeApp(firebaseConfig)
const googleProvider = new GoogleAuthProvider()
const auth = getAuth(app)
export { googleProvider, auth, app }
