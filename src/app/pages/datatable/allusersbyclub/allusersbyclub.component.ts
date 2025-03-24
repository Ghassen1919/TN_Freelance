import { Component, Inject, Optional, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
//import { AddComponent } from './add/add.component';
import { UserService } from '../../../services/user.service';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AddPlayerComponent } from './add-player/add-player.component';
import { RoleService } from '../../../services/role.service';
import { ClubService } from '../../../services/club.service';

@Component({
  selector: 'app-allusersbyclub',
 
  templateUrl: './allusersbyclub.component.html',
  styleUrl: './allusersbyclub.component.scss'
})
export class ALLusersbyclubComponent implements AfterViewInit{
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  data:any =[];
  selectedTeam: number | null = null;
  selectedRole: number | null = null;
  TeamsList:any =[];
  RolesList:any =[];
  originalData: any[] = [];
  user: any;
  displayedColumns: string[] = [
    
    'name',
    'email',
    'role',
    'team',
    'date of birth',
    'phone number',
    'salary',
    'country of residence',
    'action'
  ];

  dataSource = new MatTableDataSource(this.data);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe,private userService: UserService,private roleService: RoleService, private http: HttpClient,private clubService: ClubService,) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {this.getUsersByClubNow();
    this.getTeamsNow();
    this.getRolesByClubNow()
   
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
  getUsersByClubNow(): void {
    this.userService.getUsersByClub().subscribe(res => {
      console.log(res);
      this.data = res;
      this.dataSource = new MatTableDataSource(this.data); // Update dataSource after receiving data
      this.dataSource.paginator = this.paginator; // Reassign paginator
      console.log(this.data);  
    });
  }
  getTeamsNow(): void {
    this.clubService.getTeamsInClub().subscribe(
      (data) => {
        this.TeamsList = data;
      },
      (error) => {
        console.error('Error fetching list of managers:', error);
      }
    );
  }
  getRolesByClubNow(): void {
    
    this.roleService.getRoles().subscribe(res => {
      this.RolesList = res;
      
    });
  }
  onTeamChange(): void {
    if (this.selectedTeam === null) {
      if (this.selectedRole === null) {
        this.resetTable();
      } else {
        this.filterUsersByRole(this.selectedRole);
      }
    } else {
      if (this.selectedRole === null) {
        this.filterUsersByTeam(this.selectedTeam);
      } else {
        this.filterUsersByTeamAndRole(this.selectedTeam, this.selectedRole);
      }
    }
  }
  
  onRoleChange(): void {
    if (this.selectedRole === null) {
      if (this.selectedTeam === null) {
        this.resetTable();
      } else {
        this.filterUsersByTeam(this.selectedTeam);
      }
    } else {
      if (this.selectedTeam === null) {
        this.filterUsersByRole(this.selectedRole);
      } else {
        this.filterUsersByTeamAndRole(this.selectedTeam, this.selectedRole);
      }
    }
  }
  resetTable(): void {
    this.getUsersByClubNow(); // Reload all users
  }
  filterUsersByTeam(teamId: number): void {
    this.userService.getUsersByTeam(teamId).subscribe(res => {
      console.log(res);
      this.dataSource.data = res; // Update dataSource directly
      this.dataSource.paginator = this.paginator; // Reassign paginator if needed
    });
  }
  filterUsersByRole(RoleId: number): void {
    this.userService.getUsersByRoleAndClub(RoleId).subscribe(res => {
      console.log(res);
      this.dataSource.data = res; // Update dataSource directly
      this.dataSource.paginator = this.paginator; // Reassign paginator if needed
    });
  }
  filterUsersByTeamAndRole(teamId: number, roleId: number): void {
    this.userService.getUsersByTeamAndRole(teamId, roleId).subscribe(res => {
      console.log(res);
      this.dataSource.data = res; // Update dataSource directly
      this.dataSource.paginator = this.paginator; // Reassign paginator if needed
    });
  }
  openDialogAddPlayer(): void {
    const dialogRef = this.dialog.open(PlayersDialogContentComponent, {
      width: '1000px',
    });

    // Listen to the event emitted by the dialog component
    dialogRef.componentInstance.registerPlayerEvent.subscribe((data:any) => {
      this.registerPlayer(data.playerData, data.teams); // Call the registerUser method with form data
    });
  }
  openDialogAddCoach(): void {
    const dialogRef = this.dialog.open(CoachsDialogContentComponent, {
      width: '1000px',
    });

    // Listen to the event emitted by the dialog component
    dialogRef.componentInstance.registerCoachEvent.subscribe((data:any) => {
      this.registerCoach(data.coachData,data.teams); // Call the registerUser method with form data
    });
  }
  openDialogAddOthers(): void {
    const dialogRef = this.dialog.open(UsersInClubDialogContentComponent, {
      width: '1000px',
    });

    // Listen to the event emitted by the dialog component
    dialogRef.componentInstance.registerUserInClubEvent.subscribe((data: any) => {
      this.registerUserInClub(data.userData, data.roles,data.teams); // Change clubData to role
  });
  }
  registerPlayer(user :any, teams: number[]): void {
    const url = 'http://localhost:8085/registerPlayer?role=Player';

    const requestBody = {
      user: user, // Change clubData to role
      teams: teams
  };
  console.log(teams);
  console.log(user)
    this.http.post(url, requestBody).subscribe(
      (response: any) => {
        console.log('User registered successfully');
        this.getUsersByClubNow();
    this.dialog.open(AddPlayerComponent);
    this.table.renderRows();
      },
      
      (error: any) => {
        alert("username or email already exists please try again with other Name or Email")
        console.error('username or email already exists', error);
      }
    );
    
    
  }
  registerCoach(user :any,teams:number[]): void {
    const url = 'http://localhost:8085/registerPlayer?role=Coach';

    const requestBody = {
      user: user, // Change clubData to role
      teams: teams
  };
    this.http.post(url, requestBody).subscribe(
      (response: any) => {
        console.log('User registered successfully');
        this.getUsersByClubNow();
    this.dialog.open(AddPlayerComponent);
    this.table.renderRows();
      },
      
      (error: any) => {
        alert("username or email already exists please try again with other Name or Email")
        console.error('username or email already exists', error);
      }
    );
    
    
  }
  registerUserInClub(user: any ,roles: number[],teams: number[]): void {
    const url = 'http://localhost:8085/registeruserinclub';

    
    const requestBody = {
      user: user, // Change clubData to role
      roles: roles,
      teams:teams
  };


  this.http.post(url, requestBody).subscribe(
      (response: any) => {
          console.log('Role added successfully');
           // Access roleName from role
          
          this.getUsersByClubNow();
          this.dialog.open(AddPlayerComponent);
          this.table.renderRows();
      },
      (error: any) => {
        alert("RoleName exists try another one")
          console.error('Error occurred while creating role:', error);
      }
  );
    
    
  }
  Blockuser(userId: number) {
    const url = `http://localhost:8085/block/${userId}`;
    this.http.post(url, {}).subscribe(() => {
      alert('user blocked successfuly!');
      this.getUsersByClubNow();
      console.log('user blocked successfully');
     
    }, (error) => {
      console.error('Error modifying claim:', error);
    });
  }
  findUserById(userId: number) {
    const url = `http://localhost:8085/findUserById/${userId}`;
    this.http.get<any>(url).subscribe(
      (data) => {
        this.user = data;
        console.log('User found successfully', this.user);
       
      },
      (error) => {
        console.error('Error finding user:', error);
      }
    );
  }

  openDialogShowUserDetails(user: any): void {
    const dialogRef = this.dialog.open(ShowUserDetailsDialogContentComponent, {
      width: '500px',
      data: { user: user }
    });

    dialogRef.componentInstance.updateclubEvent.subscribe(() => {
      this.findUserById(user.userId); // Refresh user data if needed
    });
  }
  Unblockuser(userId: number) {
    const url = `http://localhost:8085/unblock/${userId}`;
    this.http.post(url, {}).subscribe(() => {
      alert('user unblocked successfuly!');
      this.getUsersByClubNow();
      console.log('user unblocked successfully');
     
    }, (error) => {
      console.error('Error modifying claim:', error);
    });
  }
  // tslint:disable-next-line - Disables all
 

  // tslint:disable-next-line - Disables all
  

  // tslint:disable-next-line - Disables all
  
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'addPlayer.html',
})
// tslint:disable-next-line: component-class-suffix
export class PlayersDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  TeamsList:any =[];
  selectedTeams: { [key: number]: boolean } = {};
  @Output() registerPlayerEvent: EventEmitter<{ playerData: any; teams: number[] }> = new EventEmitter(); // Define an output event to emit form data
  constructor(
    private userService: ClubService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<PlayersDialogContentComponent>,
    
    private http: HttpClient
  ) {
    this.TeamsList = [];
    this.getTeamsNow();
  }
  
  registerPlayer(signupForm: NgForm): void {
    if (signupForm.value.userPassword !== signupForm.value.confirmPassword) {
      // If passwords do not match, display error message and return
      alert("passwords not match")
      return;
    }
    const playerData = { ...signupForm.value };

    // Remove selected property from clubData
    delete playerData.selectedTeams;

    // Get selected permissions as numbers
    const selectedTeams = Object.keys(this.selectedTeams)
        .filter(key => this.selectedTeams[parseInt(key, 10)]) // Convert key to number
        .map(Number); // Convert keys from string to number
        
    // Emit form data and selected permissions
    const dataToEmit = {
        playerData: playerData,
        teams: selectedTeams
    };
    this.registerPlayerEvent.emit(dataToEmit);
    console.log('User password:', this.formData.userPassword);
    this.dialogRef.close();// Emit form data when registering user
  }
  getTeamsNow(): void {
    this.userService.getTeamsInClub().subscribe(
      (data) => {
        this.TeamsList = data;
      },
      (error) => {
        console.error('Error fetching list of managers:', error);
      }
    );
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  hasSelectedTeams(): boolean {
    return Object.values(this.selectedTeams).some(value => value === true);
  
}
}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog1-content',
  templateUrl: 'addCoach.html',
})
// tslint:disable-next-line: component-class-suffix
export class CoachsDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  TeamsList:any =[];
  selectedTeams: { [key: number]: boolean } = {};
  @Output() registerCoachEvent: EventEmitter<{ coachData: any; teams: number[] }> = new EventEmitter();  // Define an output event to emit form data
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<CoachsDialogContentComponent>,
    private userService: ClubService,
    private http: HttpClient
  ) {
    this.TeamsList = [];
    this.getTeamsNow();
  }
  
  registerCoach(signupForm: NgForm): void {
    if (signupForm.value.userPassword !== signupForm.value.confirmPassword) {
      // If passwords do not match, display error message and return
      alert("passwords not match")
      return;
    }
    const coachData = { ...signupForm.value };

    // Remove selected property from clubData
    delete coachData.selectedTeams;

    // Get selected permissions as numbers
    const selectedTeams = Object.keys(this.selectedTeams)
        .filter(key => this.selectedTeams[parseInt(key, 10)]) // Convert key to number
        .map(Number); // Convert keys from string to number
        
    // Emit form data and selected permissions
    const dataToEmit = {
        coachData: coachData,
        teams: selectedTeams
    };
    this.registerCoachEvent.emit(dataToEmit);
    console.log('User password:', this.formData.userPassword);
    this.dialogRef.close();// Emit form data when registering user
  }
  getTeamsNow(): void {
    this.userService.getTeamsInClub().subscribe(
      (data) => {
        this.TeamsList = data;
      },
      (error) => {
        console.error('Error fetching list of managers:', error);
      }
    );
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  hasSelectedTeams(): boolean {
    return Object.values(this.selectedTeams).some(value => value === true);
}

}
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog2-content',
  templateUrl: 'addOthers.html',
})
// tslint:disable-next-line: component-class-suffix
export class UsersInClubDialogContentComponent {
  formData: any = {}; 
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  RolesList: any = [];
  TeamsList:any =[];
  selectedRoles: { [key: number]: boolean } = {};
  selectedTeams: { [key: number]: boolean } = {};
  @Output() registerUserInClubEvent: EventEmitter<{ userData: any; roles: number[]; teams: number[]  }> = new EventEmitter(); // Define an output event to emit form data
  constructor(private roleService: RoleService,
    private userService: ClubService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UsersInClubDialogContentComponent>,
   
    private http: HttpClient
  ) {
    this.RolesList = [];
      this.getRolesByclubNow();
      this.TeamsList = [];
      this.getTeamsNow();
  }
  
