import { Injectable } from '@angular/core';
import { AuthService } from '../../components/services/auth/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): boolean {
    const blockedPaths = ["catalogue", "create", "edit", "logout", "details", "mail", "cart"];
    const pathCheck = blockedPaths.some(el => state.url.includes(el));
    
    if (pathCheck && !this.authService.isLogged) {
      this.router.navigate(["/login"]);
    };
    
    return true;
  };
};