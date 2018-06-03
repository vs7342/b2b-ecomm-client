import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';
import { Product } from '../models/Product.model';

@Injectable()
export class ProductService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  createProduct(product: Product) {
    const url = this.api_url + '/product';
    return this.networkService.httpPost(url, product);
  }

  editProduct(product: Product) {
    const url = this.api_url + '/product';
    return this.networkService.httpPut(url, product);
  }

  getSingleProduct(product_id: number) {
    const url = this.api_url + '/product/' + product_id;
    return this.networkService.httpGet(url);
  }

  getAllProducts() {
    const url = this.api_url + '/product' ;
    return this.networkService.httpGet(url);
  }

  createAlert(product_id: number, user_id: number) {
    const url = this.api_url + '/alert';
    const post_body = {
      Product_id: product_id,
      User_id: user_id
    };
    return this.networkService.httpPost(url, post_body);
  }

  getAlert(product_id: number, user_id: number) {
    const url = this.api_url + '/alert?Product_id=' + product_id + '&User_id=' + user_id;
    return this.networkService.httpGet(url);
  }
}
