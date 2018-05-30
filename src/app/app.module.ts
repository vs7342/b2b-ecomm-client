import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ConstantsService } from './services/constants.service';
import { NetworkService } from './services/network.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [ConstantsService, NetworkService],
  bootstrap: [AppComponent]
})
export class AppModule { }
