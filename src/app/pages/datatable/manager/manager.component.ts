import { Component, Inject, Optional, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {  AppAddManagerComponent } from './add/add.component';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  templateUrl: './manager.component.html',
})
export class ManagerComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  data:any =[];
  displayedColumns: string[] = [
    '#',
    'username',
    'firstname',
    'lastname',
    'email',
    'role',
    
    'action',
  ];

  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe,private userService: UserService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {this.getUsersNow();
   
  }
  applyFilter(filterValue: string): void {
    // Convert filterValue to lowercase for case-insensitive matching
    filterValue = filterValue.trim().toLowerCase();
    
    // Custom filtering logic to filter by 'Descipline_name' column only
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.userName.toLowerCase().includes(filter);
    };
    
    // Apply the filter
    this.dataSource.filter = filterValue;
  }
  getUsersNow(): void {
    this.userService.getUsers().subscribe(res => {
      console.log(res);
      this.data = res;
      this.dataSource = new MatTableDataSource(this.data); // Update dataSource after receiving data
      this.dataSource.paginator = this.paginator; // Reassign paginator
      console.log(this.data);  
    });
  }
  
  
  Deleteuser(userId: number) {
    const url = `http://localhost:8082/api/user/${userId}`;
    this.http.delete(url, {}).subscribe(() => {
      alert('user deleted successfuly!');
      this.getUsersNow();
      console.log('user deleted successfully');
     
    }, (error) => {
      console.error('Error deleting user:', error);
    });
  }
 
  // tslint:disable-next-line - Disables all
 

  // tslint:disable-next-line - Disables all
  

  // tslint:disable-next-line - Disables all
  
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'addManager.html',
})
// tslint:disable-next-line: component-class-suffix
export class AddManagerDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  @Output() registerUserEvent: EventEmitter<NgForm> = new EventEmitter<NgForm>(); // Define an output event to emit form data
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AddManagerDialogContentComponent>,
    
    private http: HttpClient
  ) {}
  
  registerUser(signupForm: NgForm): void {
    if (signupForm.value.userPassword !== signupForm.value.confirmPassword) {
      // If passwords do not match, display error message and return
      alert("passwords not match")
      return;
    }
    // Emit form data when registering user
    this.registerUserEvent.emit(signupForm); 
    console.log('User password:', this.formData.userPassword);
    this.dialogRef.close(); // Close the dialog
  }
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  
}
