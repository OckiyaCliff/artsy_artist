import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { ArtistSearchComponent } from './components/artist-search/artist-search.component';
import { ArtistDetailsComponent } from './components/artist-details/artist-details.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';
import { ArtworkCardComponent } from './components/artwork-card/artwork-card.component';
import { ArtworkCategoriesComponent } from './components/artwork-categories/artwork-categories.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

// Services
import { AuthService } from './services/auth.service';
import { FavoritesService } from './services/favorites.service';

@NgModule({
  declarations: [
    AppComponent,
    ArtistSearchComponent,
    ArtistDetailsComponent,
    ArtistCardComponent,
    ArtworkCardComponent,
    ArtworkCategoriesComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule
  ],
  providers: [
    AuthService,
    FavoritesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
