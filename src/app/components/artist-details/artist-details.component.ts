import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtsyService } from '../../services/artsy.service';
import { ArtworkCardComponent } from '../artwork-card/artwork-card.component';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, ArtworkCardComponent],
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.scss']
})
export class ArtistDetailsComponent implements OnChanges {
  @Input() artist: any;
  
  artistDetails: any = null;
  artworks: any[] = [];
  loading: boolean = false;
  activeTab: string = 'info';
  error: string = '';
  
  constructor(private artsyService: ArtsyService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artist'] && this.artist) {
      this.loadArtistDetails();
    }
  }
  
  loadArtistDetails(): void {
    if (!this.artist || !this.artist._links || !this.artist._links.self) {
      return;
    }
    
    const artistId = this.extractArtistId(this.artist._links.self.href);
    if (!artistId) {
      this.error = 'Could not load artist details';
      return;
    }
    
    this.loading = true;
    this.artistDetails = null;
    this.artworks = [];
    
    // Load artist details
    this.artsyService.getArtistDetails(artistId)
      .subscribe({
        next: (details) => {
          this.artistDetails = details;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading artist details:', err);
          this.error = 'Failed to load artist details';
          this.loading = false;
        }
      });
      
    // Load artist artworks
    this.artsyService.getArtistArtworks(artistId)
      .subscribe({
        next: (response) => {
          this.artworks = response._embedded?.artworks || [];
        },
        error: (err) => {
          console.error('Error loading artworks:', err);
        }
      });
  }
  
  switchTab(tab: string): void {
    this.activeTab = tab;
  }
  
  private extractArtistId(url: string): string | null {
    const parts = url.split('/');
    return parts[parts.length - 1] || null;
  }
}
