import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  uid;
  user$: Observable<any>;

  constructor(
    private _userService:UserService,
    private _afs: AngularFireAuth) { }

  ngOnInit(): void {
    //this.getAuthUser()
  }

  async getAuthUser(){
    //this.uid = this._afs.currentUser;
    this.uid = await this._afs.currentUser.then(
      res => this.uid = res.email
    ).catch(error => console.warn(error));

    console.log('this.uid', this.uid);
    //this.user$ = this._userService.getUser()

  }

  async ngAfterViewInit() {
    //this.uid = this._afs.currentUser;
    this.uid = await this._afs.currentUser.then(
      res => this.uid = res.email
    ).catch(error => console.warn(error));

    console.log('this.uid', this.uid);
    //this.user$ = this._userService.getUser()
  }

}
