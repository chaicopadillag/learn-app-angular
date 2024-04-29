import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoursesService } from '@services/courses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export default class CoursesComponent implements OnInit {
  private coursesService = inject(CoursesService);

  get courses() {
    return this.coursesService.courses();
  }

  ngOnInit(): void {
    this.coursesService.getCourses().subscribe();
  }

  deleteCourse(id: string) {
    this.coursesService.deleteCourse(id).subscribe({
      next: ({ message }) => {
        Swal.fire('Muy bien!', message, 'success');
      },
      error: (message) => {
        Swal.fire('Ups!', message, 'error');
      },
    });
  }
}
