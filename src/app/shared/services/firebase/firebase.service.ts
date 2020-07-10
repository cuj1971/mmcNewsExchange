// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";
import { Injectable } from '@angular/core';

// replace the above three lines with Nico import
//import {firebase} from '@nomades-ateliers/firebase'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  config = null;
  database = null;
  auth = null;
  currentUser = null;
  
  constructor(config) {
    this.config = config;

    // run default method
    this.initConfig();
    this.loadService();
   }

  // ######### All config methods ###########
  // ########################################

  // config firbase
  initConfig() {
    firebase.initializeApp(this.config);
  }
  // load services firebase
  loadService() {
    this.database = firebase.database();
    this.auth = firebase.auth();
  }

  // ######### Class database logic #########
  // ########################################

  /**
   * Write into Firebase Collection
   * @param {String} ref Collection Database
   * @param {Any} data Value to save
   */
  push(ref, data) {
    if (this.currentUser) {
      return this.database.ref(ref).child(this.currentUser.uid).push(data);
    } else {
      return this.database.ref(ref).push(data);
    }
  }

  update(ref, data) {
    if (this.currentUser) {
      return this.database.ref(ref).child(this.currentUser.uid).update(data);
    } else {
      return this.database.ref(ref).update(data);
    }
  }

  set(ref, data) {
    if (this.currentUser) {
      return this.database.ref(ref).child(this.currentUser.uid).set(data);
    } else {
      return this.database.ref(ref).set(data);
    }
  }

  remove(ref, key) {
    if (this.currentUser) {
      return this.database.ref(ref).child(this.currentUser.uid).child(key).remove();
    } else {
      return this.database.ref(ref).child(key).remove();
    }
  }


  // ######### Class auth Logic #############
  // ########################################

  signin() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(googleProvider)
    .then((result)=> {
      this.currentUser =  result.user
      console.log('set currentUser-> ', this.currentUser);
      return this.currentUser;
    })
    .catch(err => {
      alert('Error Firebase auth')
      return Promise.reject(err);
    });
  }

  signout() {
    this.auth.signOut();
  }

}
