import { Component, OnInit, TemplateRef } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { QuerySnapshot } from '@firebase/firestore-types';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { MatchModalComponent } from '../../partials/match-modal/match-modal.component';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {
  modalRef: BsModalRef;

  constructor(private backend: BackendService, private modal: BsModalService) { }

  ngOnInit() {
  }

  public getRegional() {
    return this.backend.getCurRegional();
  }

  public getMatches(team_number: number) {
    return this.backend.getCurRegional().matches.filter(match => {
      return (match.alliances.red.team_keys.includes('frc' + team_number) || match.alliances.blue.team_keys.includes('frc' + team_number));
    });
  }

  public getStats(team_number: number) {
    const matches = this.getMatches(team_number);
    const stats = {
      wins: 0,
      losses: 0,
      ties: 0,
      unplayed: 0
    };
    matches.forEach(match => {
      if (match.alliances.blue.team_keys.includes('frc' + team_number)) { // If team was on blue alliance
        if (match.alliances.blue.score > match.alliances.red.score) {
          stats.wins++;
        } else if (match.alliances.blue.score < match.alliances.red.score) {
          stats.losses++;
        } else {
          if (match.alliances.blue.score === -1) {
            stats.unplayed++;
          } else {
            stats.ties++;
          }
        }
      } else { // If team was on red alliance.
        if (match.alliances.red.score > match.alliances.blue.score) {
          stats.wins++;
        } else if (match.alliances.red.score < match.alliances.blue.score) {
          stats.losses++;
        } else {
          if (match.alliances.red.score === -1) {
            stats.unplayed++;
          } else {
            stats.ties++;
          }
        }
      }
    });
    return stats;
  }

  public getPitData(team_number: number) {
    return this.backend.getPitData().filter((team) => {
      return team.team_number === team_number;
    })[0];
  }

  public convertTime(epoch_time: number) {
    const d = new Date(epoch_time * 1000);
    const hours = d.getHours() % 12;
    const ampm = hours > 12 ? 'PM' : 'AM';
    let minutes: string | number = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }

  public openModal(match, team) {
    const initialState = {
      match_data: match,
      team_data: team
    };
    this.modalRef = this.modal.show(MatchModalComponent, {initialState, class: 'full-modal'});
  }

}
