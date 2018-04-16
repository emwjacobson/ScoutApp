import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../services/backend.service';
import { User } from '@firebase/auth-types';
import { switchMap } from 'rxjs/operators';
import { QuerySnapshot, Query } from '@firebase/firestore-types';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private backend: BackendService) {}

  private check() {
    return this.backend.getCurrentUserData().switchMap((query) => {
      if (!query) {
        return Observable.of(false);
      }
      // This throws an error when a user logs out, as the currentUserUpdate triggers, causing query.onSnapshot to be called,
      // and an unauthenticated user doesnt have permission to query.
      query.onSnapshot((snap) => {
        if (!(snap.docs) || snap.empty) {
          return Observable.of(false);
        }
        return Observable.of(true);
      }, (error) => {
        console.log('Auth Userdata Query Error:');
        console.log(error);
        return Observable.of(false);
      });
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }
}
