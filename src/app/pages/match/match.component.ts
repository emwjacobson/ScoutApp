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
  public alert = {
    enabled: false,
    type: '',
    message: ''
  };
  public match_numbers: string[] = [];

  constructor(public backend: BackendService) {
    this.match_template = this.backend.getMatchTemplate();
    this.form = this.backend.getFormGroup();

    const formControlSub = this.form.controls['team_number'].valueChanges.debounceTime(500).subscribe((new_team_num) => {
      this.match_numbers = this.backend.getTeamMatches(new_team_num);
    });
  }

  ngOnInit() {
  }

  public submitMatchScout() {
    this.backend.uploadMatch(this.form.value).then((res: boolean) => {
      if (res) {
        this.alert = {
          enabled: true,
          type: 'success',
          message: 'Match Scout successfully submitted.'
        };
        this.form.reset();
      } else {
        this.alert = {
          enabled: true,
          type: 'danger',
          message: 'Unable to submit match scout.'
        };
      }
    }).catch((error) => {
      this.alert = {
        enabled: false,
        type: 'danger',
        message: error
      };
    });
  }

}
