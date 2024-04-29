import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoleType } from '@interfaces/response/users-response';
import { UsersService } from '@services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export default class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  role: RoleType = 'student';

  onchangeRole(event: any) {
    this.usersService.getUsers(1, 10, this.role).subscribe();
  }

  get users() {
    return this.usersService.users();
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe({
      next: ({ message }) => {
        Swal.fire('Muy bien!', message, 'success');
      },
      error: (message) => {
        Swal.fire('Ups!', message, 'error');
      },
    });
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe();
  }
}
