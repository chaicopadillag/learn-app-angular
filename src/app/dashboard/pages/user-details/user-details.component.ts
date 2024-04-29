import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@services/ui/modal.service';
import { UsersService } from '@services/users.service';
import { switchMap } from 'rxjs';
import { UserAssignCoursesComponent } from '../../components/user-assign-courses/user-assign-courses.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, UserAssignCoursesComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export default class UserDetailsComponent implements OnInit {
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private modalService = inject(ModalService);

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(({ id }) => this.usersService.getUserById(id)))
      .subscribe();
  }

  get user() {
    return this.usersService.user();
  }

  openModel() {
    this.modalService.openModal();
  }
}
