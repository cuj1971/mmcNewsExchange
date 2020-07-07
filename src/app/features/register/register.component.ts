import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../../shared/user/user.service';

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
    private fb: FormBuilder, 
    private afAuth: AngularFireAuth, 
    private userService: UserService,
    private _alertController: AlertController) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      password: ['',[Validators.required, Validators.minLength(6)]],
      baseCurrency: [''],
      targetCurrency: ['']
    });
  }

  async register() {
    if (!this.registrationForm.valid) {
      console.log('grrr');      
      return;
    } 
    console.log('register', this.registrationForm.value); 
    this.result = await this.afAuth.createUserWithEmailAndPassword(this.registrationForm.value.email,this.registrationForm.value.password);
    console.log('register / result ', this.result);
    
    const userPrefs = {
      base: this.registrationForm.value.baseCurrency,
      target: this.registrationForm.value.targetCurrency
    }
    
    if( this.result && this.result.user) {
      
      const userCreated = await this.userService.createUser(this.result.user, userPrefs);
      console.log('userCreated', userCreated);

      this._alertController.create({
        header: 'Account Created',
        message: `Created account for: <b>${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}</b>`,
        buttons: [{
          text: 'OK'
        }]
      }).then(alert => alert.present());

      this.result = null
      this.registrationForm.reset();;
    }
  }

}
