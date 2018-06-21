import { Component, isDevMode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/Product.model';
import { S3UploadService } from '../../../services/s3-upload.service';
import { ToasterComponent } from '../../../shared/toaster.component';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css'],
  providers: [ProductService]
})
export class AddEditProductComponent implements OnInit, OnDestroy {

  product = new Product(0, '', '', '', 0, '', 0, 0);
  selectedFiles: FileList;
  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  sub: any;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const product_id = this.route.snapshot.params['product_id'];

    // Load the product
    if (product_id) {
      this.loadProduct(product_id);
    }
  }

  loadProduct(id: number) {
    // Fetch the product
    this.productService.getSingleProduct(id).subscribe(data => {
      if (data['data']) {
        this.product = data['data'];
      } else {
        // This means someone is trying to enter a random product id which is not present in DB.
        // Thus, change the state of component to Add Product.
        this.router.navigate(['../', '0'], {relativeTo: this.route});
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  upload() {
    const file = this.selectedFiles.item(0);

    // Determine the retailer url_part since we need that for the folder name
    this.sub = this.route.parent.params.subscribe(params => {
      const url_part = params['url_part'];

      if (this.product.id !== 0 || this.product.Image_Url.length !== 0) {
        // Image is being replaced.. Get rid of earlier image first from S3
        const old_key = url_part + '/' + this.product.Image_Url.split('/').pop();
        S3UploadService.deleteObject(old_key);
      }

      // Formulate the key (url_part / file_name)
      const key = url_part + '/' + 'Product_' + Date.now() + '.' + file.name.split('.').pop();

      // Upload to S3
      S3UploadService.uploadFile(file, key).then(data => {
        this.product.Image_Url = data['Location'];
        this.toastr.showSuccess('Image Uploaded!');
      }).catch(err => {
        if (isDevMode()) {
          console.log(err);
        }
        this.toastr.showError('Error uploading image!');
      });
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  saveProduct() {
    if (this.product.id === 0) {
      // Add Product
      this.productService.createProduct(this.product).subscribe(data => {
        this.toastr.showSuccess('Product Created!');
        setTimeout(() => {
          this.router.navigate(['../'], {relativeTo: this.route});
        }, 1250);
      }, error => {
        this.toastr.showError(error);
      });
    } else {
      // Edit Product
      this.productService.editProduct(this.product).subscribe(data => {
        this.toastr.showSuccess('Product Updated!');
        setTimeout(() => {
          this.router.navigate(['../'], {relativeTo: this.route});
        }, 1250);
      }, error => {
        this.toastr.showError(error);
      });
    }
  }

  ngOnDestroy() {
    // sub will only be initialized when a file based operation is performed
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
