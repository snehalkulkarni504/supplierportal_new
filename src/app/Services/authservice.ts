import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  token = null;
  isAuthenticated: boolean = false;
  private userRoles: string[] = [];
  private userSubject = new Subject<string>();
  user$ = this.userSubject.asObservable();

  constructor(private httpClient: HttpClient,
    private router: Router) {}

  logout(): void {
    localStorage.clear();
    this.isAuthenticated = false;
    this.router.navigate(['/']);
    //this.userRoles = [];
  }
}
