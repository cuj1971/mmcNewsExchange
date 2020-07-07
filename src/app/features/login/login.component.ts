import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/user/user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message;
  user;

  constructor(
    private _fb: FormBuilder, 
    private _afAuth: AngularFireAuth, 
    private _userService: UserService,
    private _router:Router,
    private _alertControl: AlertController
  ) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });  
  }

  async login() {
    if (!this.loginForm.valid) {
      console.log(':(');
      return;
    }
    try {
      this.message = '';
      const { email, password} = this.loginForm.value;
      this.user = await this._afAuth.signInWithEmailAndPassword(email, password);

      this.loginForm.reset();
      this._router.navigate([`/home`]);
    } catch (error) {
      this.message = error.message;
      console.log('this.message', this.message);
      this._alertControl.create({
        header: 'Authentication Error',
        message: `<b>${error.message}</b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());
    }
  }

}
