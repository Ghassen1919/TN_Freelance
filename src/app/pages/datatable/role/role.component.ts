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
import { AdroleComponent } from './adrole/adrole.component';
import { ClubService } from '../../../services/club.service';
import { RoleService } from '../../../services/role.service';
import { filter, mergeMap } from 'rxjs';

@Component({
  selector: 'app-role',
 
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
     searchText: any;
     data:any =[];
     clubName:string;
     clientId:number;
     dateCreation : any;
     description: string;
     displayedColumns: string[] = ['#', 'title', 'description', 'client', 'status'];
     dataSource = new MatTableDataSource(this.data);
     @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);
   
     constructor(public dialog: MatDialog, public datePipe: DatePipe,private clubService: ClubService, private http: HttpClient) { }
   
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
      
        this.clubService.getAllTasksByFreealancer(this.clientId).subscribe(res => {
          this.data = res;
          console.log(this.data);
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
        });
      }
   
    
   
   
   }





