import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '@services/courses.service';
import { ModalService } from '@services/ui/modal.service';
import { UsersService } from '@services/users.service';
import Swal from 'sweetalert2';

type CheckboxItem = {
  id: string;
  name: string;
  selected: boolean;
};

@Component({
  selector: 'app-user-assign-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-assign-courses.component.html',
  styleUrl: './user-assign-courses.component.css',
})
export class UserAssignCoursesComponent implements OnInit {
  private modalService = inject(ModalService);
  private userService = inject(UsersService);
  private courseService = inject(CoursesService);

  checkboxItems: CheckboxItem[] = [];

  ngOnInit(): void {
    this.courseService.getCourses(1, 100).subscribe({
      next: () => {
        this.addCoursesCheckboxs();
      },
    });
  }

  onSubmit() {
    const itemSelects = this.getSelectItems();

    if (itemSelects.length <= 0) {
      Swal.fire('Learn App', 'Seleccione un curso al menos', 'warning');
      return;
    }

    if (!this.user?.id) {
      Swal.fire('Learn App', 'No hay usuario seleccionado', 'warning');
      return;
    }

    if (this.user.role !== 'student') {
      Swal.fire('Learn App', 'El usuario no es un estudiante', 'warning');
      return;
    }

    this.userService.assignCourseStudent(this.user?.id, itemSelects).subscribe({
      next: ({ message }) => {
        Swal.fire('Learn App', message, 'success');
        this.closeModal();
        this.addCoursesCheckboxs();
      },
      error: (error) => {
        Swal.fire('Learn App', error, 'error');
      },
    });
  }

  addCoursesCheckboxs() {
    this.checkboxItems = this.courses.map(({ id, name }) => ({
      id,
      name,
      selected: this.userCourses.some((cour) => cour.id === id),
    }));
  }

  getSelectItems() {
    return this.checkboxItems
      .filter((item) => item.selected)
      .map((item) => item.id);
  }

  get courses() {
    return this.courseService.courses();
  }

  closeModal() {
    this.modalService.closeModal();
  }

  get user() {
    return this.userService.user();
  }

  get userCourses() {
    return this.userService.user()?.courses || [];
  }

  get fullNameUser() {
    return `${this.userService.user()?.name} ${
      this.userService.user()?.lastName
    }`;
  }

  get showModal() {
    return this.modalService.showModal;
  }
}
