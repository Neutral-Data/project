import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  router = inject(Router);
  userService = inject(UserService);

  onClickLogout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/home']);
  }

}
