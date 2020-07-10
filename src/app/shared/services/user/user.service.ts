import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { first, tap, map, switchMap } from 'rxjs/operators'
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

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
  //public user$: Observable<any>;
  public userProfile;

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
    
    const userPrefs = {
      base: regForm.value.baseCurrency,
      target: regForm.value.targetCurrency
    }
    
    if( this.result && this.result.user) {
      
      this.user = this.result.user.uid;
      console.log('this.result.user.uid', this.result.user.uid);

      const userCreated = await this.createUser(this.result.user, userPrefs);

      this._alertController.create({
        header: 'Account Created',
        message: `Created account for: <b>${regForm.value.firstName} ${regForm.value.lastName}</b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

      this.result = null
      regForm.reset();
      this._router.navigate([`/search`]);
    }
  }

  async logout() {
    await this._afAuth.signOut();
    //this._router.navigate([`/login`]);
  }

  async login(logForm) {

    if (!logForm.valid) {
      console.log(':(');
      return;
    }
    try {
      this.message = '';
      const { email, password} = logForm.value;
      this.user = await this._afAuth.signInWithEmailAndPassword(email, password);
  
      //this.getUser();
      //this.userAFDoc = this._afs.doc<any>("user/Ze8XDp6oBLlL6uyHlld6");
      
      //this.userAFDoc = this._afs.doc<any>(`baseCurrency/${(await this._afAuth.currentUser).uid}`);

      /*
      this._afs.collection('baseCurrency', ref => ref.where('uid', '==', 'lYPn25OY41ajb3F0vcX9USyhb6O2')).valueChanges().pipe(
        tap(res => console.log('res', res)),
        tap(res => this._user.next(res))
      );
      */
      
      //this.userProfile = this.userAFColl.doc()

      this.test = `hello`;
      logForm.reset();
      this._router.navigate([`tabs/search`]);
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

    const usersCollection = this._afs.collection(`${this.collectionName}`);
    usersCollection.add(newUser);

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

  }

  public getUser() {
    //const id = this.user.uid;
    //const id = (await this._afAuth.currentUser).uid;
    //console.log('id', id);
/*
    return this._afs.doc(`${this.collectionName}/${id}`).valueChanges().pipe(
      tap(res => console.log('res', res)),
      tap(res => this._user.next(res))
    );
*/
/*
    return this._afs.collection('user', ref => ref.where('uid', '==', 'K0gHPjVMJyWtgfoA6eLChVlCuqZ2')).valueChanges().pipe(
      tap(res => console.log('res', res)),
      tap(res => this._user.next(res)) 
    )
*/

    return this._afs.collection('user', ref => ref.where('email', '==', 'bob@dylan.com')).valueChanges().pipe(
      tap(docs => console.log('docs', docs)),
      map(val => val.length > 0 ? val[0] : null),
      tap(res => this._user.next(res)),
      switchMap(() => this.returnUser$())
    )

/*
    const r = await this._afs.doc(`user/Ze8XDp6oBLlL6uyHlld6`).get().pipe(
      //tap(res => console.log('res', res)),
      //tap(res => this._user.next(res))
    ).toPromise();
    this._user.next(r)
    console.log('user:', this._user.value);
    
    return r;
*/
  }

}
