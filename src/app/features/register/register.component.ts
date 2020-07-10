import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  result;
  user;
  message;

  constructor(
    private _fb: FormBuilder, 
    private _userService: UserService) { }

  ngOnInit(): void {
    this.registrationForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['',[Validators.required, Validators.minLength(6)]],
      baseCurrency: [''],
      targetCurrency: ['']
    });
  }

  regUser(){
    this._userService.register(this.registrationForm)
  }
  

}
