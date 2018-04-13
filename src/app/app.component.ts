import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'app';
  public opened = false;
  public pages = [
    { title: 'Home', url: '' },
    { title: 'Test', url: 'test' }
  ];

  public toggleSidebar() {
    this.opened = !this.opened;
  }

}
