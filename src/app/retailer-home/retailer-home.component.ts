import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicService } from '../services/public.service';
import { ToasterComponent } from '../shared/toaster.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from '../services/constants.service';
import { User } from '../models/User.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-retailer-home',
  templateUrl: './retailer-home.component.html',
  styleUrls: ['./retailer-home.component.css'],
  providers: [PublicService, UserService]
})
export class RetailerHomeComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  retailer_url_part: string;
  retailer_website_name: string;
  retailer_template_id: number;
  is_user_logged_in: boolean;
  user_type_id: number;

  // Password modal related attributes
  password_modal_displayed = false;
  current_password = '';
  new_password = '';
  re_password = '';

  constructor(
    private publicService: PublicService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.fetchRetailerDetails();
    this.determineUserDetails();
  }

  routerLinkActivated() {
    this.fetchRetailerDetails();
    this.determineUserDetails();
  }

  determineUserDetails() {
    // Determine if the user is logged in or not
    if (ConstantsService.getToken()) {
      // Since the user is logged in, the user will also have a user type
      this.is_user_logged_in = true;
      this.user_type_id = ConstantsService.getLoggedInUserType();
    } else {
      this.is_user_logged_in = false;
      this.user_type_id = -1;
    }
  }

  fetchRetailerDetails() {
    // First fetch selected retailer (using the url_part parameter in activated route)
    this.retailer_url_part = this.route.snapshot.params['url_part'];
    this.publicService.getSingleRetailer(this.retailer_url_part).subscribe(data => {
      if (data['data']) {
        // Url entered was correct
        this.retailer_website_name = data['data']['Website_Title'];
        this.retailer_template_id = data['data']['Client_Template_id'];
      } else {
        // Url part entered was incorrect / not found in db - Navigate to app component
        this.router.navigate(['']);
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  logout() {
    // Delete the token
    ConstantsService.deleteToken();

    // Navigate to Login Component
    this.router.navigate(['./login'], { relativeTo: this.route });
  }

  showPasswordModal() {
    this.password_modal_displayed = true;
  }

  hidePasswordModal() {
    this.password_modal_displayed = false;
  }

  updatePassword() {
    // Check if all the fields are filled
    if (
      this.current_password.length > 0 &&
      this.new_password.length > 0 &&
      this.re_password.length > 0) {

      // Now check if the new password and re-enter password fields match or not
      if (this.new_password === this.re_password) {

        // Everything seems to be fine.. Now fetch user id and make the update password call
        const logged_in_user = ConstantsService.getLoggedInUser() as User;
        if (logged_in_user) {
          this.userService.updatePassword(logged_in_user.id, this.current_password, this.new_password).subscribe(data => {
            // Show success message
            this.toastr.showSuccess(data['message']);

            // Close the modal and reset the fields
            this.password_modal_displayed = false;
            this.current_password = '';
            this.new_password = '';
            this.re_password = '';
          }, error => {
            this.toastr.showError(error);
          });
        }

      } else {
        this.toastr.showWarning('Passwords don\'t match');
      }

    } else {
      this.toastr.showWarning('Kindly fill all the fields');
    }
  }

}
