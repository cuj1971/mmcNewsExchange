import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user/user.service';
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
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });  
  }

  loginUser(){
    this._userService.login(this.loginForm)
  }

  logOutUser(){
    this._userService.logout();
  }

}
