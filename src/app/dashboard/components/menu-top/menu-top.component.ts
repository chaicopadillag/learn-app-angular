import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-menu-top',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './menu-top.component.html',
  styles: `
  .avatar {
  width: 30px;
  height: 30px;
  background-color: #007bff;
  color: #fff;
  line-height: 30px;
  text-align: center;
  justify-content:center;
  align-items:center;
}

  `,
})
export class MenuTopComponent {
  logoutIcon = faRightToBracket;
  private authService = inject(AuthService);

  get authUser() {
    return this.authService.authState().authUser;
  }

  get userName() {
    return `${this.authUser?.name} ${this.authUser?.lastName}`;
  }

  get avatar() {
    return this.userName.charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
