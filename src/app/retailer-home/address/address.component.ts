import {Component, OnInit, ViewChild} from '@angular/core';
import {Address} from '../../models/Address.model';
import {ConstantsService} from '../../services/constants.service';
import {AddressService} from '../../services/address.service';
import {ToasterComponent} from '../../shared/toaster.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  providers: [AddressService]
})
export class AddressComponent implements OnInit {

  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  address_list: Address[] = [];
  user_id = 0;
  is_modal_displayed = false;
  modal_title = 'Add Address';
  selected_address = new Address(0, 0, '', '', '', '', '');

  constructor(private addressService: AddressService) { }

  ngOnInit() {
    const user_id = ConstantsService.getLoggedInUserId();
    if (user_id) {
      // Store the user id and load all the addresses for that user
      this.user_id = user_id;
      this.selected_address.User_id = user_id;
      this.loadAllAddresses();
    }
  }

  loadAllAddresses() {
    this.addressService.getUserAddresses(this.user_id).subscribe(data => {
      this.address_list = data['data'];
    }, error => {
      this.toastr.showError(error);
    });
  }

  openModal(selected_address: Address) {
    this.is_modal_displayed = true;
    if (selected_address === null) {
      // Add Address Modal
      this.modal_title = 'Add Address';
      this.selected_address = new Address(0, this.user_id, '', '', '', '', '');
    } else {
      // Edit Address Modal
      this.modal_title = 'Edit Address';
      this.selected_address = selected_address;
    }
  }

  saveAddress() {
    // Check if the required fields are filled
    if (
      this.selected_address.Address_Line_1.length > 0 &&
      this.selected_address.City.length > 0 &&
      this.selected_address.State.length > 0 &&
      this.selected_address.Pincode.length > 0
    ) {
      // Form is valid.. safe to proceed
      if (this.selected_address.id === 0) {
        // Add Address
        this.addressService.createAddress(this.selected_address).subscribe(data => {
          // Show message, reload all addresses and close the modal
          this.toastr.showSuccess('Address added successfully.');
          this.loadAllAddresses();
          this.closeModal();
        }, error => {
          this.toastr.showError(error);
        });
      } else {
        // Edit Address
        this.addressService.editAddress(this.selected_address).subscribe(data => {
          // Show message, reload all addresses and close the modal
          this.toastr.showSuccess('Address updated successfully.');
          this.loadAllAddresses();
          this.closeModal();
        }, error => {
          this.toastr.showError(error);
        });
      }

    } else {
      this.toastr.showWarning('Kindly fill the required fields')
    }
  }

  closeModal() {
    this.is_modal_displayed = false;
  }

}
