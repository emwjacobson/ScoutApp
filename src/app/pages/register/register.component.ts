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
  public error = {
    error: false,
    message: '',
  };
  public success = {
    success: false,
    message: '',
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
    if (this.register_form.password !== this.register_form.rpt_password) {
      this.error.error = true;
      this.error.message = 'Passwords do not match.';
      return;
    }
    this.backend.register(this.register_form).then((user_info) => {
      this.success.message = 'Registered Successfully!  Redirecting to login...';
      this.success.success = true;
      this.error.error = false;
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 2000);
    }).catch((error) => {
      this.success.success = false;
      this.error.error = true;
      switch (error.code) {
        case 'invalid-argument':
          this.error.message = error.message;
          break;
        case 'already-exists':
          this.error.message = error.message;
          break;
        case 'internal':
          this.error.message = error.message;
          break;
        default:
          console.log(error);
          this.error.message = 'An unknown error occured. Check console.';
          break;
      }
    });
  }

}
