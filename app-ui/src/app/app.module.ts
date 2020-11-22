import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatSortModule, MatTableModule } from '@angular/material';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CustomerInfoComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,
    BrowserAnimationsModule, HttpClientModule,
    MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule, MatInputModule, MatIconModule,
    MatFormFieldModule, MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
