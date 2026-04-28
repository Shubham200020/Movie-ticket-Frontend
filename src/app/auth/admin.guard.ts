import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the role from localStorage via AuthService
  const role = authService.getRole()?.toLowerCase();

  // If the user is an admin, allow access
  if (role === 'admin') {
    return true;
  }

  // If not admin, redirect to home page and deny access
  router.navigate(['/']);
  return false;
};
