import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface User {
  id: string;
  username: string;
  email: string;
  gravatarUrl: string;
  favorites: string[];
}

interface AuthResponse {
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl || '/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already authenticated on service initialization
    this.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUserSubject.next(response.user);
      },
      error: () => {
        // User is not authenticated, do nothing
      }
    });
  }

  // Get current user value without subscribing
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is authenticated
  public get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Register a new user
  register(fullname: string, email: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/register?fullname=${encodeURIComponent(fullname)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Login user
  login(email: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Logout user
  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.user) {
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  // Delete user account
  deleteAccount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/delete`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }
}
