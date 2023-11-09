import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AxiosService } from 'src/app/services/axios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

	axiosService = inject(AxiosService);
	router = inject(Router);
	formBuilder = inject(FormBuilder);
	
	isChecked = false;
	usernameExists = false;

	showPassword() {
		this.show = !this.show;
	}

	checkboxChange() {
		this.isChecked = true;
	  }

	touchedUsernameInput(){
		this.usernameExists = false;
	  }

	registerForm=this.formBuilder.group({
		firstName:['',Validators.required],
		lastName:['',Validators.required],
		username:['',Validators.required],
		email:['',[Validators.required,Validators.email]],
		password: ['',Validators.required]
	  })
	
	  show: boolean = false;

  onRegister(): void {


if(this.registerForm.valid && this.isChecked){
	try{
		this.axiosService.request(
			"GET",
			"/user/exists/" + this.registerForm.value.username,
			{}).then(
			response => {
				console.log(response.data);
				if(response.data == "Exists"){
					this.usernameExists = true;
				}
			}).catch(
			error => {
				console.log(error);
			}
		);
		this.axiosService.request(
			"POST",
			"/register",
			{
				firstName: this.registerForm.value.firstName,
				lastName: this.registerForm.value.lastName,
				username: this.registerForm.value.username,
				email: this.registerForm.value.email,
				password: this.registerForm.value.password
			}).then(
			response => {
				this.axiosService.setAuthToken(response.data.token);
				this.router.navigateByUrl('/home');
			}).catch(
			error => {
				console.log(error);				
				this.axiosService.setAuthToken(null);
			}
		);

	}catch(error){
		console.log(error);
	}

    }
    else{
		if(!this.isChecked){
			alert("Terms and conditions must be accepted.");
		}else{
      		this.registerForm.markAllAsTouched();
      		alert("There has been an error in the data, please check the fields.");
		}
    }

	}

	get firstName(){
		return this.registerForm.controls.firstName;
	  }

	  get lastName(){
		return this.registerForm.controls.lastName;
	  }

	  get username(){
		return this.registerForm.controls.username;
	  }

	get email(){
		return this.registerForm.controls.email;
	  }

	get password(){
		return this.registerForm.controls.password;
	  }

}

