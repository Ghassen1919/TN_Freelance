import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { UserAuthService } from '../../../services/user-auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-updatepass',
  
  
  templateUrl: './updatepass.component.html',
  styleUrl: './updatepass.component.scss'
})
export class UpdatepassComponent  implements OnInit {
  oldPassword: string = '';
  newPassword: string = '';
  newPassword1: string = '';
  currentUser: any;
  showOldPassword: boolean = false;
  shownewPassword: boolean = false;
  shownewPassword1: boolean = false;
  constructor(public userService: UserService,private http: HttpClient ,private userAuthService: UserAuthService, ) { }
  

  ngOnInit(): void {
    
  }
  modifyPassword(form: NgForm) {
    if (form.invalid) {
        alert('Please verify your passwords');
        // Form is invalid, do not proceed
        return;
    }
    
  
    const url = `http://localhost:8085/updatePassword?oldpassword=${this.oldPassword}&newpassword=${this.newPassword}&newpassword1=${this.newPassword1}`;
    
    this.http.put(url, null).subscribe(
        response => {
            Swal.fire({
                background: "#283747",
                color: "white",
                position: "top-end",
                icon: "success",
                title: response,
                showConfirmButton: false,
                timer: 1500
            });
            console.log('Password modified successfully');
            form.resetForm();
        },
        error => {
            console.error('Error modifying password', error);
            alert('please verify your passwords');
        }
    );
}
async onFileSelected(): Promise<void> {
    const { value: file } = await Swal.fire({
      title: "Select Profile image",
      background:"#283747",
      color:"white",
      input: "file",
      showCancelButton: true,
      confirmButtonText: "Change photo",
      inputAttributes: {
        "accept": "image/*",
        "aria-label": "Upload your profile picture"
      }
    });
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the formData to your Spring Boot endpoint
      this.http.put(`http://localhost:8085/changeph`, formData).subscribe(
        response => {
          Swal.fire({
            background:"#283747",
            color:"white",
            position: "top-end",
            icon: "success",
            title: "Photo modified successfully",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            // Access the "OK" button callback

            // Success handling, if needed
           

            
            setTimeout(() => {
               window.location.reload();
            }, 500);
          });
        },
        error => {
          // Handle any errors here
          console.error('Error changing photo', error);
          Swal.fire({
            title: "Error changing photo",
            icon: "error",
            color: "white",
            background: "#283747",
            text: "Size of the Photo is unsupported",
            timer: 1500,
          });
        }
      );
    }
  } 
}
