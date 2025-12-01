import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Permission } from './auth.interface';

export const isAdmin: CanActivateFn = async (
  _next: ActivatedRouteSnapshot,
  _: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isAuthenticated() && authService.hasPermission(Permission.Admin)) {
    // Allow access if user has admin permission.
    return true;
  } else {
    // Redirect to home page if not authenticated
    router.navigate(['/home']);
    return false;
  }
};
