import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.less']
})
export class AnalysisComponent implements OnInit {
  public radarChartLabels: string[] = [];
  public radarChartData: any = [{ data: [], label: '' }];
  public radarOptions: any = {
    scale: {
      ticks: {
        beginAtZero: true
      }
    }
  };
  public showChart = false;

  constructor(private backend: BackendService) { }

  ngOnInit() {
  }

  public getTeams() {
    return this.backend.getCurRegional().teams;
  }

  public updateChart(e) {
    const team_number = e.target.value;
    const data = this.getMatchStats(team_number);
    if (!data) {
      this.showChart = false;
      return;
    } else {
      this.showChart = true;
    }
    this.radarChartData = this.getValues(data);

    // this.radarChartLabels = this.getKeys(data);
    // I dont know why this works and the line above doesnt.
    while (this.radarChartLabels.length > 0) {
      this.radarChartLabels.pop();
    }
    this.getKeys(data).forEach(t => {
      this.radarChartLabels.push(t);
    });
  }

  public getMatchStats(team_number: number): any {
    const total = {};
    const matches = this.backend.getMatchData().filter((match) => match.team_number === Number(team_number));
    matches.forEach(m => {
      for (const key in m) {
        if (!m.hasOwnProperty(key)) {
          continue;
        }
        if (typeof(m[key]) === 'number' && key !== 'team_number') {
          if (!total[key]) {
            total[key] = m[key];
          } else {
            total[key] += m[key];
          }
        }
      }
    });

    const avgs = {};
    for (const key in total) {
      if (!total.hasOwnProperty(key)) {
        continue;
      }
      if (!avgs[key]) {
        avgs[key] = total[key] / matches.length;
      }
    }
    return avgs;
  }

  public getKeys(obj) {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  }

  public getValues(obj) {
    if (!obj) {
      return [{ data: [], label: '' }];
    }
    return [{ data: Object.values(obj), label: '' }];
  }

}
