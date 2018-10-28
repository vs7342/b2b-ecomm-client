import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/Product.model';
import { ConstantsService } from '../../services/constants.service';
import { PublicService } from '../../services/public.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent } from '../../shared/toaster.component';
import { Cart } from '../../models/Cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [PublicService, ProductService, CartService]
})
export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  products: Product[] = [];
  carts: Cart[] = [];
  url_part = '';
  sub: any;
  user_id = 0;
  productSearchTxt: any;

  constructor(
    private publicService: PublicService,
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    // Check if user is logged in or not
    const id = ConstantsService.getLoggedInUserId();
    if (id) {
      // User is logged in.. We can call the normal get products call
      this.user_id = id;
      this.loadProducts(id);
    } else {
      // Since user is not logged in, we would be needing url part to fetch product list
      this.user_id = 0;
      // Fetch url part from parent route params
      this.sub = this.route.parent.params.subscribe(params => {
        this.url_part = params['url_part'];

        // If something is wrong with the url_part, navigate to AppComponent
        if (!this.url_part) {
          this.router.navigate(['']);
        } else {
          this.loadProducts(0);
        }
      });
    }
  }

  loadProducts(user_id) {
    if (user_id === 0) {
      // We need to call public endpoint to fetch products
      this.publicService.getAllProducts(this.url_part).subscribe(data => {
        this.products = data['data'];
      }, error => {
        this.toastr.showError(error);
      });
    } else {
      // We now fetch all products in user's cart
      // Cart details had to be fetched before otherwise isProductInCart() would always false
      this.cartService.getCartForUser(this.user_id).subscribe(cart_data => {
          this.carts = cart_data['data'];
          // We need to call normal get products endpoint
          this.productService.getAllProducts().subscribe(data => {
            this.products = data['data'];
          }, error => {
            this.toastr.showError(error);
          });
        }, error => {
          this.toastr.showError(error);
        });
    }
  }

  goToProduct(product_id: number, className: string) {
    // Check if the event click is coming from 'btn'.
    // If the event is coming from button click (Add to Cart) then we don't need to navigate to single product page
    if (className !== 'btn btn-primary') {
      this.router.navigate(['' + product_id], {relativeTo: this.route});
    }
  }

  isProductInCart(product_id: number) {
    // Loop through each cart instance and check if the product is already added in the cart
    for (let i = 0; i < this.carts.length; i++) {
      if (this.carts[i].Product_id === product_id) {
        return true;
      }
    }
    return false;
  }

  addToCart(product_id: number, className: string) {
    // This will add the specified product in the cart with quantity 1
    const cart = new Cart(-1, this.user_id, product_id, 1);
    this.cartService.addProductToCart(cart).subscribe(data => {
      this.toastr.showSuccess('Product added to cart successfully (Qty = 1)');
      this.carts.push(cart);
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
