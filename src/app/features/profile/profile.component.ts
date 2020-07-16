import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: Observable<any>;

  constructor(
    private _userService: UserService) { }

  ngOnInit(): void {
    this.getPrefs()
  }

  async getPrefs() {
    //console.log('this._userService.result.user.uid: ', this._userService.result.user.uid);
    //const uid =  this._userService.result.user.uid;
    //console.log('uid', uid);
    this.user$ = this._userService.getUser();
  }
}
