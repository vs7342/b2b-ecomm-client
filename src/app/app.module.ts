import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { HttpModule } from '@angular/http';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

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
import { ToasterComponent } from './shared/toaster.component';
import { ProductFilterPipe } from './shared/product-filter.pipe';
import { ChatComponent } from './shared/chat/chat.component';
import { OrderDetailsModalComponent } from './shared/order-details-modal/order-details-modal.component';
import { CustomerOverviewComponent } from './shared/customer-overview/customer-overview.component';

export class CustomToastOptions extends ToastOptions {
  positionClass = 'toast-bottom-right';
}

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
    NotificationsComponent,
    ToasterComponent,
    ProductFilterPipe,
    ChatComponent,
    OrderDetailsModalComponent,
    CustomerOverviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    UiSwitchModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: ':url_part', component: RetailerHomeComponent, children: [
        { path: 'products', component: ProductsComponent },
        { path: 'products/:product_id', component: SingleProductComponent },
        { path: 'login', component: LoginComponent },
        { path: 'signup', component: SignupComponent },
        { path: 'cart', component: CartComponent },
        { path: 'checkout', component: CheckoutComponent },
        { path: 'address', component: AddressComponent },
        { path: 'history', component: HistoryComponent },
        { path: 'chat', component: ChatComponent },
        { path: 'management/orders', component: OrdersComponent },
        { path: 'management/products', component: ManageProductsComponent },
        { path: 'management/products/:product_id', component: AddEditProductComponent },
        { path: 'management/users', component: ManageUsersComponent },
        { path: 'management/users/:user_id', component: AddEditUserComponent },
        { path: 'management/profile', component: ProfileComponent },
        { path: 'management/notifications', component: NotificationsComponent }
      ]}
    ])
  ],
  providers: [ConstantsService, NetworkService, [{ provide: ToastOptions, useClass: CustomToastOptions }]],
  bootstrap: [AppComponent]
})
export class AppModule { }
