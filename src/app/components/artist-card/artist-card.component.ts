import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent {
  @Input() artist: any;
  
  // Get artist image or use a placeholder
  getArtistImage(): string {
    if (this.artist && this.artist._links && this.artist._links.thumbnail) {
      return this.artist._links.thumbnail.href;
    } else if (this.artist && this.artist.imageUrl) {
      return this.artist.imageUrl;
    }
    return 'assets/placeholder-artist.jpg';
  }
  
  // Get artist name
  getArtistName(): string {
    return this.artist?.name || this.artist?.title || 'Unknown Artist';
  }
  
  // Get artist ID
  getArtistId(): string {
    if (this.artist && this.artist.id) {
      return this.artist.id;
    } else if (this.artist && this.artist._links && this.artist._links.self) {
      // Extract ID from the self link
      const selfLink = this.artist._links.self.href;
      const parts = selfLink.split('/');
      return parts[parts.length - 1];
    }
    return '';
  }
}
