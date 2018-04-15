import { Component } from '@angular/core';
import { BackendService } from './services/backend.service';
import { Observable } from 'rxjs/Observable';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  public title = 'app';
  public opened = true;
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
  public admin_pages = [
    { title: 'Admin Settings', url: 'admin' },
  ];
  public user_claims = {};

  constructor(private backend: BackendService) {
    this.getUserClaims();
  }

  public toggleSidebar(): void {
    this.opened = !this.opened;
  }

  public getUser(): Observable<User> {
    return this.backend.getUser();
  }

  public getUserClaims(): void {
    this.backend.getUserClaims().subscribe((claims) => {
      this.user_claims = claims;
    });
  }

}
