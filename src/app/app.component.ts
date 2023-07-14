import { Component, OnInit } from '@angular/core';
import { Product } from 'src/product';
import { ProductService } from 'src/productService';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import * as math from 'mathjs';

interface header{
  colCode: string,
  colName: string,
  colFormula: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'data-table';

  products1!: Product[];

  products2!: Product[];

  statuses!: SelectItem[];

  value: string = '';
  calculateSum!: number;

  headers:header[] = [
    {
      colCode: 'aaa',
      colName: 'aaa1',
      colFormula: ''
    },
    {
      colCode: 'bbb',
      colName: 'bbb1',
      colFormula: ''
    },
    {
      colCode: 'ccc',
      colName: 'ccc1',
      colFormula: ''
    },
  ]

  // 取得公式
  getValue(colName: string) {
    for (let header of this.headers) {
      if (header.colName === colName) {
        header.colFormula = this.value;
        break;
      }
    }
    // this.value = ''



  }

  calc(prod:Product){
    return math.evaluate(this.headers[1].colFormula , prod)
  }





  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products2 = data));

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price',
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    // delete this.products2[product.id];
  }

}
