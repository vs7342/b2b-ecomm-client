import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../models/Product.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
  providers: [ProductService]
})
export class ManageProductsComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  products: Product[] = [];

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  addProduct() {
    this.router.navigate(['0'], {relativeTo: this.route});
  }

  editProduct(id: number) {
    this.router.navigate([id + ''], {relativeTo: this.route});
  }

}
