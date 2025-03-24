import { Component, Inject, Optional, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AddComponent } from './add/add.component';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.scss'
})
export class SuperAdminComponent implements AfterViewInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  data:any =[];
  rating: number = 0;
  clientId:number;
  displayedColumns: string[] = [
    
    'reviewer',
    'comment',
    'rating',
    
  ];

  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe,private userService: UserService, private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {this.getClubsNow();
   this.GetCandidature();
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
  getClubsNow(): void {
    const user = localStorage.getItem('user'); // Get user from local storage
  
    if (user) {
      const parsedUser = JSON.parse(user); // Parse stored user data
      this.clientId = parsedUser.id; // Retrieve the user ID
    } else {
      console.error('No user found in local storage!');
      return;
    }
  
    console.log('Client ID:', this.clientId);
  
    this.userService.getReviews(this.clientId).subscribe(res => {
      this.data = res;
      console.log(this.data);
  
      // Fetch reviewer names for each review
      this.data.forEach((review: any) => {
        this.userService.getUserById(review.reviewerId).subscribe(user => {
          review.reviewerName = user.username; // Add a new property for the name
        });
      });
  
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  GetCandidature(): void {
    const user = localStorage.getItem('user'); // Get user from local storage
  
    if (user) {
      const parsedUser = JSON.parse(user); // Parse stored user data
      this.clientId = parsedUser.id; // Retrieve the user ID
    } else {
      console.error('No user found in local storage!');
      return;
    }
  
    console.log('Client ID:', this.clientId);
    const url = `http://localhost:8085/api/reviews/average/${this.clientId}`;
  
    this.http.get(url).subscribe(
      (res: any) => {
        this.rating = res;  // Assign the rating value
        console.log('Received rating:', this.rating);
      },
      (error: any) => {
        console.error('Error fetching rating:', error);
        
      }
    );
  }
  
  
 
  // tslint:disable-next-line - Disables all
 

  // tslint:disable-next-line - Disables all
  

  // tslint:disable-next-line - Disables all
  
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'addSuperAdmin.html'
})
// tslint:disable-next-line: component-class-suffix
export class SuperAdminDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  @Output() registerUserEvent: EventEmitter<NgForm> = new EventEmitter<NgForm>(); // Define an output event to emit form data
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<SuperAdminDialogContentComponent>,
   
    private http: HttpClient
  ) {}
  
  registerUser(signupForm: NgForm): void {
    if (signupForm.value.userPassword !== signupForm.value.confirmPassword) {
      // If passwords do not match, display error message and return
      alert("passwords not match")
      return;
    }
    this.registerUserEvent.emit(signupForm); 
    console.log('User password:', this.formData.userPassword);
    this.dialogRef.close();// Emit form data when registering user
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  
}
