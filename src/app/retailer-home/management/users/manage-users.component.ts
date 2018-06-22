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

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  editUser(id: number) {
    this.router.navigate(['' + id], {relativeTo: this.route});
  }

  addUser() {
    this.router.navigate(['0'], {relativeTo: this.route});
  }

}
