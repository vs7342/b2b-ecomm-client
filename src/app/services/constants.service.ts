import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  static getBaseApiUrl() {
    return 'http://localhost:80';
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

}