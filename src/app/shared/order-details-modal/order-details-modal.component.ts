import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '../../models/Order.model';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css']
})
export class OrderDetailsModalComponent implements OnInit {

  @Input('order') order: any;
  @Input('display_user_details') display_user_details: Boolean;
  @Output('close') close = new EventEmitter<null>();
  grand_total = 0;

  getOrderStatus(status_type_id: number) {
    switch (status_type_id) {
      case 1:
        return 'Order Placed';

      case 2:
        return 'Processed';

      case 3:
        return 'Shipped';

      case 4:
        return 'Delivered';

      case 5:
        return 'Issues';

      default:
        return 'Order Placed';
    }
  }

  constructor() { }

  ngOnInit() {
    // Loop over all the order products and calculate the total
    this.order['OrderProducts'].forEach(single_order_product => {
      this.grand_total += single_order_product['Quantity'] * single_order_product['Product']['Price'];
    });
  }

  emitCloseModal() {
    this.close.emit(null);
  }

}
