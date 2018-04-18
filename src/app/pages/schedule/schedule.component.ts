import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements OnInit {

  constructor(private backend: BackendService) { }

  ngOnInit() {
  }

  public getRegional() {
    return this.backend.getCurRegional();
  }

}
