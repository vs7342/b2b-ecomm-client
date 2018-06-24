import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from '../../models/Cart.model';
import { ToasterComponent } from '../../shared/toaster.component';
import { ConstantsService } from '../../services/constants.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [CartService, AddressService]
})
export class CartComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  carts: Cart[] = [];
  user_id = 0;
  grand_total = 0;

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // First fetch the logged in user
    const user_id = ConstantsService.getLoggedInUserId();
    if (user_id) {
      // We now have logged in user id.. fetch cart for the user
      this.user_id = user_id;
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.getCartForUser(this.user_id).subscribe(data => {
      this.carts = data['data'];

      // Loop through the cart details and calculate grand total
      this.grand_total = 0;
      this.carts.forEach(single_cart => {
        this.grand_total += (single_cart.Quantity * single_cart['Product']['Price']);
      });

    }, error => {
      this.toastr.showError(error);
    });
  }

  updateProductQtyInCart(cart_id: number, quantity: number) {
    this.cartService.changeProductQuantity(new Cart(cart_id, 0, 0, quantity)).subscribe(data => {
      // Update successful.. show message accordingly
      if (quantity === 0) {
        this.toastr.showSuccess('Product removed successfully');
      } else {
        this.toastr.showSuccess('Quantity updated successfully');
      }
      // reload entire cart
      this.loadCart();
    }, error => {
      this.toastr.showError(error);
    });
  }

  emptyCart() {
    this.cartService.emptyCart(this.user_id).subscribe(data => {
      this.toastr.showSuccess(data['message']);
      // Empty the local cart
      this.carts = [];
      this.grand_total = 0;
    }, error => {
      this.toastr.showError(error);
    });
  }

  checkout() {
    // We need to check if the user has any address associated
    this.addressService.getUserAddresses(this.user_id).subscribe(data => {
      if (data['data'] && data['data'].length > 0) {
        // Safe to navigate to checkout page
        this.router.navigate(['../checkout'], {relativeTo: this.route});
      } else {
        // Show warning that at least one address is needed
        this.toastr.showWarning('At least one address is required before you checkout.');
        this.toastr.showInfo('Addresses can be managed in Profile -> Manage Address page.');
      }
    }, error => {
      this.toastr.showError(error);
    });
  }



}
