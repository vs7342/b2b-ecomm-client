import { Injectable, isDevMode } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './user.service';

import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import { ConstantsService } from './constants.service';

@Injectable()
export class FcmService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase, private userService: UserService) { }

  updateTokenInDB(token, user_id) {
    // Variable to decide whether we want to update fcm in our DB
    let is_token_refreshed = true;

    // First check if the token is saved in local storage
    const local_fcm_token = ConstantsService.getFcmToken();
    if (local_fcm_token) {
      // Check if the local fcm token matches the one we got from fcm server
      is_token_refreshed = !(local_fcm_token === token);
    }

    // Update FCM token in DB and local storage only if token is refreshed - Call user service edit fcm token
    if (is_token_refreshed) {
      ConstantsService.setFcmToken(token);
      this.userService.editFCMToken(user_id, token).subscribe(data => {
        if (isDevMode()) {
          console.log('FCM Token Updated in DB');
        }
      }, error => {
        if (isDevMode()) {
          console.log(error);
        }
      });
    }
  }

  getPermission(user_id: number) {
    // Get user permission to send desktop notification
    this.messaging.requestPermission()
      .then(() => {
        if (isDevMode()) {
          console.log('Notification permission granted.');
        }

        // Since the permission was granted, we can fetch token
        return this.messaging.getToken();
      })
      .then(token => {

        // Now we have the fcm token.. save it in DB / local storage
        if (isDevMode()) {
          console.log(token);
        }
        this.updateTokenInDB(token, user_id);
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  // This function is for handling notification payload received
  // Those are stored in the current message variable which can be referenced in the component
  receiveMessage() {
    this.messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      this.currentMessage.next(payload);
    });

  }

}
