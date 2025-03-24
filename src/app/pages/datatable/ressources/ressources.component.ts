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



@Component({
  selector: 'app-ressources',
  
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.scss'
})
export class RessourcesComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  data:any =[];
  data1:any =[];
  displayedColumns: string[] = [
    
    'username',
    'firstname',
    'lastname',
    
    
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
    this.userService. getallfreelancer () .subscribe(res => {
      console.log(res);
      this.data = res;
      this.dataSource = new MatTableDataSource(this.data); // Update dataSource after receiving data
      this.dataSource.paginator = this.paginator; // Reassign paginator
      console.log(this.data);  
    });
  }
  AddClub(club: any): void {
    const url = `http://localhost:8085/api/reviews`;
  
    // Retrieve the user object from local storage
    const user = localStorage.getItem('user');
  
    let reviewerId: string | null = null;
    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse stored user data
        reviewerId = parsedUser.id; // Retrieve the user ID
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
      reviewerId: reviewerId, // Add client ID
    };
  
    console.log("Adding club:", club.title, "for Client ID:", reviewerId);
  
    this.http.post(url, requestBody).subscribe(
      (response: any) => {
        console.log('Club added successfully:', response);
        alert("Review added successfully");
        
      },
      (error: any) => {
        console.error('Error occurred while creating club:', error.message);
      }
    );
  }
  openDialogAddCandidature(reviewedId: number): void {
      const dialogRef = this.dialog.open(AddRessourceDialogContentComponent, {
        width: '800px',
        data: { reviewedId: reviewedId }  // Pass taskId to dialog
      });
    
      dialogRef.componentInstance.registerUserEvent.subscribe((data: any) => {
        this.AddClub(data);
      });
    }
    ViewApplications(id :number): void {
    
      const url = `http://localhost:8085/api/reviews/average/${id}`;
    
      this.http.get(url).subscribe(
        res => {
          this.data1 = res;
              
              
          },
          (error: any) => {
              console.error('Error occurred while updating club:', error);
          }
      );
    }
    openDialogviewaverage(id: number): void {
      const dialogRef = this.dialog.open(GetAverageDialogContentComponent, {
        width: '300px',
        height: '200px',
        data: { taskId: id }  // ✅ Pass taskId correctly
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.event === 'Updated') {
          this.ViewApplications(id);  // ✅ Refresh applications list if updated
        }
      });
    }
/*
UpdateClub(clubData: any, id :number): void {
    
  const url = `http://localhost:8085/modifierClub/${id}?clubName=${clubData.clubName}&dateCreation=${clubData.dateCreation}&description=${clubData.description}`;

  this.http.put(url, clubData).subscribe(
      (response: any) => {
          console.log('Club updated successfully');
          console.log(clubData.clubName);
          
          this.getClubsNow();
          
          this.dialog.open(UpdateclubComponent);
          this.table.renderRows();
      },
      (error: any) => {
          console.error('Error occurred while updating club:', error);
      }
  );
}
deleteClub(id: number): void {
  const url = `http://localhost:8085/deleteclub/${id}`;
  this.http.delete<void>(url).subscribe(
    () => {
      console.log('Club deleted successfully');
      this.getClubsNow();
      
      this.table.renderRows();
      // Handle success, such as updating UI or showing a message
    },
    error => {
      console.error('Error occurred while deleting club:', error);
      // Handle error, such as displaying an error message
    }
  );
}*/
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'addRessource.html',
})
export class AddRessourceDialogContentComponent {
  formData: any = { rating: 0, comment: '' }; // Initialize rating to avoid undefined
  errorMessage: string = '';
  successMessage: string = '';
  reviewerid: number | null = null;
  reviewedId: number;
  stars: number[] = [1, 2, 3, 4, 5]; 
  ratingTouched = false;

  @Output() registerUserEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddRessourceDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) { 
    this.reviewedId = data.reviewedId; 
  }

  AddCandidature(signupForm: NgForm): void {
    const candidatureData = { ...signupForm.value };

    // Retrieve user ID from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.reviewerid = parsedUser.id; 
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

    // Add necessary IDs to candidature data
    candidatureData.reviewedId = this.reviewedId;
    candidatureData.reviewerid = this.reviewerid;
    candidatureData.rating = this.formData.rating; 
    // Emit data
    this.registerUserEvent.emit(candidatureData);
    console.log("Emitted Candidature Data:", candidatureData);

    this.dialogRef.close();
  }

  rate(value: number) {
    this.formData.rating = value;
    this.ratingTouched = true;
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'getaverage.html',
  
})
export class GetAverageDialogContentComponent {
  errorMessage: string = '';
  candidatures: any[] = []; // Store applications for the task
  taskId: number;
  candidatures1: any[] = [];
  rating: number = 0;
  constructor(
    public dialogRef: MatDialogRef<GetAverageDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // ✅ Get taskId from parent
    private http: HttpClient
  ) { 
    this.taskId = data.taskId; // ✅ Store task ID
    this.GetCandidature();  // ✅ Fetch applications when the dialog opens
  }

  GetCandidature(): void {
    const url = `http://localhost:8085/api/reviews/average/${this.taskId}`;
  
    this.http.get(url).subscribe(
      (res: any) => {
        this.rating = res;  // Assign the rating value
        console.log('Received rating:', this.rating);
      },
      (error: any) => {
        console.error('Error fetching rating:', error);
        this.errorMessage = 'Failed to load rating';
      }
    );
  }
  
  closeDialog(): void {
    this.dialogRef.close({ event: 'Updated' });
  }
}