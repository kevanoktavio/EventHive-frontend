import {initializeApp} from "firebase/app"
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAMvnvRANveZQd31wf3pbK4gVELQjtXR5k",
    authDomain: "wad2-eventhive-user-auth.firebaseapp.com",
    projectId: "wad2-eventhive-user-auth",
    storageBucket: "wad2-eventhive-user-auth.appspot.com",
    messagingSenderId: "12351265493",
    appId: "1:12351265493:web:d2a2c258578ba913a4e05c"
  };

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp)

export {firebaseApp, firebaseAuth}



