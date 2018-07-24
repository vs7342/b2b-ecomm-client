import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/User.model';
import { ToasterComponent } from '../../shared/toaster.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [UserService]
})
export class SignupComponent implements OnInit, OnDestroy {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  user = new User(-1, '', -1, '', '', '', '', '', true);
  re_password = '';
  url_part: string;
  sub: any;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Fetch url_part from parent snapshot
    this.sub = this.route.parent.params.subscribe(params => {
      this.url_part = params['url_part'];

      // If something is wrong with the url_part, navigate to AppComponent
      if (!this.url_part) {
        this.router.navigate(['']);
      }
    });
  }

  signup() {
    // First validate if the user has entered in all the fields
    if (
        this.user.First_Name.length > 0 &&
        this.user.Last_Name.length > 0 &&
        this.user.Password.length > 0 &&
        this.user.Email.length > 0 &&
        this.re_password.length > 0
    ) {
      // Now validate if the passwords match or not
      if (this.user.Password === this.re_password) {

        // Finally make the signup call
        this.userService.signup(this.url_part, this.user).subscribe(data => {

          // Signup Success - Save the token, display the message and navigate to home page
          ConstantsService.setToken(data['data']['token']);
          this.toastr.showSuccess('Congratulations! Signup successful.');
          setTimeout(() => {
            this.router.navigate(['../products'], { relativeTo: this.route });
          }, 1250);

        }, error => {
          this.toastr.showError(error);
        });
      } else {
        this.toastr.showWarning('Passwords don\'t match');
      }
    } else {
      this.toastr.showWarning('Kindly fill all the fields');
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
