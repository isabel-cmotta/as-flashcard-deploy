// firebase-init.ts

import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase-config';

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);

export default app;
