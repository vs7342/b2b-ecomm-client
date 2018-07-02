import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../models/Order.model';
import { OrderService } from '../../../services/order.service';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [OrderService]
})
export class OrdersComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  order_list: Order[] = [];

  // For Order Status Update Modal
  is_update_status_modal_displayed = false;
  order_id = 0;
  status_type_id = 1;
  tracking_id = '';

  // For view order details modal
  order_being_viewed = new Order(0, 0, 0, 0, 1, '', '', '');
  is_order_details_modal_displayed = false;

  onMouseEnter(element: any) {
    element.textContent = 'Update Status';
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

      default:
        return 'Order Placed';
    }
  }

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    // Load all orders in system
    this.loadOrdersInSystem();
  }

  loadOrdersInSystem() {
    // Get all orders
    this.orderService.getAllOrdersInSystem().subscribe(data => {
      this.order_list = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  onMouseLeave(element: any, status_type_id: number) {
    element.textContent = this.getOrderStatus(status_type_id);
  }

  getOrderTotal(OrderProducts: any) {
    let grand_total = 0;
    // Loop over all the order products and calculate the total
    OrderProducts.forEach(single_order_product => {
      grand_total += single_order_product['Quantity'] * single_order_product['Product']['Price'];
    });
    // Return the total
    return grand_total;
  }

  openUpdateStatusModal(order: Order) {
    // Display the modal
    this.is_update_status_modal_displayed = true;

    // Set the corresponding ng models (Order ID, Status Type and Tracking ID)
    this.order_id = order.id;
    this.status_type_id = order.StatusType_id;
    this.tracking_id = order.Tracking_id;
  }

  closeUpdateStatusModal() {
    this.is_update_status_modal_displayed = false;
  }

  saveOrderStatus() {
    this.orderService.updateOrder(this.order_id, this.status_type_id, this.tracking_id).subscribe(data => {
      // Display success message, close the modal and reload order list
      this.is_update_status_modal_displayed = false;
      this.toastr.showSuccess(data['message']);
      this.loadOrdersInSystem();
    }, error => {
      this.toastr.showError(error);
    });
  }

  viewOrder(order: Order) {
    // Assign the modal variable and display the modal
    this.order_being_viewed = order;
    this.is_order_details_modal_displayed = true;
  }

  closeDetailsModal() {
    // Destroy the modal variable and hide the modal
    this.is_order_details_modal_displayed = false;
    this.order_being_viewed = new Order(0, 0, 0, 0, 1, '', '', '');
  }

}
