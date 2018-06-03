import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';
import { Cart } from '../models/Cart.model';

@Injectable()
export class CartService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  addProductToCart(cart: Cart) {
    const url = this.api_url + '/cart';
    return this.networkService.httpPost(url, cart);
  }

  changeProductQuantity(cart: Cart) {
    const url = this.api_url + '/cart';
    return this.networkService.httpPut(url, cart);
  }

  getCartForUser(user_id: number) {
    const url = this.api_url + '/cart?User_id=' + user_id;
    return this.networkService.httpGet(url);
  }

  emptyCart(user_id: number) {
    const url = this.api_url + '/cart';
    const delete_body = {
      User_id: user_id
    };
    return this.networkService.httpDelete(url, delete_body);
  }
}
