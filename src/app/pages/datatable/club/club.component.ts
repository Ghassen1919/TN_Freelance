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
import { AddClubComponent } from './add-club/add-club.component';
import { ClubService } from '../../../services/club.service';
import { UpdateclubComponent } from './updateclub/updateclub.component';
import { UserAuthService } from '../../../services/user-auth.service';
import { catchError, of } from 'rxjs';
@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements AfterViewInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  data:any =[];
  data1:any =[];
  clubName:string;
  dateCreation : any;
  description: string;
  clientId:number;
  displayedColumns: string[] = ['#', 'title', 'description', 'client', 'status'];
  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe,private clubService: ClubService, private http: HttpClient,private userauth :UserAuthService) { }

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
    const user = localStorage.getItem('user'); // Get user from local storage
  
    if (user) {
      const parsedUser = JSON.parse(user); // Parse stored user data
      this.clientId = parsedUser.id; // Retrieve the user ID
    } else {
      console.error('No user found in local storage!');
      return;
    }
  
    console.log('Client ID:', this.clientId);
  
    this.clubService.getAllTasksByClient(this.clientId).subscribe(res => {
      this.data = res;
      console.log(this.data);
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }
  openDialogAddClub(): void {
    const dialogRef = this.dialog.open(AddClubDialogContentComponent, {
        width: '800px',
    });

    dialogRef.componentInstance.registerUserEvent.subscribe((data: any) => {
      this.AddClub(data.clubData); // Change clubData to role
  });
}
openDialogUpdateClub(id: number, clubName: string, description: string): void {
  const dialogRef = this.dialog.open(UpdateClubDialogContentComponent, {
    width: '800px',
    data: { 
      id: id, 
      title: clubName,  // Make sure 'title' matches what you are using in UpdateClubDialogContentComponent
      
      description: description
    }
  });

  dialogRef.componentInstance.updateclubEvent.subscribe((clubData: any) => {
    // Call the method to update the club with the clubData and id
    this.UpdateClub(clubData, id);
  });
}
openDialogAddCandidature(id: number): void {
  const dialogRef = this.dialog.open(GetCandidatureDialogContentComponent, {
    width: '800px',
    height: '500px',
    data: { taskId: id }  // ✅ Pass taskId correctly
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.event === 'Updated') {
      this.ViewApplications(id);  // ✅ Refresh applications list if updated
    }
  });
}
AddClub(club: any): void {
  const url = `http://localhost:8084/api/tasks`;

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
      alert("Task added successfully");
      this.getClubsNow();
    },
    (error: any) => {
      console.error('Error occurred while creating club:', error.message);
    }
  );
}


UpdateClub(clubData: any, id :number): void {
    
  const url = `http://localhost:8084/api/tasks/${id}`;

  this.http.put(url, clubData).subscribe(
      (response: any) => {
          console.log('task updated successfully');
          console.log(clubData.title);
          alert("Task updated successfully");
          this.getClubsNow();
          
          
          
      },
      (error: any) => {
          console.error('Error occurred while updating club:', error);
      }
  );
}
ViewApplications(id :number): void {
    
  const url = `http://localhost:8084/api/candidatures/task/${id}`;

  this.http.get(url).subscribe(
    res => {
      this.data1 = res;
          
          
      },
      (error: any) => {
          console.error('Error occurred while updating club:', error);
      }
  );
}
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'addClub.html',
})
export class AddClubDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  ManagerList:any =[];
  username: string = '';
  
  @Output() registerUserEvent: EventEmitter<{ clubData: any }> = new EventEmitter();

  constructor(private userService: UserService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AddClubDialogContentComponent>,
   
    private http: HttpClient
  ) { 
   
    
  }
  
  AddClub(signupForm: NgForm): void {
    const clubData = { ...signupForm.value };

    // Get user data from localStorage
    const user = localStorage.getItem('user');

    if (user) {
        try {
            const parsedUser = JSON.parse(user); // Parse stored user data
            clubData.clientId = parsedUser.id; // Assign user ID as clientId
        } catch (error) {
            console.error('Errofdfr parsing user data:', error);
            this.errorMessage = "Invalid user data in local storage";
            return;
        }
    } else {
        console.error('No user found in local storage!');
        this.errorMessage = "Error: No user found";
        return;
    }

    // Emit the updated clubData
    const dataToEmit = { clubData: clubData };
    this.registerUserEvent.emit(dataToEmit);
    console.log("Emitfdfdft data:", dataToEmit);

    this.dialogRef.close();
}
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
@Component({
  selector: 'app-dialog-content1',
  templateUrl: 'updateClub.html',
})
export class UpdateClubDialogContentComponent {
   
