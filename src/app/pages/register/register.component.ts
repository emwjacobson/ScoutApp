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
    password: ''
  };

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
  }

  public register() {
    this.backend.register(this.register_form).then((user_info) => {
      this.success.message = 'Registered Successfully!';
      this.success.success = true;
      this.error.error = false;
      setTimeout(() => {
        this.router.navigate(['login']);
      }, 1000);
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
