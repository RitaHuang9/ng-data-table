import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from './customer-new';

@Injectable()
export class CustomerServiceNew {
    constructor(private http: HttpClient) { }

    getCustomersMedium() {
        return this.http.get<any>('assets/json/customers-medium-new.json')
            .toPromise()
            .then(res => <Customer[]>res.data)
            .then(data => { return data; });
    }
}
