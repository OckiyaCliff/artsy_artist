import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtsyService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Search for artists
  searchArtists(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artists/search`, {
      params: { query }
    });
  }

  // Get artist details
  getArtistDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artists/${id}`);
  }

  // Get artist artworks
  getArtistArtworks(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artists/${id}/artworks`);
  }

  // Get artwork details
  getArtworkDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artworks/${id}`);
  }

  // Get artwork categories
  getArtworkCategories(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artworks/${id}/categories`);
  }
}
