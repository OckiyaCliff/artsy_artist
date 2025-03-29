import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

// Create a simple auth guard inline since we're having import issues
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}

const routes: Routes = [
  { path: '', component: ArtistSearchComponent },
  { path: 'artists/:id', component: ArtistDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
