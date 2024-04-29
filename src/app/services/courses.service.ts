import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { CourseReqI } from '@interfaces/request/course-request';
import {
  CourseI,
  CourseResponseI,
  CoursesResponseI,
} from '@interfaces/response/courses-response';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { ENV } from '../env';
import { httpHeaders } from './http-headers';
interface CourseState {
  courses: CourseI[];
  course: CourseI | null;
}

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private httpClient = inject(HttpClient);

  #state = signal<CourseState>({
    courses: [],
    course: null,
  });

  courses = computed(() => this.#state().courses);
  course = computed(() => this.#state().course);

  clearCourseActive() {
    this.#state.update((prev) => ({ ...prev, course: null }));
  }

  getCourses(page = 1, perPage = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    const config = {
      headers: httpHeaders(),
      params,
    };

    return this.httpClient
      .get<CoursesResponseI>(`${ENV.API_HOST_URL}/courses`, config)
      .pipe(
        map(({ data }) =>
          this.#state.update((prev) => ({ ...prev, courses: data }))
        )
      );
  }

  getCourseById(id: string) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .get<CourseResponseI>(`${ENV.API_HOST_URL}/courses/${id}`, config)
      .pipe(
        map(({ data }) =>
          this.#state.update((prev) => ({ ...prev, course: data }))
        )
      );
  }

  saveCourse(body: CourseReqI) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .post<CourseResponseI>(`${ENV.API_HOST_URL}/courses`, body, config)
      .pipe(
        map(({ data }) => {
          this.#state.update((prev) => ({ ...prev, course: data }));
        }),
        map(() => ({ message: 'Curso registrado correctamente' })),
        catchError(() => throwError(() => 'No se pudo registrar el curso'))
      );
  }

  updateCourse(id: string, body: CourseReqI) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .put<CourseResponseI>(`${ENV.API_HOST_URL}/courses/${id}`, body, config)
      .pipe(
        map(({ data }) => {
          this.#state.update((prev) => ({ ...prev, course: data }));
        }),
        map(() => ({ message: 'Curso actulizado correctamente' })),
        catchError(() => throwError(() => 'No se pudo actualizar el curso'))
      );
  }

  deleteCourse(id: string) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .delete(`${ENV.API_HOST_URL}/courses/${id}`, config)
      .pipe(
        switchMap(() => this.getCourses()),
        map(() => ({ message: 'Curso eliminado correctamente' })),
        catchError(() => throwError(() => 'Error al eliminar curso'))
      );
  }
}
