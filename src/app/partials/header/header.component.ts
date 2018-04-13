import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle: EventEmitter<any> = new EventEmitter();
  public name = environment.name;

  constructor() { }

  ngOnInit() {
  }

  toggleSidebar() {
    this.sidebarToggle.emit(null);
  }

}
