import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AxiosService } from '../services/axios.service';
import { UserService } from '../services/user.service';

export const hasRoleAdminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const axiosService = inject(AxiosService);
  const userService = inject(UserService);

  if(userService.getUser().role == 'ADMIN'){
    try {
      const response = await axiosService.request(
          "GET",
          "/user/admin",
          {}
      );
      return response.data=='Correcto' ? true : false;
    } catch (error) {
      console.error(error);
      router.navigate(['/login']);
      return false;
    }
  }else{
    router.navigate(['/login']);
    return false;
  }
};

