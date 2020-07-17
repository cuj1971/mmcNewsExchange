import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, tap, map, switchMap } from 'rxjs/operators'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { IUser } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  collectionName = 'user';
  result;
  user;
  //public user$: Observable<any>;
  message;
  test;
  private userAFColl: AngularFirestoreCollection<any>;
  private userAFDoc: AngularFirestoreDocument<any>;
  public userProfile;
  public userData: IUser;

  // The BehaviorSubject will store the New York Times Search instance into memory and allows us to emit new values
  private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  public user$: Observable<any> = this._user.asObservable();

  constructor(
    private _afs: AngularFirestore, 
    private _afAuth: AngularFireAuth,
    private _alertController: AlertController,
    private _router:Router) { }

  public returnUser$(): Observable<any> {
    return this.user$
  }

  async register(regForm) {
    if (!regForm.valid) {
      console.log('grrr');      
      return;
    } 
    this.result = await this._afAuth.createUserWithEmailAndPassword(regForm.value.email, regForm.value.password);
    this.user = this.result;
    
    const userPrefs = {
      firstName: regForm.value.firstName,
      lastName: regForm.value.lastName,
      base: regForm.value.baseCurrency,
      target: regForm.value.targetCurrency
    }
    
    if( this.result && this.result.user) {
      
      const userCreated = await this.createUser(this.result.user, userPrefs);

      this._alertController.create({
        header: 'Account Created',
        message: `Created account for: <b>${regForm.value.firstName} ${regForm.value.lastName}</b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

      regForm.reset();
      this.logout();
      this._router.navigate([`tabs/search`]);
    }
  }

  async logout() {
    let EMPTY = new Object();

    await this._afAuth.signOut();
    //this._user.next(EMPTY);
    this.result = null;
    this.user = null;
    this._router.navigate([`tabs/login`]);
  }

  async login(logForm) {

    if (!logForm.valid) {
      console.log(':(');
      return;
    }
    try {
      this.message = '';
      const { email, password} = logForm.value;
      this.result = await this._afAuth.signInWithEmailAndPassword(email, password);
      this.user = this.result.user;

      this.test = `hello`;
      logForm.reset();
      this._router.navigate([`tabs/login/profile`]);
    } catch (error) {
      this.message = error.message;
      console.log('this.message', this.message);
      this._alertController.create({
        header: 'Authentication Error',
        message: `<b>${error.message}</b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
    }

  }

  async createUser(user, prefs) {
    console.log('prefs', prefs);
    console.log('user.uid', user.uid);
    console.log('user.email', user.email);

    const  newUser = {
      uid: user.uid,
      firstName: prefs.firstName,
      lastName: prefs.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: new Date(),
      baseCurrency: prefs.base,
      targetCurrency: prefs.target
    }

    const usersCollection = this._afs.collection(`${this.collectionName}`);
    await usersCollection.add(newUser);

    /*
    const baseCollection = this._afs.collection('baseCurrency');
    baseCollection.add(
      {
        [newUser.uid] : newUser.baseCurrency
      })

    const targetCollection = this._afs.collection('targetCurrency');
    targetCollection.add(
      {
        [newUser.uid] : newUser.targetCurrency
      })
      */
  }

  public async getUser() {
    let baseCurrency: string;
    let targetCurrency: string;
    console.log('this.user.uid', this.user.uid)
    
    return await this._afs.collection<IUser>('user', ref => ref.where('uid', '==', this.user.uid)).valueChanges().pipe(
      tap(res => console.log('res', res)),
      tap(res => this._user.next(res)),
      tap(res => this.userData = {
        baseCurrency : res[0].baseCurrency,
        targetCurrency : res[0].targetCurrency
        }),
      tap(res => console.log('this.userData', this.userData)),
      switchMap(() => this.returnUser$())
    )
  }

  public async update(form){
    console.log('update user');
    console.log('uid', this.result.user.uid);
    let id;
/*
    this._afs.collection<IUser>('user', ref => ref.where('uid', '==', this.result.user.uid)).
    snapshotChanges().
    pipe(
      map(actions => actions.map(a => {
        //id = a.payload.doc.ref
      }))
    )
    console.log('id', id);
 */

 /*
    const upd = this._afs.doc('user/BzF7T5BS9vNYyrkhfU4m').update({
      targetCurrency: form.value.targetCurrency
    })

    this.user$.subscribe();
*/
  }
}
