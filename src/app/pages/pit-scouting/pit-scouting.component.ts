import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pit-scouting',
  templateUrl: './pit-scouting.component.html',
  styleUrls: ['./pit-scouting.component.less']
})
export class PitScoutingComponent implements OnInit {
  public pit_form = {
    team_number: null,
    image: null,
    drivetrain: '',
    comments: '',
  };

  constructor() { }

  ngOnInit() {
  }

}
