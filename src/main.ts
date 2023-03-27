import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/js/index.umd'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCUl5bXfR3wcVwZNwkm0ViZS7qEHioRULQ",
    authDomain: "knowledge-center-86ef5.firebaseapp.com",
    projectId: "knowledge-center-86ef5",
    storageBucket: "knowledge-center-86ef5.appspot.com",
    messagingSenderId: "185596797498",
    appId: "1:185596797498:web:61cbc701e7aa468b338b03"
};
const firebase : any = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);

const app = createApp(App)
.use(store)
.use(router)
app.provide("firestoreDB",db)
app.provide("firebaseAuth",auth)
.mount('#app')

