import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  showDeleteModal: boolean = false;
  isDeleting: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response.user;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to load profile. Please try again.';
        this.isLoading = false;
        // Redirect to login if not authenticated
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to logout. Please try again.';
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteAccount(): void {
    this.isDeleting = true;
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isDeleting = false;
        this.errorMessage = error.error?.error || 'Failed to delete account. Please try again.';
      }
    });
  }
}
