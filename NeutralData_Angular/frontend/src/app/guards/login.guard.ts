import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const loginGuard = () => {

  const router = inject(Router);
  const userService = inject(UserService);

  if((localStorage.getItem('token') || userService.isLogged()) ){
    if(userService.getUser().enable == true){
      return true;
    }else{
      alert('Your account is inactive. Please contact support for assistance.');
      router.navigate(['/login']);
      return false;
    }
  }else{
    router.navigate(['/login']);
    return false;
  }
}
