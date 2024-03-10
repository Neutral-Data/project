import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const loginGuard = () => {

  const router = inject(Router);
  const userService = inject(UserService);

  if(localStorage.getItem('token') || userService.isLogged() ){
    return true;
  }else{
    router.navigate(['/login']);
    return false;
  }
}
