import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class ConstantsService {

  static getBaseApiUrl() {
    return 'http://localhost:80';
  }

  static getChatSocket() {
    return io('http://localhost:80/messages');
  }

  static getToken() {
    // Get the 'token' variable from the local storage
    const token = localStorage.getItem('token');
    // Check if a token is not null/undefined.. else return blank string
    if (token) {
      return token;
    } else {
      return '';
    }
  }

  static setToken(token: string) {
    // Set the 'token' variable in the local storage
    localStorage.setItem('token', token);
  }

  static deleteToken() {
    // Remove token - This will be used by logout
    localStorage.removeItem('token');
  }

  static getLoggedInUserType() {
    // Get the token and decode the payload part
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['user']['UserType_id'];
    } else {
      return null;
    }
  }

  static getLoggedInUserId() {
    // Get the token and decode the payload part
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['user']['id'];
    } else {
      return null;
    }
  }

  static setFcmToken(token: string) {
    localStorage.setItem('fcm', token);
  }

  static getFcmToken() {
    const token = localStorage.getItem('fcm');
    // Check if a token is not null/undefined.. else return blank string
    if (token) {
      return token;
    } else {
      return '';
    }
  }

  static deleteFcmToken() {
    localStorage.removeItem('fcm');
  }

  static getLoggedInUser() {
    // Get the token and decode the payload part
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['user'];
    } else {
      return null;
    }
  }

  static getS3Details() {
    return {
      ACCESS_KEY_ID : 'dummy_access_key_id',
      SECRET_ACCESS_KEY : 'dummy_secret',
      S3_REGION : 'dummy_region',
      BUCKET : 'dummy_bucket_name',
    };
  }
}
