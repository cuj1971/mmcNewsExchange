import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { Observable } from 'rxjs';
import { IUser } from '../../shared/interfaces/user';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$: Observable<IUser>;

  constructor(
    private _userService: UserService,
    public _modalController:ModalController) { }

  ngOnInit(): void {
    this.getPrefs()
  }

  async getPrefs() {
    //console.log('this._userService.result.user.uid: ', this._userService.result.user.uid);
    //const uid =  this._userService.result.user.uid;
    //console.log('uid', uid);
    this.user$ = (await this._userService.getUser()).pipe(first());    
  }

  async presentModal() {
    const modal = await this._modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }

  logout(){
    this._userService.logout();
  }
}
