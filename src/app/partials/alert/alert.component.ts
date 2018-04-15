import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less']
})
export class AlertComponent implements OnInit {
  @Input() enabled: boolean;
  @Input() type: string;
  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
