import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-register.component.html',
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private settings: CoreService, private router: Router, private userService: UserService,) { }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  get f() {
    return this.form.controls;
  }
  onRegister() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.userService.register(this.form.value).subscribe(
      (response) => {
        this.successMessage = 'User Rgistred successfuly';
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Registration failed: ' + error.error;
        this.successMessage = '';
      }
    );
  }
}
