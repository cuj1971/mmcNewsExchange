import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _afAuth: AngularFireAuth,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this._afAuth.onAuthStateChanged(user => {
      if (user) {
        // user is signed in so redirect to search page
        console.log('user signed in: ', user.email, user.uid)
        this._router.navigate(['/search']);
      }
      else {
        // no user signed in so redirect to login page
        console.log('not signed in');
        this._router.navigate(['/login']);
      }
    })
  }  

}
