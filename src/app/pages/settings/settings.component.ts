import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

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

  constructor(private backend: BackendService) { }

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

}
