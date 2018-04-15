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
  public admin_pages = [
    { title: 'Admin Settings', url: 'admin' },
  ];
  public user_data = {};

  constructor(private backend: BackendService) {
    this.getUserData();
  }

  public toggleSidebar(): void {
    this.opened = !this.opened;
  }

  public getUser(): Observable<User> {
    return this.backend.getUser();
  }

  public getUserData(): void {
    this.backend.getCurrentUserData().subscribe((query) => {
      if (!query) {
        this.user_data = {};
        return;
      }
      query.onSnapshot((snap) => {
        if (snap.docs.length === 0) {
          this.user_data = {};
        }
        this.user_data = snap.docs[0].data();
      });
    });
  }

}
