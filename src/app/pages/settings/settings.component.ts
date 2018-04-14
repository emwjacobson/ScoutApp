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
  public alert = {
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
    this.backend.setCurRegional({ id: this.regional_form.regional });
  }

}
