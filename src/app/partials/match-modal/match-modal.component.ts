import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: ['./match-modal.component.less']
})
export class MatchModalComponent implements OnInit {
  public match_data: any;
  public team_data: any;
  public scout_data: any;
  public match_template: any;

  constructor(public modalRef: BsModalRef, private backend: BackendService) { }

  ngOnInit() {
    console.log(this.match_data);
    console.log(this.team_data);
    this.scout_data = this.backend.getMatchData(this.match_data.key);
    this.match_template = this.backend.getMatchTemplate();
    console.log(this.scout_data);
    console.log(this.match_template);
  }

  public convertTime(epoch_time: number) {
    const d = new Date(epoch_time * 1000);
    const hours = d.getHours() % 12;
    const ampm = hours > 12 ? 'PM' : 'AM';
    let minutes: string | number = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }

}
