import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.less']
})
export class MatchComponent implements OnInit {
  public match_template: any;
  public form: FormGroup;

  constructor(public backend: BackendService) {
    this.match_template = this.backend.getMatchTemplate();
    this.form = this.backend.getFormGroup();
  }

  ngOnInit() {
  }

  public submitMatchScout() {
    console.log(this.form);
  }

}
