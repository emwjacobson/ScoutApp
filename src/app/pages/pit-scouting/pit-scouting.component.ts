import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-pit-scouting',
  templateUrl: './pit-scouting.component.html',
  styleUrls: ['./pit-scouting.component.less']
})
export class PitScoutingComponent implements OnInit {
  public alert = {
    enabled: false,
    type: '',
    message: ''
  };
  public drivetrains: string[] = ['Six Wheel', 'Eight Wheel', 'Four Wheel', 'Swerve/Crab', 'Mechanum', 'Tank Tread', 'Other'];
  public pit_form = {
    team_number: null,
    image: null,
    drivetrain: '',
    comments: '',
  };

  private file_reader = new FileReader();

  constructor(private backend: BackendService) { }

  ngOnInit() {
  }

  public imageChanged(event) {
    this.file_reader.onload = () => {
      this.pit_form.image = this.file_reader.result;
    };
    if (event.target.files.length > 0) {
      this.file_reader.readAsDataURL(event.target.files[0]);
    } else {
      this.pit_form.image = null;
    }
  }

  public submitPit() {
    this.alert = {
      enabled: true,
      type: 'primary',
      message: 'Submitting Pit Scout...'
    };
    this.backend.uploadPit(this.pit_form).then((success) => {
      this.alert = {
        enabled: true,
        type: 'success',
        message: 'Successfully Submitted Pit Scout!'
      };
      this.pit_form.team_number = null;
      this.pit_form.image = null;
      this.pit_form.drivetrain = '';
      this.pit_form.comments = '';
    }).catch((error: Error) => {
      this.alert = {
        enabled: true,
        type: 'danger',
        message: error.message
      };
    });
  }

}
