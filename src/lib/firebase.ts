import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7I4HBvF3nT9sEzZ7AHuOgxuAI-VP9WyQ",
  authDomain: "eathut-8e2f0.firebaseapp.com",
  projectId: "eathut-8e2f0",
  storageBucket: "eathut-8e2f0.firebasestorage.app",
  messagingSenderId: "207800728816",
  appId: "1:207800728816:web:3a578b4eaccd3c62e21635",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
