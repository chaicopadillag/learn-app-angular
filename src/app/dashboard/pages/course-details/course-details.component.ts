import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { daysWeek } from '@common/constants/days-week';
import { CoursesService } from '@services/courses.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})
export default class CourseDetailsComponent {
  private coursesService = inject(CoursesService);
  private route = inject(ActivatedRoute);

  public getDayOfWeek = (key: string) => daysWeek[key];

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(({ id }) => this.coursesService.getCourseById(id)))
      .subscribe({
        error: (err) => {
          console.log(err);
        },
      });
  }

  get course() {
    return this.coursesService.course();
  }
}
