import { Component } from '@angular/core';
import { CustomerService } from 'src/customerservice';
import { Customer } from '../../customer';

@Component({
  selector: 'app-cpro-excel',
  templateUrl: './cpro-excel.component.html',
  styleUrls: ['./cpro-excel.component.scss'],
})
export class CproExcelComponent {
  customers!: Customer[];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomersMedium().then(data => {
        this.customers = data;
    });
}
}
