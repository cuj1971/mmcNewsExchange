import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  currencyForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
    private _modalCtrl:ModalController) { }

  ngOnInit(): void {
    this.currencyForm = this._fb.group({
      targetCurrency: ['', Validators.required]
    });
  }

  async updateUser(){
    const update = await this._userService.update(this.currencyForm);
    this.dismissModal();
  }

  dismissModal(){
    this._modalCtrl.dismiss();
  }

}
