//1) Instalar la dependencia: 
//npm i firebase

//2) Configurar el código de conexión: 

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArHySRsCybiafmEUmmnIyTRqc_ridPkog",
  authDomain: "nuevaescuela--chat.firebaseapp.com",
  projectId: "nuevaescuela--chat",
  storageBucket: "nuevaescuela--chat.appspot.com",
  messagingSenderId: "350408584069",
  appId: "1:350408584069:web:60dd161ffb6346564332ec"
};

//Incializar Firebase:
const app = initializeApp(firebaseConfig);

//Inicializamos FireStore
const db = getFirestore(app); 

export {db}; 