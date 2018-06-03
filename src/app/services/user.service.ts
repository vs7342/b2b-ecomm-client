import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';
import { User } from '../models/User.model';
import { UserNotificationSetting } from '../models/UserNotificationSetting.model';

@Injectable()
export class UserService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  signup(url_part: string, user: User) {
    // Required Fields - Email, Password, First_Name, Last_Name
    const url = this.api_url + '/signup/' + url_part;
    return this.networkService.httpPost(url, user);
  }

  login(url_part: string, email: string, password: string) {
    const url = this.api_url + '/login/' + url_part;
    const post_body = {
      Email: email,
      Password: password
    };
    return this.networkService.httpPost(url, post_body);
  }

  createUser(user: User) {
    // Required Fields - Email, Password, First_Name, Last_Name, UserType_id, Mobile_Number
    // If mobile number is not entered, pass ''
    const url = this.api_url + '/user';
    return this.networkService.httpPost(url, user);
  }

  editUser(user: User) {
    // Required Fields - Email, Password, First_Name, Last_Name, Mobile_Number
    // If mobile number needs to be removed, pass ''
    const url = this.api_url + '/user';
    return this.networkService.httpPut(url, user);
  }

  getAllUsers() {
    const url = this.api_url + '/user';
    return this.networkService.httpGet(url);
  }

  getSingleUser(user_id: number) {
    const url = this.api_url + '/user/' + user_id;
    return this.networkService.httpGet(url);
  }

  editNotificationSetting(user_notification_setting: UserNotificationSetting) {
    const url = this.api_url + '/notification';
    return this.networkService.httpPut(url, user_notification_setting);
  }

  getNotificationSetting(user_id: number) {
    const url = this.api_url + '/notification?User_id=' + user_id;
    return this.networkService.httpGet(url);
  }

  editFCMToken(user_id: number, fcm_token: string) {
    const url = this.api_url + '/fcm';
    const put_body = {
      id: user_id,
      FCM_token: fcm_token
    };
    return this.networkService.httpPut(url, put_body);
  }
}
