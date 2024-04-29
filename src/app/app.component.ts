import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private authService = inject(AuthService);

  private router = inject(Router);

  isUserAuthenticated = computed<boolean>(() => {
    if (this.authService.authStatus() === 'verifying') {
      return false;
    }
    return true;
  });

  private changeAuthStatus = effect(() => {
    switch (this.authService.authStatus()) {
      case 'verifying':
        break;
      case 'authenticated':
        this.router.navigateByUrl('/dashboard');
        break;
      case 'unauthenticated':
        this.router.navigateByUrl('auth/login');
        break;
      default:
        break;
    }
  });
}
