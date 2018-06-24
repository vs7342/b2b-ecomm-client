import { Component, OnInit, ViewChild } from '@angular/core';
import { Address } from '../../models/Address.model';
import { Cart } from '../../models/Cart.model';
import { ToasterComponent } from '../../shared/toaster.component';
import { CartService } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantsService } from '../../services/constants.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [CartService, AddressService, OrderService]
})
export class CheckoutComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  address_list: Address[] = [];
  carts: Cart[] = [];
  grand_total = 0;
  user_id = 0;
  selected_shipping_address_id = 0;
  selected_billing_address_id = 0;

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Fetch User ID
    const user_id = ConstantsService.getLoggedInUserId();
    this.user_id = user_id;
    if (user_id) {

      // Fetch Address List and Cart Product List
      // If either of them is empty, navigate back to cart page
      this.addressService.getUserAddresses(this.user_id).subscribe(data => {
        if (data['data'] && data['data'].length > 0) {

          // Initialize the address list , select default drop down values
          this.address_list = data['data'];
          this.selected_shipping_address_id = this.address_list[0].id;
          this.selected_billing_address_id = this.address_list[0].id;

          // Now fetch cart items
          this.cartService.getCartForUser(this.user_id).subscribe(cart_data => {
            if (cart_data['data'] && cart_data['data'].length > 0) {
              // Initialize the cart list
              this.carts = cart_data['data'];

              // Loop through the cart details and calculate grand total
              this.grand_total = 0;
              this.carts.forEach(single_cart => {
                this.grand_total += (single_cart.Quantity * single_cart['Product']['Price']);
              });
            } else {
              // Checkout page is being accessed directly
              this.router.navigate(['../cart'], {relativeTo: this.route});
            }
          }, error => {
            this.toastr.showError(error);
          });

        } else {
          // Checkout page is being accessed directly
          this.router.navigate(['../cart'], {relativeTo: this.route});
        }

      }, error => {
        this.toastr.showError(error);
      });
    }
  }

  placeOrder() {
    this.orderService.createOrder(
      this.user_id,
      this.selected_shipping_address_id,
      this.selected_billing_address_id
    ).subscribe(data => {
      // Order placed successfully.. show message and navigate to order history page
      this.toastr.showSuccess(data['message']);
      setTimeout(() => {
        this.router.navigate(['../history'], {relativeTo: this.route});
      }, 1250);
    }, error => {
      this.toastr.showError(error);
    });
  }

}
