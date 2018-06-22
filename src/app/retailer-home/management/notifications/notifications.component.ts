import { Component, OnInit, ViewChild } from '@angular/core';
import { UserNotificationSetting } from '../../../models/UserNotificationSetting.model';
import { ConstantsService } from '../../../services/constants.service';
import { User } from '../../../models/User.model';
import { UserService } from '../../../services/user.service';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [UserService]
})
export class NotificationsComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  setting: UserNotificationSetting = new UserNotificationSetting(0, 0, false, false, false);
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    // Get logged in user and subsequently their notification settings
    this.user = ConstantsService.getLoggedInUser() as User;

    // Fetch Notification Settings
    if (this.user) {
      this.userService.getNotificationSetting(this.user.id).subscribe(data => {
        this.setting = data['data'];
      }, error => {
        this.toastr.showError(error);
      });
    }
  }

  // Save notification settings
  saveSettings() {
    this.userService.editNotificationSetting(this.setting).subscribe(data => {
      this.toastr.showSuccess(data['message']);
    }, error => {
      this.toastr.showError(error);
    });
  }

}
