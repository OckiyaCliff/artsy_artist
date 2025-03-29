import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface FavoritesResponse {
  favorites: any[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = environment.apiUrl || '/api';
  private favoritesSubject = new BehaviorSubject<string[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load favorites on service initialization
    this.loadFavorites();
  }

  // Get user's favorites from the server
  loadFavorites(): void {
    this.http.get<FavoritesResponse>(`${this.apiUrl}/favorites`, { withCredentials: true })
      .subscribe({
        next: (response) => {
          const favoriteIds = response.favorites?.map(artist => artist.id) || [];
          this.favoritesSubject.next(favoriteIds);
        },
        error: () => {
          // If error (e.g., not authenticated), set empty array
          this.favoritesSubject.next([]);
        }
      });
  }

  // Get detailed information about favorite artists
  getFavorites(): Observable<FavoritesResponse> {
    return this.http.get<FavoritesResponse>(`${this.apiUrl}/favorites`, { withCredentials: true })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Add an artist to favorites
  addToFavorites(artistId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/favorites/add?artistId=${encodeURIComponent(artistId)}`, { withCredentials: true })
      .pipe(
        tap(() => {
          // Update the local favorites array
          const currentFavorites = this.favoritesSubject.value;
          if (!currentFavorites.includes(artistId)) {
            this.favoritesSubject.next([...currentFavorites, artistId]);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Remove an artist from favorites
  removeFromFavorites(artistId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/favorites/remove?artistId=${encodeURIComponent(artistId)}`, { withCredentials: true })
      .pipe(
        tap(() => {
          // Update the local favorites array
          const currentFavorites = this.favoritesSubject.value;
          this.favoritesSubject.next(currentFavorites.filter(id => id !== artistId));
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Check if an artist is in favorites
  isFavorite(artistId: string): boolean {
    return this.favoritesSubject.value.includes(artistId);
  }
}
