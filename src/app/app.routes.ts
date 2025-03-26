import { Routes } from '@angular/router';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';

export const routes: Routes = [
  { path: '', component: ArtistSearchComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
