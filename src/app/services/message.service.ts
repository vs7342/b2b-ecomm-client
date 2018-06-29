import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { ConstantsService } from './constants.service';
import { Message } from '../models/Message.model';

@Injectable()
export class MessageService {

  api_url: string;

  constructor(private networkService: NetworkService) {
    this.api_url = ConstantsService.getBaseApiUrl();
  }

  startConversation(customer_service_user_id: number) {
    const url = this.api_url + '/conversation';
    const post_body = {
      Customer_Service_User_id: customer_service_user_id
    };
    return this.networkService.httpPost(url, post_body);
  }

  checkAndJoinConversation(customer_user_id: number) {
    const url = this.api_url + '/conversation/join';
    const put_body = {
      Customer_User_id: customer_user_id
    };
    return this.networkService.httpPut(url, put_body);
  }

  endConversation(conversation_id: number) {
    const url = this.api_url + '/conversation';
    const delete_body = {
      Conversation_id: conversation_id
    };
    return this.networkService.httpDelete(url, delete_body);
  }

  postMessage(message: Message) {
    // Required params - conversation id, text and is_from_customer
    const url = this.api_url + '/message';
    return this.networkService.httpPost(url, message);
  }

  getAllMessages(conversation_id: number) {
    const url = this.api_url + '/message?Conversation_id=' + conversation_id;
    return this.networkService.httpGet(url);
  }
}