  registerUserInClub(signupForm: NgForm): void {
    if (signupForm.value.userPassword !== signupForm.value.confirmPassword) {
      // If passwords do not match, display error message and return
      alert("passwords not match")
      return;
    }
    const userData = { ...signupForm.value };

    // Remove selected property from clubData
    delete userData.selectedPermissions;

    // Get selected permissions as numbers
    const selectedRoles = Object.keys(this.selectedRoles)
        .filter(key => this.selectedRoles[parseInt(key, 10)]) // Convert key to number
        .map(Number); // Convert keys from string to number
        
    const selectedTeams = Object.keys(this.selectedTeams)
        .filter(key => this.selectedTeams[parseInt(key, 10)]) // Convert key to number
        .map(Number); 
    // Emit form data and selected permissions
    const dataToEmit = {
        userData: userData,
        roles: selectedRoles,
        teams: selectedTeams
    };
    this.registerUserInClubEvent.emit(dataToEmit);
    console.log(dataToEmit);
    this.dialogRef.close();
}
getTeamsNow(): void {
  this.userService.getTeamsInClub().subscribe(
    (data) => {
      this.TeamsList = data;
    },
    (error) => {
      console.error('Error fetching list of managers:', error);
    }
  );
}
getRolesByclubNow(): void {
  this.roleService.getRolesByclub().subscribe(
      (data) => {
          this.RolesList = data;
      },
      (error) => {
          console.error('Error fetching list of roles:', error);
      }
  );
}
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  hasSelectedRoles(): boolean {
    return Object.values(this.selectedRoles).some(value => value === true);
}
hasSelectedTeams(): boolean {
  return Object.values(this.selectedTeams).some(value => value === true);
}
}
@Component({
  selector: 'app-dialog-content1',
  templateUrl: 'userDetails.html',
  styleUrl: 'userDetails.css',
})
export class ShowUserDetailsDialogContentComponent {
   
  errorMessage: string = '';
  successMessage: string = '';
  
  username: string = '';
  @Output() updateclubEvent: EventEmitter<any> = new EventEmitter<any>();

 user: any;
  formData:any;
  constructor(
    
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ShowUserDetailsDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient
  ) { this.user = data.user;
    
  }
  
  

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
