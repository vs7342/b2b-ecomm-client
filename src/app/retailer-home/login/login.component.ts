import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent } from '../../shared/toaster.component';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  url_part: string;
  sub: any;

  // Form Elements
  email: string;
  password: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

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

  login() {
    this.userService.login(this.url_part, this.email, this.password).subscribe(data => {
      // Login Success - Save the token
      ConstantsService.setToken(data['data']['token']);

      // Fetch UserType and navigate to relevant page
      this.toastr.showSuccess('Login Successful');
      setTimeout(() => {
        const user_type_id = ConstantsService.getLoggedInUserType();
        if (user_type_id === 1) {
          this.router.navigate(['../products'], { relativeTo: this.route });
        } else if (user_type_id === 2) {
          this.router.navigate(['../management/orders'], { relativeTo: this.route });
        } else if (user_type_id === 3) {
          this.router.navigate(['../management/products'], { relativeTo: this.route });
        }
      }, 1250);
    }, error => {
      this.toastr.showError(error);
    });
  }

  signup() {
    this.router.navigate(['../signup'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
