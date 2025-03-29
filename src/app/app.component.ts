import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'artsy-app';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
