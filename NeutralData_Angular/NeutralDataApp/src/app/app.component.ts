import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
