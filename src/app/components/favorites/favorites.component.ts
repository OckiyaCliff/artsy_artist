import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

interface FavoritesResponse {
  favorites: any[];
  message?: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.favoritesService.getFavorites().subscribe({
      next: (response: FavoritesResponse) => {
        this.favorites = response.favorites || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Failed to load favorites. Please try again.';
        this.isLoading = false;
        
        // Redirect to login if not authenticated
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  removeFromFavorites(artistId: string): void {
    this.favoritesService.removeFromFavorites(artistId).subscribe({
      next: () => {
        // Remove the artist from the local array
        this.favorites = this.favorites.filter(artist => artist.id !== artistId);
      },
      error: (error: any) => {
        this.errorMessage = error.error?.error || 'Failed to remove artist from favorites. Please try again.';
      }
    });
  }
}
