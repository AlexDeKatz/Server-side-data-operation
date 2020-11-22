import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, tap } from 'rxjs/operators';
import { CustomerDataSource } from 'src/shared/utility.service';
import { CustomerInfoService } from './customer-info.service';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit, AfterViewInit {

  isListView: boolean;
  dataSource: CustomerDataSource;
  customerForm: FormGroup;
  displayedColumns: Array<string>
  private close: HTMLElement;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private readonly customerService: CustomerInfoService, private formBuilder: FormBuilder, private elRef: ElementRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource = new CustomerDataSource(this.customerService);
    this.dataSource.loadCustomerInfo()
    this.isListView = true;
    this.displayedColumns = ['id', 'first_name', 'last_name', 'email', 'car_make', 'mfg_year'];
    this.customerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      car_make: ['', Validators.required],
      mfg_year: ['', Validators.required]
    })
  }

  ngAfterViewInit() {
    this.close = this.elRef.nativeElement.querySelector('#close');
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      filter((input: string) => (input.trim().length===0) || (input.trim().length > 2)), //Restricting the no of min characters before search starts
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadCustomerPage();
      })
    ).subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadCustomerPage())
    ).subscribe();
  }

  addCustomer() {
    this.customerService.addCustomer(this.customerForm.getRawValue()).pipe(finalize(() => this.customerForm.reset()))
      .subscribe((data: any) => {
        if (data.message) {
          this.dataSource.loadCustomerInfo(0, this.paginator.pageSize);
          this.snackBar.open(data.message, 'Info', {
            duration: 5000,
          });
          this.close.click();
        }
      }, err => {
        this.snackBar.open(err.error, 'Info');
      })
  }

  private loadCustomerPage() {
    console.log("this.sort.active", this.sort.active)
    this.dataSource.loadCustomerInfo(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value, this.sort.direction, this.sort.active);
  }

}
