import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, NgForm, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { UserService } from '../../../services/user.service';
import { UserAuthService } from '../../../services/user-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  options = this.settings.getOptions();
  errorMessage: string = '';

  form: FormGroup;

  constructor(
    private router: Router,
    private settings: CoreService,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Initialization code if necessary
  }

  get f() {
    return this.form.controls;
  }

  login() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    this.userService.login(this.form.value).subscribe(
      (response: any) => {
        this.userAuthService.setRoles(response.user.role);
        this.userAuthService.setToken(response.access_token);
        this.userAuthService.setUser(response.user);
        const currentUser = {
          username: response.user.userName,
          email: response.user.email,
          userid: response.user.userId,
          
        };

        
        const role = response.user.role;

        this.router.navigate(['dashboards/home']);
      },
      (error: any) => {
        console.log('API Response:', error);

        if (error.status === 401) {
          this.errorMessage = 'Invalid Credentials';
        } else {
          this.errorMessage = 'Invalid Credentials';
        }
      }
    );
  }
}
