import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { UserReqI } from '@interfaces/request/user-request';
import {
  RoleType,
  UserI,
  UserResponseI,
  UsersResponseI,
} from '@interfaces/response/users-response';
import { catchError, map, switchMap, throwError } from 'rxjs';
import { ENV } from '../env';
import { httpHeaders } from './http-headers';
interface UserState {
  users: UserI[];
  user: UserI | null;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  #state = signal<UserState>({
    users: [],
    user: null,
  });

  users = computed(() => this.#state().users);
  user = computed(() => this.#state().user);

  getUsers(page = 1, perPage = 10, type: RoleType = 'student') {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString())
      .set('type', type);

    const config = {
      headers: httpHeaders(),
      params,
    };

    return this.httpClient
      .get<UsersResponseI>(`${ENV.API_HOST_URL}/users`, config)
      .pipe(
        map(({ data }) =>
          this.#state.update((prev) => ({ ...prev, users: data }))
        )
      );
  }

  getUserById(id: string) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .get<UserResponseI>(`${ENV.API_HOST_URL}/users/${id}`, config)
      .pipe(
        map(({ data }) =>
          this.#state.update((prev) => ({ ...prev, user: data }))
        )
      );
  }

  userRegister(body: UserReqI) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .post<UserResponseI>(`${ENV.API_HOST_URL}/users/`, body, config)
      .pipe(
        map(({ data }) =>
          this.#state.update((prev) => ({ ...prev, user: data }))
        ),
        map(() => ({ message: 'Usuarios registrado correctamente' })),
        catchError((error) => {
          console.log(error);
          return throwError(() => 'No se podido registrar al usuario');
        })
      );
  }

  updateUser(id: string, body: UserReqI) {
    const config = {
      headers: httpHeaders(),
    };
    const data = Object.fromEntries(
      Object.entries(body).filter(([key, value]) => value !== '')
    );
    return this.httpClient
      .patch(`${ENV.API_HOST_URL}/users/${id}`, data, config)
      .pipe(
        map(() => ({ message: 'Usuario actualizado correctamente' })),
        catchError(() => throwError(() => 'Error al actualizar usuario'))
      );
  }

  assignCourseStudent(userId: string, courses: string[]) {
    const config = {
      headers: httpHeaders(),
    };
    const data = {
      userId,
      courses,
    };

    return this.httpClient
      .post(`${ENV.API_HOST_URL}/student/assign-courses`, data, config)
      .pipe(
        switchMap(() => this.getUserById(userId)),
        map(() => ({ message: 'Datos actualizados correctamente' })),
        catchError(() => throwError(() => 'Error al actualizar datos'))
      );
  }

  deleteUser(id: string) {
    const config = {
      headers: httpHeaders(),
    };

    return this.httpClient
      .delete(`${ENV.API_HOST_URL}/users/${id}`, config)
      .pipe(
        map(() => ({ message: 'Usuario eliminado correctamente' })),
        catchError(() => throwError(() => 'Error al eliminar usuario'))
      );
  }
}
