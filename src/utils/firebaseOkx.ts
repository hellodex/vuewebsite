// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAniltivJ69SrGZg3Bdrd6VryPon7SVPKA',
  authDomain: 'hellodex-pro.firebaseapp.com',
  projectId: 'hellodex-pro',
  storageBucket: 'hellodex-pro.appspot.com',
  messagingSenderId: '883383880179',
  appId: '1:883383880179:web:eab718ed237cce58d4aa86',
  measurementId: 'G-109HVHQTP8'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export default analytics
