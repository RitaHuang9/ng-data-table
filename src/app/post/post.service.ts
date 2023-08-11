import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product } from './post';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  private apiURL =
    'https://minapiexample.azurewebsites.net/api/Products';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };


  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.apiURL)

      .pipe(catchError(this.errorHandler));
  }


  create(product: Product): Observable<Product[]> {
    console.log(product);

    return this.httpClient
      .post<Product[]>(this.apiURL ,JSON.stringify(product), this.httpOptions)

      .pipe(catchError(this.errorHandler));
  }

  //修改/檢視-取得單筆資料
  find(id: number): Observable<Product[]> {
    return this.httpClient
      .get<Product[]>(this.apiURL + `/${id}`)

      .pipe(catchError(this.errorHandler));
  }

  //修改
  update(id: number, product: Product): Observable<Product[]> {

    return this.httpClient
      .put<Product[]>(this.apiURL + `/${id}`, JSON.stringify(product), this.httpOptions)

      .pipe(catchError(this.errorHandler));
  }

  delete(id: number) {
    return this.httpClient
      .delete(this.apiURL + `/${id}`, this.httpOptions)

      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
