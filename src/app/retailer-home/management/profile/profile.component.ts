import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/User.model';
import { ToasterComponent } from '../../../shared/toaster.component';
import {UserService} from '../../../services/user.service';
import {ConstantsService} from '../../../services/constants.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService]
})
export class ProfileComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  user = new User(0, '', 3, '', '', '', '', '');

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    // get logged in user id.. and subsequently the entire user object
    const user_id = ConstantsService.getLoggedInUserId();
    if (user_id) {
      this.userService.getSingleUser(user_id).subscribe(data => {
        this.user = data['data'];
      }, error => {
        this.toastr.showError(error);
      });
    }
  }

  saveProfile() {
    // Save details
    this.userService.editUser(this.user).subscribe(data => {
      this.toastr.showSuccess(data['message']);
    }, error => {
      this.toastr.showError(error);
    });
  }

}
