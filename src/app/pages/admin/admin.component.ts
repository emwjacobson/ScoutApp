import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  public regionals = [];
  public regional_alert = {
    enabled: false,
    type: '',
    message: ''
  };
  public regional_form = {
    regional: ''
  };
  public limited_users = [];
  public limited_user_alert = {
    enabled: false,
    type: '',
    message: ''
  };

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.getRegionals();
    this.getLimitedUsers();
  }

  public getRegionals() {
    this.backend.getAllRegionals().subscribe((res) => {
      this.regionals = res.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    });
  }

  public getLimitedUsers() {
    this.backend.getLimitedUsers().onSnapshot((data) => {
      if (data.docs.length === 0) {
        this.limited_users = [];
        return;
      }
      const temp_users = [];
      data.docs.forEach((user) => {
        temp_users.push(user.data());
      });
      this.limited_users = temp_users;
    });
  }

  public addRegional() {
    const regAdd = this.regionals.find(reg => reg.key === this.regional_form.regional);
    this.backend.addRegional(regAdd).then((res) => {
      this.regional_alert = {
        enabled: true,
        type: 'success',
        message: 'Successfully added regional.'
      };
    }).catch((error) => {
      this.regional_alert = {
        enabled: true,
        type: 'danger',
        message: error.message
      };
    });
  }

  public acceptUser(user_id: string): void {
    this.limited_user_alert = {
      enabled: true,
      type: 'primary',
      message: 'Sending accept request...'
    };
    this.backend.acceptUser(user_id).then((res) => {
      this.limited_user_alert = {
        enabled: true,
        type: 'success',
        message: 'User was accepted successfully!'
      };
    }).catch((error) => {
      this.limited_user_alert = {
        enabled: true,
        type: 'danger',
        message: error.message
      };
    });
  }

  public denyUser(user_id: string): void {
    this.limited_user_alert = {
      enabled: true,
      type: 'primary',
      message: 'Sending deny request...'
    };
    this.backend.denyUser(user_id).then((res) => {
      this.limited_user_alert = {
        enabled: true,
        type: 'success',
        message: 'User was denied successfully!'
      };
    }).catch((error) => {
      this.limited_user_alert = {
        enabled: true,
        type: 'danger',
        message: error.message
      };
    });
  }

}
