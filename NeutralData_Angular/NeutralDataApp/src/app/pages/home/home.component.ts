import { Component, OnInit, inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

   userService = inject(UserService);

  ngOnInit(): void {
    // window.addEventListener('beforeunload', () => {
    //   this.userService.clearToken();});
  
  }

  
}
