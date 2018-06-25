import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../models/Order.model';
import { ToasterComponent } from '../../shared/toaster.component';
import { ConstantsService } from '../../services/constants.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [OrderService]
})
export class HistoryComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  orders: Order[] = [];
  user_id = 0;

  constructor(
    private orderService: OrderService
  ) { }

  getOrderTotal(OrderProducts: any) {
    let grand_total = 0;
    // Loop over all the order products and calculate the total
    OrderProducts.forEach(single_order_product => {
      grand_total += single_order_product['Quantity'] * single_order_product['Product']['Price'];
    });
    // Return the total
    return grand_total;
  }

  ngOnInit() {
    // Fetch user id
    const user_id = ConstantsService.getLoggedInUserId();
    if (user_id) {
      // Save the user id and load orders
      this.user_id = user_id;
      this.loadOrders();
    }
  }

  loadOrders() {
    this.orderService.getAllOrdersForUser(this.user_id).subscribe(data => {
      this.orders = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  viewOrder(order_id: number) {

  }
}
