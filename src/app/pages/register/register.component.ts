import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { HttpsError } from '@firebase/functions-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  public alert = {
    enabled: false,
    type: '',
    message: ''
  };
  public register_form = {
    email: '',
    displayName: '',
    password: '',
    rpt_password: ''
  };

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
  }

  public register() {
    this.alert = {
      type: 'primary',
      message: 'Attempting to register...',
      enabled: true
    };
    if (this.register_form.password !== this.register_form.rpt_password) {
      this.alert = {
        type: 'danger',
        message: 'Passwords do not match.',
        enabled: true
      };
      return;
    }
    this.backend.register(this.register_form).then((user_info) => {
      this.alert = {
        type: 'success',
        message: 'Registered Successfully!  Redirecting to login...',
        enabled: true
      };
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 2000);
    }).catch((error) => {
      this.alert.type = 'danger';
      switch (error.code) {
        case 'invalid-argument':
          this.alert.message = error.message;
          break;
        case 'already-exists':
          this.alert.message = error.message;
          break;
        case 'internal':
          this.alert.message = error.message;
          break;
        default:
          console.log(error);
          this.alert.message = 'An unknown error occured. Check console.';
          break;
      }
      this.alert.enabled = true;
    });
  }

}
