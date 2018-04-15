import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  public regionals = [];
  public regional_form = {
    regional: ''
  };
  public password_form = {
    password: '',
    password_rpt: ''
  };
  public regional_alert = {
    enabled: false,
    type: '',
    message: ''
  };
  public password_alert = {
    enabled: false,
    type: '',
    message: ''
  };

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
    this.getRegionals();
  }

  public getRegionals() {
    this.backend.getRegionals().onSnapshot((data) => {
      this.regionals = data.docs;
    });
  }

  public saveRegional() {
    this.regional_alert = {
      enabled: true,
      type: 'success',
      message: 'Regional has been changed.'
    };
    this.backend.setCurRegional({ id: this.regional_form.regional });
  }

  public changePassword() {
    if (this.password_form.password !== this.password_form.password_rpt) {
      this.password_alert = {
        enabled: true,
        type: 'danger',
        message: 'Passwords do not match.'
      };
      return;
    }
    this.backend.changePassword(this.password_form.password).then((res) => {
      this.password_alert = {
        type: 'success',
        message: 'Password has successfully been changed.',
        enabled: true
      };
    }).catch((error) => {
      this.password_alert.type = 'danger';
      switch (error.code) {
        case 'auth/requires-recent-login':
          this.password_alert.message = error.message + ' Redirecting in 3 seconds...';
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 3000);
          break;
        default:
          this.password_alert.message = error.message;
      }
      this.password_alert.enabled = true;
    });
  }

}
