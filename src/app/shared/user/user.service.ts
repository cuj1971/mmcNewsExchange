import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'user';

  constructor(private afs: AngularFirestore) { }

  createUser(user, prefs) {
    console.log('prefs', prefs);
    const  newUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      baseCurrency: prefs.base,
      targetCurrency: prefs.target
    }

    const usersCollection = this.afs.collection(`${this.collectionName}`);
    return usersCollection.add(newUser);
  }

  getUsers() {
    return this.afs.collection(`${this.collectionName}`).valueChanges({ idField: 'id'});
  }

  getUser(id) {
    return this.afs.doc(`${this.collectionName}/${id}`).valueChanges();
  }
}
