import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BackendService } from '../../services/backend.service';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs/observable';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggle: EventEmitter<any> = new EventEmitter();
  public name = environment.name;

  constructor(private router: Router, private backend: BackendService) { }

  ngOnInit() {
  }

  public toggleSidebar(): void {
    this.sidebarToggle.emit(null);
  }

  public logout(): void {
    this.backend.logout();
    this.router.navigate(['']);
  }

  public getUser(): Observable<User> {
    return this.backend.getUser();
  }

}
