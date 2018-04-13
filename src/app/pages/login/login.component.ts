import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { UserCredential } from '@firebase/auth-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public error = {
    error: false,
    message: ''
  };
  public success = {
    success: false,
    message: ''
  };
  public login_form = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
  }

  public login() {
    this.backend.login(this.login_form).then((user: UserCredential) => {
      this.success.success = true;
      this.success.message = 'Successfully logged in, redirecting...';
      this.error.error = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    }).catch((error) => {
      this.success.success = false;
      this.error.error = true;
      switch (error.code) {
        case 'auth/invalid-email':
          this.error.message = error.message;
          break;
        case 'auth/user-disabled':
          this.error.message = error.message;
          break;
        case 'auth/user-not-found':
          this.error.message = error.message;
          break;
        case 'auth/wrong-password':
          this.error.message = error.message;
          break;
        default:
          console.log(error);
          this.error.message = 'An unknown error occured, check console.';
      }
    });
  }

}
