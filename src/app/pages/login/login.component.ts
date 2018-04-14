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
  public alert = {
    enabled: false,
    type: '',
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
    this.alert = {
      type: 'primary',
      message: 'Attempting to sign in...',
      enabled: true
    };
    this.backend.login(this.login_form).then((user: UserCredential) => {
      this.alert = {
        type: 'success',
        message: 'Login Successful, Redirecting...',
        enabled: true
      };
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    }).catch((error) => {
      this.alert.type = 'danger';
      switch (error.code) {
        case 'auth/invalid-email':
          this.alert.message = error.message;
          break;
        case 'auth/user-disabled':
          this.alert.message = error.message;
          break;
        case 'auth/user-not-found':
          this.alert.message = error.message;
          break;
        case 'auth/wrong-password':
          this.alert.message = error.message;
          break;
        default:
          console.log(error);
          this.alert.message = 'An unknown error occured, check console.';
      }
      this.alert.enabled = true;
    });
  }

}
