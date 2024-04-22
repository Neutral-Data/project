import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AxiosService } from 'src/app/services/axios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  axiosService = inject(AxiosService);
  router = inject(Router);

  @Output() onSubmitLoginEvent = new EventEmitter();

  username: string = '';
  email: string = '';
  password: string = '';
  login_error: boolean = false;

  onLogin(): void {
    this.axiosService
      .request('POST', '/login', {
        username: this.username,
        password: this.password,
      })
      .then((response) => {
        this.axiosService.setAuthToken(response.data.token);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        console.log(error);
        this.axiosService.setAuthToken(null);
        this.login_error = true;
      });
  }
}
