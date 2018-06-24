import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToasterComponent } from '../../shared/toaster.component';
import { Product } from '../../models/Product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ConstantsService } from '../../services/constants.service';
import { PublicService } from '../../services/public.service';
import { Cart } from '../../models/Cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
  providers: [ProductService, PublicService, CartService]
})
export class SingleProductComponent implements OnInit, OnDestroy {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  product: Product = new Product(0, '', '', '', 0, '', 0, 0);
  sub: any;
  user_id = 0;
  is_alert_active = false;
  product_cart = new Cart(0, 0, 0, 1);

  constructor(
    private productService: ProductService,
    private publicService: PublicService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Fetch product id
    const product_id = this.route.snapshot.params['product_id'];

    // Proceed only if product id is provided
    if (product_id) {
      this.product.id = product_id;

      // Fetch user id if any - based on this we will decide whether to call public or customer endpoint
      const user_id = ConstantsService.getLoggedInUserId();
      if (user_id) {
        // Customer endpoint
        this.loadProductForCustomer();
        this.user_id = user_id;
        this.product_cart.User_id = user_id;
      } else {
        // Public endpoint
        // Fetch url part from parent route params
        this.sub = this.route.parent.params.subscribe(params => {
          const url_part = params['url_part'];

          // If something is wrong with the url_part, navigate to AppComponent
          if (!url_part) {
            this.router.navigate(['']);
          } else {
            this.loadProductForPublic(url_part);
          }
        });
      }
    }
  }

  loadProductForPublic(url_part: string) {
    this.publicService.getSingleProducts(url_part, this.product.id).subscribe(data => {
      // Need to check if product was found or not..
      // If not, that means someone was trying to access product by entering random ID
      if (data['data']) {
        this.product = data['data'];
      } else {
        // Means product not found.. Navigate to product list
        this.router.navigate(['../'], {relativeTo: this.route});
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  loadProductForCustomer() {
    this.productService.getSingleProduct(this.product.id).subscribe(data => {

      // Need to check if product was found or not..
      // If not, that means someone was trying to access product by entering random ID
      if (!data['data']) {
        // Means product not found.. Navigate to product list
        this.router.navigate(['../'], {relativeTo: this.route});
        return;
      }

      // Initialize the product attribute
      this.product = data['data'];
      this.product_cart.Product_id = this.product.id;

      // Get all cart instances for the user and extract single instance for the selected product if any
      this.cartService.getCartForUser(this.user_id).subscribe(carts_data => {
        const all_carts = carts_data['data'];
        // Now find the cart instance with the selected product
        for (let i = 0; i < all_carts.length; i++) {
          const cart = (all_carts[i] as Cart);
          // If product found in cart, assign it to 'product_cart' object
          if (cart.Product_id === this.product.id) {
            this.product_cart = cart;
            break;
          }
        }
      }, error => {
        this.toastr.showError(error);
      });

      // Load the alert related to this product and user
      // Only load alert when product quantity is 0
      if (this.product.Quantity <= 0) {
        this.productService.getAlert(this.product.id, this.user_id).subscribe(alert_data => {
          if (alert_data['data']) {
            this.is_alert_active = true;
          } else {
            this.is_alert_active = false;
          }
        }, error => {
          this.toastr.showError(error);
        });
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  createAlert() {
    this.productService.createAlert(this.product.id, this.user_id).subscribe(data => {
      this.toastr.showSuccess('Alert created successfully');
      this.is_alert_active = true;
    }, error => {
      this.toastr.showError(error);
    });
  }

  addProductToCart() {
    // Input Validation
    if (this.product_cart.Quantity == null || this.product_cart.Quantity <= 0 || isNaN(this.product_cart.Quantity)) {
      this.toastr.showWarning('Invalid Quantity.');
      return;
    }
    // Add to cart call
    this.cartService.addProductToCart(this.product_cart).subscribe(data => {
      this.toastr.showSuccess('Product added successfully');
      this.product_cart = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  updateProductQtyInCart() {
    // Input Validation
    if (this.product_cart.Quantity == null || this.product_cart.Quantity < 0 || isNaN(this.product_cart.Quantity)) {
      this.toastr.showWarning('Invalid Quantity.');
      return;
    }
    // Update product quantity in cart call
    this.cartService.changeProductQuantity(this.product_cart).subscribe(data => {
      this.toastr.showSuccess(data['message']);
      if (this.product_cart.Quantity === 0) {
        // Meaning the cart is deleted from db.. Thus delete from client as well
        this.product_cart.id = 0;
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  ngOnDestroy() {
    // sub will only be initialized when url_part is fetched i.e. when user is not logged in
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
