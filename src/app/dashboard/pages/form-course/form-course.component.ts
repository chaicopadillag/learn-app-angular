import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { listDaysWeek } from '@common/constants/days-week';
import { CoursesService } from '@services/courses.service';
import { UsersService } from '@services/users.service';
import { filter, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-course.component.html',
  styleUrl: './form-course.component.css',
})
export default class FormCourseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private usersService = inject(UsersService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  public listDaysWeek = listDaysWeek;

  isPosting = false;

  constructor() {
    this.usersService.getUsers(1, 100, 'teacher').subscribe();
  }

  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    description: ['', [Validators.maxLength(255)]],
    teacherId: ['', [Validators.required]],
    type: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    schedules: this.fb.array([], Validators.required),
  });

  get schedules() {
    return this.form.get('schedules') as FormArray;
  }

  get course() {
    return this.coursesService.course();
  }
  get teachers() {
    return this.usersService.users();
  }

  get titleForm() {
    return this.course?.id ? 'Actualizando Curso' : 'Creando curso';
  }

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(
        filter(({ id }) => {
          if (!id) {
            this.addSchedule();
            this.coursesService.clearCourseActive();
          }
          return !!id;
        }),
        switchMap(({ id }) => this.coursesService.getCourseById(id))
      )
      .subscribe({
        next: () => this.setCourseEdit(),
        error: (err) => {
          console.log(err);
        },
      });
  }

  setCourseEdit() {
    const editCourse: any = {
      name: this.course?.name,
      description: this.course?.description ?? '',
      teacherId: this.course?.teacher.id,
      type: this.course?.type,
      startDate: this.course?.startDate,
      endDate: this.course?.endDate,
    };

    this.form.patchValue(editCourse);
    this.course?.schedules.forEach((co) => {
      this.schedules.push(
        this.fb.group({
          dayWeek: [co.day_week, Validators.required],
          startTime: [this.formatTime(co.start_time), Validators.required],
          endTime: [this.formatTime(co.end_time), Validators.required],
        })
      );
    });
  }

  formatTime(times: string) {
    const [hours, minutes] = times.split(':');
    return `${hours}:${minutes}`;
  }

  addSchedule(): void {
    this.schedules.push(
      this.fb.group({
        dayWeek: [listDaysWeek[0].key, [Validators.required]],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
      })
    );
  }

  removeSchedule(index: number): void {
    this.schedules.removeAt(index);
  }

  isValid(field: string) {
    return (
      this.form.get(field)?.errors &&
      this.form.controls[field as 'name'].touched
    );
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].status === 'INVALID' &&
      formArray.controls[index].touched
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isPosting) return;

    this.isPosting = true;

    if (this.course?.id) {
      this.updateCourse();
    } else {
      this.createCourse();
    }
  }

  createCourse() {
    this.coursesService.saveCourse(this.form.value as any).subscribe({
      next: ({ message }) => {
        Swal.fire('Bien!', message, 'success');
        this.form.reset();
        this.isPosting = false;
        this.router.navigateByUrl(`/dashboard/courses/${this.course?.id}/show`);
      },
      error: (error) => {
        this.isPosting = false;
        Swal.fire('Upz!', error, 'error');
      },
    });
  }

  updateCourse() {
    this.coursesService
      .updateCourse(this.course?.id!, this.form.value as any)
      .subscribe({
        next: ({ message }) => {
          Swal.fire('Bien!', message, 'success');
          this.isPosting = false;
          this.router.navigateByUrl(
            `/dashboard/courses/${this.course?.id}/show`
          );
        },
        error: (error) => {
          this.isPosting = false;
          Swal.fire('Upz!', error, 'error');
        },
      });
  }

  getError(field: string) {
    const errors = this.form.get(field)?.errors;
    if (errors) {
      if (errors.required) {
        return 'Este campo es requerido.';
      }
      if (errors.minlength) {
        return `Debe tener al menos ${errors.minlength.requiredLength} caracteres.`;
      }
      if (errors.maxlength) {
        return `No debe exceder los ${errors.maxlength.requiredLength} caracteres.`;
      }
      if (errors.min) {
        return `Debe ser mayor o igual a ${errors.min.min}.`;
      }
      if (errors.max) {
        return `Debe ser menor o igual a ${errors.max.max}.`;
      }
    }
    return '';
  }
}
