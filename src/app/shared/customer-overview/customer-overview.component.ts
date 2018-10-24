import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/User.model';
import { Order } from '../../models/Order.model';
import { Cart } from '../../models/Cart.model';

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.css']
})
export class CustomerOverviewComponent implements OnInit {

  @Input('user') user: User;
  @Input('orders') orders: Order[];
  @Input('carts') carts: Cart[];
  @Output('close') close = new EventEmitter<null>();

  product_in_orders: any[] = [];

  constructor() { }

  ngOnInit() {

    // Fill the product_in_orders array by looping through the orders array
    this.orders.forEach(single_order => {
      single_order['OrderProducts'].forEach(single_order_product => {
        this.product_in_orders.push({
          Order_Id: single_order.id,
          Product_id: single_order_product['Product']['id'],
          Product_Name: single_order_product['Product']['Name'],
          Product_Price: single_order_product['Product']['Price'],
          Qty_Ordered: single_order_product['Quantity'],
          Ordered_On: single_order.Created_At,
          Order_Status: this.getOrderStatus(single_order.StatusType_id)
        });
      });
    });

  }

  emitCloseModal() {
    this.close.emit(null);
  }

  getOrderStatus(status_type_id: number) {
    switch (status_type_id) {
      case 1:
        return 'Order Placed';

      case 2:
        return 'Order Processed';

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

}
