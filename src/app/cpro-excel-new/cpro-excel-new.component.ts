import { Component } from '@angular/core';
import { CustomerServiceNew } from 'src/customerservice-new';
import { Customer } from 'src/customer-new';


@Component({
  selector: 'app-cpro-excel-new',
  templateUrl: './cpro-excel-new.component.html',
  styleUrls: ['./cpro-excel-new.component.scss']
})
export class CproExcelNewComponent {
  customers!: Customer[];
  balanceFrozen: boolean = false;
  clonedCustomers: { [s: string]: Customer } = {};

  constructor(private CustomerServiceNew: CustomerServiceNew) {}

  ngOnInit() {
    this.CustomerServiceNew.getCustomersMedium().then((data) => {
      this.customers = data;
    });
  }

  onRowEditInit(customer: Customer) {
    if (customer && customer.row !== undefined) {
      this.clonedCustomers[customer.row] = { ...customer };
    }
  }
}
