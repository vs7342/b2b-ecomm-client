import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { ConstantsService } from './constants.service';

@Injectable()
export class PublicService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  getAllRetailers() {
    const url = this.api_url + '/public/retailers';
    return this.networkService.httpGet(url);
  }

  getSingleRetailer(url_part: string) {
    const url = this.api_url + '/public/retailers/' + url_part;
    return this.networkService.httpGet(url);
  }

  getAllProducts(url_part: string) {
    const url = this.api_url + '/public/' + url_part + '/products/';
    return this.networkService.httpGet(url);
  }

  getSingleProducts(url_part: string, product_id: number) {
    const url = this.api_url + '/public/' + url_part + '/products/' + product_id;
    return this.networkService.httpGet(url);
  }
}
