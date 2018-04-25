import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less']
})
export class AnalysisComponent implements OnInit {

  constructor(private backend: BackendService) { }

  ngOnInit() {
  }

  public getRegional() {
    return this.backend.getCurRegional();
  }

}
