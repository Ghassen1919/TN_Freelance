
import { Component, Inject, Optional, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { ClubService } from '../../../services/club.service';

import { filter, mergeMap } from 'rxjs';

@Component({
  selector: 'app-descipline',
 
 
  templateUrl: './descipline.component.html',
  styleUrl: './descipline.component.scss'
})
export class DesciplineComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
   searchText: any;
   data:any =[];
   clubName:string;
   dateCreation : any;
   description: string;
   displayedColumns: string[] = ['#', 'title', 'description', 'client', 'status'];
   dataSource = new MatTableDataSource(this.data);
   @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
 
   constructor(public dialog: MatDialog, private userService: UserService,public datePipe: DatePipe,private clubService: ClubService, private http: HttpClient) { }
 
   ngAfterViewInit(): void {
     this.dataSource.paginator = this.paginator;
   }
 
   ngOnInit(): void {
     this.getClubsNow();
   }
 
   applyFilter(filterValue: string): void {
     // Convert filterValue to lowercase for case-insensitive matching
     filterValue = filterValue.trim().toLowerCase();
     
     // Custom filtering logic to filter by 'Descipline_name' column only
     this.dataSource.filterPredicate = (data: any, filter: string) => {
       return data.title.toLowerCase().includes(filter);
     };
     
     // Apply the filter
     this.dataSource.filter = filterValue;
   }
 
   getClubsNow(): void {
     this.clubService.getAllTasks().subscribe(res => {
       this.data = res;
       console.log(this.data);
       this.data.forEach((review: any) => {
        this.userService.getUserById(review.clientId).subscribe(user => {
          review.reviewerName = user.username; 
        });
      });
       this.dataSource = new MatTableDataSource(this.data);
       this.dataSource.paginator = this.paginator;
     });
   }
   openDialogAddCandidature(taskId: number): void {
    const dialogRef = this.dialog.open(AddCandidatureDialogContentComponent, {
      width: '800px',
      data: { taskId: taskId }  // Pass taskId to dialog
    });
  
    dialogRef.componentInstance.registerUserEvent.subscribe((data: any) => {
      this.AddClub(data);
    });
  }
  
 AddClub(club: any): void {
  const url = `http://localhost:8084/api/candidatures`;

  // Retrieve the user object from local storage
  const user = localStorage.getItem('user');

  let clientId: string | null = null;
  if (user) {
    try {
      const parsedUser = JSON.parse(user); // Parse stored user data
      clientId = parsedUser.id; // Retrieve the user ID
    } catch (error) {
      console.error("Error parsing user data:", error);
      alert("Error: Invalid user data in local storage");
      return;
    }
  } else {
    console.error("No user found in local storage!");
    alert("Error: No user found");
    return;
  }

  const requestBody = {
    ...club,  // Spread club object directly instead of nesting it
    clientId: clientId, // Add client ID
  };

  console.log("Adding club:", club.title, "for Client ID:", clientId);

  this.http.post(url, requestBody).subscribe(
    (response: any) => {
      console.log('Club added successfully:', response);
      alert("Application added successfully");
      this.getClubsNow();
    },
    (error: any) => {
      console.error('Error occurred while creating club:', error.message);
    }
  );
}
 
 }
 @Component({
  selector: 'app-dialog-content',
  templateUrl: 'addCandidature.html',
})
export class AddCandidatureDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  freelancerId: number | null = null; 
  taskId: number;

  @Output() registerUserEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddCandidatureDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Get taskId from parent component
    private http: HttpClient
  ) { 
    this.taskId = data.taskId; // Store task ID
  }

  AddCandidature(signupForm: NgForm): void {
    const candidatureData = { ...signupForm.value };

    // Retrieve freelancer (connected user) ID from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.freelancerId = parsedUser.id; // Assign freelancerId
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.errorMessage = "Invalid user data in local storage";
        return;
      }
    } else {
      console.error('No user found in local storage!');
      this.errorMessage = "Error: No user found";
      return;
    }

    // Add taskId and freelancerId to the candidature object
    candidatureData.taskid = this.taskId;
    candidatureData.freelanceid = this.freelancerId;

    // Emit the updated candidature data
    this.registerUserEvent.emit(candidatureData);
    console.log("Emitted Candidature Data:", candidatureData);

    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
 
 
