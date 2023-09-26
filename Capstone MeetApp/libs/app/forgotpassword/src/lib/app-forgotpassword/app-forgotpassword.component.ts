import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule } from '@ionic/angular';
import {service,events} from '@capstone-meet-app/app/services'
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { FormGroup} from '@angular/forms';

import { HttpClient, HttpClientModule} from '@angular/common/http'
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';



@Component({
  selector: 'capstone-meet-app-app-forgotpassword',
  standalone: true,
  imports: [CommonModule,IonicModule,FormsModule , RouterModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './app-forgotpassword.component.html',
  styleUrls: ['./app-forgotpassword.component.css'],
  providers: [service,HttpClient]
})
export class AppForgotpasswordComponent {
  userType:string|null = '';
  password = '';
  confirmPassword = '';
  token :string|null= '';
  email='';

  forgot_payload={
    message: '', 
    payload: ''
  }
  constructor( private router: Router, private formBuilder: FormBuilder, private apiService: service,  private alertController: AlertController,
    private toastController: ToastController, private loadingController: LoadingController,private authservice: service,private activatedRoute: ActivatedRoute) { 
  }
  
  resetPassword() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    console.log(` Password: ${this.password}, Confirm Password: ${this.confirmPassword}`);
    this.router.navigate(['/login',{ userType: this.userType }]);
  }
  
  async ngOnInit(){

  this.activatedRoute.paramMap.subscribe(params => {
    this.token = params.get('anything'); // 'token' should be the parameter name in your route
    if ( this.token) {
      // Do something with the token, e.g., store it in a variable or use it in your component
      console.log( this.token);
    }
  });

  }
  cancel(){
    this.router.navigate(['/login',{ userType: this.userType }]);

  }
  
  async verifyLink(email:string)
    {
      await this.apiService.verifyPasswordRequest(this.token,email).subscribe((response: any) => { 
        console.log(email);
        console.log(response);
        this.forgot_payload==response;
      });
    }

 

}
