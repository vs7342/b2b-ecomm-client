import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from './services/public.service';
import { ToasterComponent } from './shared/toaster.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PublicService]
})
export class AppComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  retailer_list: any[];

  constructor(public route: ActivatedRoute, private publicService: PublicService) { }

  ngOnInit() {
    this.loadRetailers();
  }

  loadRetailers() {
    this.publicService.getAllRetailers().subscribe(data => {
      this.retailer_list = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }
}
