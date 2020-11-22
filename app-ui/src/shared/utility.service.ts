import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { CustomerInfoService } from 'src/app/customer-info/customer-info.service';

export class CustomerDataSource implements DataSource<any>{

  private customerSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private dataLengthSubject = new BehaviorSubject<number>(0);

  loading$ = this.loadingSubject.asObservable();
  totalLength$ = this.dataLengthSubject.asObservable()

  constructor(private customerInfoService: CustomerInfoService) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.customerSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.customerSubject.complete();
    this.loadingSubject.complete();
  }

  loadCustomerInfo(pageNumber: number = 0, pageSize: number = 10, filter: string = "", sortOrder: string = "asc", sortKey: string = 'id') {
    this.loadingSubject.next(true);
    this.customerInfoService.getCustomers(pageNumber, pageSize, filter, sortOrder, sortKey).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    ).subscribe((customerInfo: any) => {
      this.dataLengthSubject.next(customerInfo.totalItems)
      this.customerSubject.next(customerInfo.result)
    })
  }
}