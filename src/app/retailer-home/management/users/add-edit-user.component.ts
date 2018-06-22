import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../models/User.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css'],
  providers: [UserService]
})
export class AddEditUserComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  user: User = new User(0, '', 2, '', '', '', '', '');
  re_password = '';
  is_update_password = true;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Fetch route param which might consist of user id. If it does, then load the user
    const user_id = this.route.snapshot.params['user_id'];
    if (user_id > 0) {
      this.loadUser(user_id);
    }
  }

  loadUser(id: number) {
    this.userService.getSingleUser(id).subscribe(data => {
      if (data['data']) {
        this.user = data['data'];
        this.user.Password = '';

        // Making the password field optional when in edit mode
        this.is_update_password = false;
      } else {
        // This means someone is trying to enter a random user id which is not present in DB.
        // Thus, change the state of component to Add User.
        this.router.navigate(['../', '0'], {relativeTo: this.route});
      }
    }, error => {
      this.toastr.showError(error);
    })
  }

  saveUser() {
    // Check if the user is being created or updated
    if (this.user.id === 0) {

      // Add User - This means all fields are required
      if (
        this.user.First_Name.length > 0 &&
        this.user.Last_Name.length > 0 &&
        this.user.Email.length > 0 &&
        this.user.Password.length > 0 &&
        this.re_password.length > 0
      ) {

          // Now validate if the passwords match or not
          if (this.user.Password === this.re_password) {

            // Finally make the post user call
            this.userService.createUser(this.user).subscribe(data => {
              this.toastr.showSuccess(data['message']);
              setTimeout(() => {
                this.router.navigate(['../'], {relativeTo: this.route});
              }, 1250);
            }, error =>{
              this.toastr.showError(error);
            });

          } else {
            this.toastr.showWarning('Passwords don\'t match.');
          }

      } else {
        this.toastr.showWarning('Kindly fill all the fields.');
      }

    } else {

      // Edit User - This means that password fields are optional
      // First validate if the user has entered in the required fields
      if (
        this.user.First_Name.length > 0 &&
        this.user.Last_Name.length > 0 &&
        this.user.Email.length > 0
      ) {

        // Now check if the update password checkbox is checked
        if (this.is_update_password) {
          // Now check if the passwords are entered are not
          if (this.user.Password.length > 0 && this.re_password.length > 0) {
            // If the passwords are entered, we need to see if they match
            if (this.user.Password !== this.re_password) {
              // Do not proceed since the passwords dont match
              this.toastr.showWarning('Passwords don\'t match.');
              return;
            }
          } else {
            // Do not proceed since password fields are not filled
            this.toastr.showWarning('You need to fill the password fields since you have chosen to update the password!');
            return;
          }
        } else {
          // Since password is not to be updated, make the password attribute blank
          this.user.Password = '';
        }

        // Finally Edit User
        // The control wouldn't have reached here if there was any inconsistencies with inputs
        this.userService.editUser(this.user).subscribe(data => {
          this.toastr.showSuccess(data['message']);
          setTimeout(() => {
            this.router.navigate(['../'], {relativeTo: this.route});
          }, 1250);
        }, error => {
          this.toastr.showError(error);
        });

      } else {
        this.toastr.showWarning('First Name, Last Name and Email ID are required fields.');
      }

    }

  }

}
