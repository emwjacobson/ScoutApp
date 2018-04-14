import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'app';
  public opened = false;
  public public_pages = [
    { title: 'Home', url: '/' },
    { title: 'About', url: 'about' }
  ];
  public signed_in_pages = [
    { title: 'Pit Scout', url: 'pit' },
    { title: 'Match Scout', url: 'match' },
    { title: 'Team List', url: 'teamlist' },
    { title: 'Match Schedule', url: 'schedule' },
    { title: 'Settings', url: 'settings' },
  ];

  constructor(private backend: BackendService) {}

  public toggleSidebar() {
    this.opened = !this.opened;
  }

  public getUser() {
    return this.backend.getUser();
  }

}
