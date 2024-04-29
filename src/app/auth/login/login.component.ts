import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.group({
    email: ['admin@dev.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  login() {
    if (this.form.invalid) {
      return;
    }

    const { email, password } = this.form.value;

    if (!email || !password) return;

    this.authService.login(email, password).subscribe({
      next: (result) => {
        if (result) {
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (message) => {
        Swal.fire('Ups!', message, 'error');
      },
    });
  }
}
