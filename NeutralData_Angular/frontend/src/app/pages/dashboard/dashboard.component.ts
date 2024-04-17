import { Component, OnInit } from '@angular/core';
import { User } from '../../user';

import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public users!: Array<User>;
  public editUser: User;
  public deleteUser: User;

  constructor(
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().then((res) => {
      this.users = res;
    });
    this.modalService.dismissAll();
  }

  public onAddUser(addForm: NgForm): void {
    document.getElementById('add-user-form').click();
    this.userService.addUser(addForm.value);
    window.location.reload();
  }

  public onUpdateUser(user: User): void {
    this.userService.updateUser(user);
    window.location.reload();
  }

  public onDeleteUser(userId: number): void {
    this.userService.deleteUser(userId);
    window.location.reload();
  }

  public onOpenModal(user: User, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#new-user-form-modal');
    }
    if (mode === 'edit') {
      this.editUser = user;
      button.setAttribute('data-target', '#edit-user-form-modal');
    }
    if (mode === 'delete') {
      this.deleteUser = user;
      button.setAttribute('data-target', '#delete-user-modal');
    }
    container?.appendChild(button);
    button.click();
  }
}
