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

  constructor(private backend: BackendService) { }

  ngOnInit() {
    this.getRegionals();
  }

  public getRegionals() {
    this.backend.getAllRegionals().subscribe((res) => {
      this.regionals = res.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
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

}
