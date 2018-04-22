import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../services/backend.service';
import { User } from '@firebase/auth-types';
import { switchMap } from 'rxjs/operators';
import { QuerySnapshot, Query } from '@firebase/firestore-types';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private backend: BackendService) {}

  private check() {
    return this.backend.getUser().switchMap((user: User) => {
      if (!user) {
        this.router.navigate(['']);
        return Observable.of(false);
      }
      return Observable.of(true);
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }
}
