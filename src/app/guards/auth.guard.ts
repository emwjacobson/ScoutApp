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
    // return this.backend.getUser().switchMap((user: User) => {
    //   if (user) {
    //     return Observable.of(true);
    //   } else {
    //     this.router.navigate(['login']);
    //     return Observable.of(false);
    //   }
    // });
    if (this.backend.getUser()) {
      return true;
    }
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }
}