  errorMessage: string = '';
  successMessage: string = '';
  ManagerList:any =[];
  username: string = '';
  @Output() updateclubEvent: EventEmitter<NgForm> = new EventEmitter<NgForm>();
  id: number = 0;
  description:string;
  
  title: string;
  formData:any;
  constructor(
    private userService: UserService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdateClubDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) { 
    if (data && data.id) {
      this.description = data.description;
      
      this.title = data.title;
    }
    this.formData = {
      title: this.title,
      description: this.description,
      
    };
  }
  
  updateClub(signupForm: NgForm): void {
   
    const clubData = { ...signupForm.value };
    this.updateclubEvent.emit(clubData); 
    
    console.log(this.formData.title);
    console.log(this.formData.description);
    console.log(this.id); // Log the clubId
    this.dialogRef.close();
    // You can use this.clubId in your update logic if needed
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  onDateChange(event: any): void {
    // Parse the input date string and format it to yyyy-MM-dd
    const formattedDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    this.formData.dateCreation = formattedDate; // Assign the formatted date to formData.dateCreation
  }
}
@Component({
  selector: 'app-dialog-content',
  templateUrl: 'getCandidature.html',
  styleUrls: ['./candidatures.component.scss']
})
export class GetCandidatureDialogContentComponent {
  errorMessage: string = '';
  candidatures: any[] = []; // Store applications for the task
  taskId: number;
  candidatures1: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<GetCandidatureDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // ✅ Get taskId from parent
    private http: HttpClient
  ) { 
    this.taskId = data.taskId; // ✅ Store task ID
    this.GetCandidature();  // ✅ Fetch applications when the dialog opens
  }

  GetCandidature(): void {
  const url = `http://localhost:8084/api/candidatures/task/${this.taskId}`;

  this.http.get(url).subscribe(
    (res: any) => {
      // Filter out only the applications where confirm is false
      this.candidatures = res.filter((app: { confirmed: boolean | null; }) => app.confirmed === null);

      console.log('Applications (not confirmed):', this.candidatures);
    },
    (error: any) => {
      console.error('Error fetching applications:', error);
      this.errorMessage = 'Failed to load applications';
    }
  );
}
  confirmCandidature(id: number): void {
    const url = `http://localhost:8084/api/candidatures/${id}/confirm`; // Adjust the URL path if necessary

    this.http.patch<any>(url, {})
      .pipe(
        catchError(error => {
          console.error('Error confirming candidature:', error);
          // Handle the error, maybe show an error message
          return of(null); // Return a safe value if the request fails
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Candidature confirmed:', response);
          alert("application confirmed");
          this.GetCandidature();
          // Handle success, e.g., show success message, update the UI, or remove the confirmed candidature from the list
        }
      });
  }
  deleteCandidature(id: number): void {
    const url = `http://localhost:8084/api/candidatures/${id}`;

    this.http.delete(url).subscribe(
      () => {
        console.log('Candidature deleted successfully');
        // Optionally, refresh the list or remove from UI without reloading
        
        alert('Candidature deleted');
        this.GetCandidature();
      },
      (error) => {
        console.error('Error deleting candidature:', error);
        this.errorMessage = 'Failed to delete candidature';
        // Optionally, show an error message
      }
    );
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Updated' });
  }
}