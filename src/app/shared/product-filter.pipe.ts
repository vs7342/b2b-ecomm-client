import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models/Product.model';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(products: Product[], searchText: string): any[] {

    if (!products) {
      return [];
    }

    if (!searchText) {
      return products;
    }

    searchText = searchText.toLowerCase();
    return products.filter( single_product => {
      return single_product.Name.toLowerCase().includes(searchText) ||
        single_product.Short_Description.toLowerCase().includes(searchText) ||
        single_product.Detail_Description.toLowerCase().includes(searchText);
    });
  }
}
