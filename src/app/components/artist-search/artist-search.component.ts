import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtsyService } from '../../services/artsy.service';
import { ArtistCardComponent } from '../artist-card/artist-card.component';
import { ArtistDetailsComponent } from '../artist-details/artist-details.component';

@Component({
  selector: 'app-artist-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ArtistCardComponent, ArtistDetailsComponent],
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.scss']
})
export class ArtistSearchComponent implements OnInit {
  searchQuery: string = '';
  artists: any[] = [];
  selectedArtist: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(private artsyService: ArtsyService) {}

  ngOnInit(): void {
    // Initialize component
  }

  searchArtists(): void {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a search term';
      return;
    }

    this.error = '';
    this.loading = true;
    this.artists = [];
    this.selectedArtist = null;

    this.artsyService.searchArtists(this.searchQuery)
      .subscribe({
        next: (response) => {
          // Handle the updated API response format
          if (response && response._embedded) {
            this.artists = response._embedded.results.filter((result: any) => result.type === 'Artist');
          } else {
            this.artists = [];
          }
          
          this.loading = false;
          if (this.artists.length === 0) {
            this.error = 'No artists found matching your search criteria';
          }
        },
        error: (err) => {
          console.error('Error searching artists:', err);
          this.error = 'Error searching for artists. Please try again.';
          this.loading = false;
        }
      });
  }

  selectArtist(artist: any): void {
    this.selectedArtist = artist;
  }
}
