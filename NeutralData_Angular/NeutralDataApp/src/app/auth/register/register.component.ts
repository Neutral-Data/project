import { Component } from '@angular/core';
import { AxiosService } from 'src/app/services/axios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private axiosService: AxiosService) { }

  firstName: string = "";
  lastName: string = "";
  username: string = "";
  email: string = "";
  password: string = "";

  onRegister(): void {
		this.axiosService.request(
		    "POST",
		    "/register",
		    {
		        firstName: this.firstName,
		        lastName: this.lastName,
		        username: this.username,
            email: this.email,
		        password: this.password
		    }).then(
		    response => {
		        this.axiosService.setAuthToken(response.data.token);
		    }).catch(
		    error => {
		        this.axiosService.setAuthToken(null);
		    }
		);
	}

}
