import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from "firebase";
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
    apiKey: "AIzaSyB2ITu3buRUO5iUj3ksjLua8y7ZGWysFtE",
    authDomain: "awesome-tensor-309808.firebaseapp.com",
    projectId: "awesome-tensor-309808",
    storageBucket: "awesome-tensor-309808.appspot.com",
    messagingSenderId: "6724624072",
    appId: "1:6724624072:web:6ff6af6f7f1c7abcb38ffd",
    measurementId: "G-LBLYP8VWB7"
    }
);

export const Context = createContext(null)

const auth = firebase.auth()
const db = firebase.firestore()


ReactDOM.render(
    <Context.Provider value={{
        firebase,
        auth,
        db
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);

