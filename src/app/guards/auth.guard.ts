import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, CanLoad } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BackendService } from '../services/backend.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private backend: BackendService) {}

  private check() {
    return this.backend.getUser() ? true : false;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canActivate Called');
    return this.check();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log('canLoad Called');
    return this.check();
  }
}
