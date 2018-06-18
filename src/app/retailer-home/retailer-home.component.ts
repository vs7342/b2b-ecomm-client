import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicService } from '../services/public.service';
import { ToasterComponent } from '../shared/toaster.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-retailer-home',
  templateUrl: './retailer-home.component.html',
  styleUrls: ['./retailer-home.component.css'],
  providers: [PublicService]
})
export class RetailerHomeComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  retailer_url_part: string;
  retailer_website_name: string;
  retailer_template_id: number;
  is_user_logged_in: boolean;
  user_type_id: number;

  constructor(private publicService: PublicService, private route: ActivatedRoute, private router: Router) { }

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

}
