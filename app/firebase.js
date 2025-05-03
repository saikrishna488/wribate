"use client"

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSXyza_Ho5kGy5Y1x45T3ExQIhI1tKtww",
  authDomain: "wribate-d6342.firebaseapp.com",
  projectId: "wribate-d6342",
  storageBucket: "wribate-d6342.firebasestorage.app",
  messagingSenderId: "995202872094",
  appId: "1:995202872094:web:9da3a614fd433bfc08cf0f",
  measurementId: "G-T2D4F06FCJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create provider instances for each service
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const twitterProvider = new OAuthProvider('twitter.com');

// Optionally, you can set the scopes for each provider, if needed
// googleProvider.addScope('email');
// facebookProvider.addScope('email');

export { auth, googleProvider, facebookProvider, githubProvider, appleProvider, twitterProvider };
