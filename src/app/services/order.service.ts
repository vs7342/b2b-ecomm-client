import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';

@Injectable()
export class OrderService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  createOrder(user_id: number, shipping_address_id: number, billing_address_id: number) {
    const url = this.api_url + '/order';
    const post_body = {
      User_id: user_id,
      Shipping_Address_id: shipping_address_id,
      Billing_Address_id: billing_address_id
    };
    return this.networkService.httpPost(url, post_body);
  }

  getSingleOrder(order_id: number) {
    const url = this.api_url + '/order?Order_id=' + order_id;
    return this.networkService.httpGet(url);
  }

  getAllOrdersForUser(user_id: number) {
    const url = this.api_url + '/order?User_id=' + user_id;
    return this.networkService.httpGet(url);
  }

  getAllOrdersPerStatus(status_type_id: number) {
    const url = this.api_url + '/order?StatusType_id=' + status_type_id;
    return this.networkService.httpGet(url);
  }

  getAllOrdersInSystem() {
    const url = this.api_url + '/order';
    return this.networkService.httpGet(url);
  }

  updateOrder(order_id: number, status_type_id: number, tracking_id: number) {
    const url = this.api_url + '/order';
    const put_body = {
      id: order_id,
      StatusType_id: status_type_id,
      Tracking_id: tracking_id
    };
    return this.networkService.httpPut(url, put_body);
  }
}
