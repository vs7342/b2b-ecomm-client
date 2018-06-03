import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { NetworkService } from './network.service';
import { Address } from '../models/Address.model';

@Injectable()
export class AddressService {
  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  createAddress(address: Address) {
    const url = this.api_url + '/address';
    return this.networkService.httpPost(url, address);
  }

  editAddress(address: Address) {
    const url = this.api_url + '/address';
    return this.networkService.httpPut(url, address);
  }

  getSingleAddress(address_id: number) {
    const url = this.api_url + '/address?Address_id=' + address_id;
    return this.networkService.httpGet(url);
  }

  getUserAddresses(user_id: number) {
    const url = this.api_url + '/address?User_id=' + user_id;
    return this.networkService.httpGet(url);
  }

}
