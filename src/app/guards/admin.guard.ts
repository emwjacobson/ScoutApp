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
    return this.backend.getUser().switchMap((user: User) => {
      return this.backend.isUserAdmin(user.uid).then((isAdmin: boolean) => {
        if (!user || !isAdmin) {
          this.router.navigate(['']);
          return false;
        }
        return true;
      });
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.check();
  }
}
