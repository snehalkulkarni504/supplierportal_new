import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('mst_user_id'); // Example check for authentication
    if (!isAuthenticated) {
      this.router.navigate(['/']); // Redirect to login if not authenticated
      return false;
    }
    return true; // Allow access if authenticated
  }
}