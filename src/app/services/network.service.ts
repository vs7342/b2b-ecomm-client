import { Injectable, isDevMode } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './constants.service';

@Injectable()
export class NetworkService {

  constructor(private http: Http) { }

  /**
   * Utility function to create a header object with the api access token
   * @returns {Headers}
   */
  private static getHeaders() {
    return new Headers({
      'Authorization': ConstantsService.getToken()
    });
  }

  /**
   * Makes an HTTP GET request to the specified url
   * @param url
   * @returns {Observable}
   */
  httpGet(url: string) {
    return this.http.get(url, {headers: NetworkService.getHeaders()})
      .map((response: Response) => {
        // Return the data blindly.. individual service calls will take care of handling the data received
        return response.json();
      })
      .catch((error: Response) => {
        const response_json = error.json();
        if (response_json.hasOwnProperty('message')) {
          // This means that server returned a response. but with a status code different than 200.
          // Since api returns a message, just return that message
          return Observable.throw(response_json['message']);
        } else {
          // More of a client not connecting to api / request not completing stuff
          // Return a generic error
          if (isDevMode()) {
            console.error('Error in http GET: ' + error);
          }
          return Observable.throw('Something went wrong. Please contact Admin.');
        }
      });
  }

  /**
   * Makes an HTTP POST request to the specified url
   * @param url
   * @param postBody
   * @returns {Observable}
   */
  httpPost(url: string, postBody: any) {
    return this.http.post(url, postBody, {headers: NetworkService.getHeaders()})
      .map((response: Response) => {
        // Return the data blindly.. individual service calls will take care of handling the data received
        return response.json();
      })
      .catch((error: Response) => {
        const response_json = error.json();
        if (response_json.hasOwnProperty('message')) {
          // This means that server returned a response. but with a status code different than 200.
          // Since api returns a message, just return that message
          return Observable.throw(response_json['message']);
        } else {
          // More of a client not connecting to api / request not completing stuff
          // Return a generic error
          if (isDevMode()) {
            console.error('Error in http POST: ' + error);
          }
          return Observable.throw('Something went wrong. Please contact Admin.');
        }
      });
  }

  /**
   * Makes an HTTP PUT request to the specified url
   * @param url
   * @param putBody
   * @returns {Observable}
   */
  httpPut(url: string, putBody: any) {
    return this.http.put(url, putBody, {headers: NetworkService.getHeaders()})
      .map((response: Response) => {
        // Return the data blindly.. individual service calls will take care of handling the data received
        return response.json();
      })
      .catch((error: Response) => {
        const response_json = error.json();
        if (response_json.hasOwnProperty('message')) {
          // This means that server returned a response. but with a status code different than 200.
          // Since api returns a message, just return that message
          return Observable.throw(response_json['message']);
        } else {
          // More of a client not connecting to api / request not completing stuff
          // Return a generic error
          if (isDevMode()) {
            console.error('Error in http PUT: ' + error);
          }
          return Observable.throw('Something went wrong. Please contact Admin.');
        }
      });
  }

  httpDelete(url: string, deleteBody: any) {
    return this.http.delete(url, new RequestOptions({ headers: NetworkService.getHeaders(), body: deleteBody }))
      .map((response: Response) => {
        // Return the data blindly.. individual service calls will take care of handling the data received
        return response.json();
      })
      .catch((error: Response) => {
        const response_json = error.json();
        if (response_json.hasOwnProperty('message')) {
          // This means that server returned a response. but with a status code different than 200.
          // Since api returns a message, just return that message
          return Observable.throw(response_json['message']);
        } else {
          // More of a client not connecting to api / request not completing stuff
          // Return a generic error
          if (isDevMode()) {
            console.error('Error in http DELETE: ' + error);
          }
          return Observable.throw('Something went wrong. Please contact Admin.');
        }
      });
  }

}
