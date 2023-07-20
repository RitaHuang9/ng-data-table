import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/customerservice';
import { Customer } from 'src/customer';

@Component({
  selector: 'app-cpro-excel',
  templateUrl: './cpro-excel.component.html',
  styleUrls: ['./cpro-excel.component.scss'],
})
export class CproExcelComponent implements OnInit  {
  customers!: Customer[];
  balanceFrozen: boolean = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomersMedium().then((data) => {
      this.customers = data;
    });
  }

  formatCurrency(value:any) {
    return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
}




}
