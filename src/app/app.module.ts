import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ConstantsService } from './services/constants.service';
import { NetworkService } from './services/network.service';
import { RetailerHomeComponent } from './retailer-home/retailer-home.component';
import { ProductsComponent } from './retailer-home/product/products.component';
import { SingleProductComponent } from './retailer-home/product/single-product.component';
import { LoginComponent } from './retailer-home/login/login.component';
import { SignupComponent } from './retailer-home/signup/signup.component';
import { CartComponent } from './retailer-home/cart/cart.component';
import { CheckoutComponent } from './retailer-home/checkout/checkout.component';
import { AddressComponent } from './retailer-home/address/address.component';
import { HistoryComponent } from './retailer-home/history/history.component';
import { OrdersComponent } from './retailer-home/management/orders/orders.component';
import { ManageProductsComponent } from './retailer-home/management/products/manage-products.component';
import { AddEditProductComponent } from './retailer-home/management/products/add-edit-product.component';
import { ManageUsersComponent } from './retailer-home/management/users/manage-users.component';
import { AddEditUserComponent } from './retailer-home/management/users/add-edit-user.component';
import { ProfileComponent } from './retailer-home/management/profile/profile.component';
import { NotificationsComponent } from './retailer-home/management/notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    RetailerHomeComponent,
    ProductsComponent,
    SingleProductComponent,
    LoginComponent,
    SignupComponent,
    CartComponent,
    CheckoutComponent,
    AddressComponent,
    HistoryComponent,
    OrdersComponent,
    ManageProductsComponent,
    AddEditProductComponent,
    ManageUsersComponent,
    AddEditUserComponent,
    ProfileComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ConstantsService, NetworkService],
  bootstrap: [AppComponent]
})
export class AppModule { }
