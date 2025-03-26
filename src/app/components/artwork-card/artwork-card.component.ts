import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artwork-card.component.html',
  styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent {
  @Input() artwork: any;
  
  // Get artwork image or use a placeholder
  getArtworkImage(): string {
    if (this.artwork && this.artwork._links && this.artwork._links.thumbnail) {
      return this.artwork._links.thumbnail.href;
    }
    return 'assets/placeholder-artwork.jpg';
  }
  
  // Get artwork title
  getArtworkTitle(): string {
    return this.artwork?.title || 'Untitled';
  }
  
  // Get artwork date
  getArtworkDate(): string {
    return this.artwork?.date || 'Unknown date';
  }
  
  // Get artwork medium
  getArtworkMedium(): string {
    return this.artwork?.medium || 'Unknown medium';
  }
}
