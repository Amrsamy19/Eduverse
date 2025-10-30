import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { UserAuth } from '../../services/user-auth';
import LoginCredentials from '../../Interfaces/loginCredentials';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, AsyncPipe],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage implements OnInit {
  userData!: {
    email: string;
    password: string;
  };
  errorMessage!: Observable<string>;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });

  constructor(private userAuthService: UserAuth, private router: Router) {}

  ngOnInit(): void {
    this.errorMessage = this.userAuthService.errorMessage$;
  }

  get emailValid() {
    return this.loginForm.controls.email.valid;
  }

  get passwordValid() {
    return this.loginForm.controls.password.valid;
  }

  get emailValue() {
    return this.loginForm.controls.email.value;
  }
  get passwordValue() {
    return this.loginForm.controls.password.value;
  }

  googleLogin() {
    this.userAuthService.googleLogin();
  }

  loginUser() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.userAuthService.login({ email, password } as LoginCredentials);
      setTimeout(() => {
        if (this.userAuthService.isLoggedIn) {
          this.loginForm.reset();
          this.router.navigate(['/home']);
        }
      }, 1000);
      // make uer auth return bool so we can handle optional rest from here and navigation
    }
  }
}
