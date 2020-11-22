import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private readonly customerService: CustomerInfoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dataSource = new CustomerDataSource(this.customerService);
    this.dataSource.loadCustomerInfo()
    this.isListView = true;
    this.displayedColumns = ['id', 'first_name', 'last_name', 'email', 'car_make', 'mfg_year'];
    this.customerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [''],
      make: ['', Validators.required],
      mfg_year: ['', Validators.required]
    })
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      filter((input: string) => input.trim().length > 2), //Restricting the no of min characters before search starts
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

  loadCustomerPage() {
    console.log("this.sort.active", this.sort.active)
    this.dataSource.loadCustomerInfo(this.paginator.pageIndex, this.paginator.pageSize, this.input.nativeElement.value, this.sort.direction, this.sort.active);
  }
}
