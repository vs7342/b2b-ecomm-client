import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/User.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
  providers: [UserService]
})
export class ManageUsersComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  users: User[] = [];
  user_type_id = 0;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers(this.user_type_id).subscribe(data => {
      this.users = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  changeUserStatus(user_id: number, is_enabled: boolean) {
    this.userService.updateUserStatus(user_id, is_enabled).subscribe(data => {
      this.toastr.showSuccess(data['message']);
    }, error => {
      this.toastr.showError(error);
      // Load users since we want ui-switch to go back to its previous state
      this.loadUsers();
    });
  }

  editUser(id: number) {
    this.router.navigate(['' + id], {relativeTo: this.route});
  }

  addUser() {
    this.router.navigate(['0'], {relativeTo: this.route});
  }

}
