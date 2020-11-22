import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService {

  private readonly baseUrl = 'http://localhost:5000/api/customer-info';

  constructor(private http: HttpClient) { }

  getCustomers(pageNumber: number = 0, pageSize: number = 10, filter: string = "", sortOrder: string = "asc", sortKey: string = 'id') {
    const data = {
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      filter,
      sortOrder,
      sortKey
    }
    const params: HttpParams = new HttpParams({ fromObject: data })
    return this.http.get(this.baseUrl, { params }).pipe(delay(3000));
  }

  addCustomer(data) {
    return this.http.post(this.baseUrl, data);
  }
}
