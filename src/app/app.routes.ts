import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'auth/login',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login.component'),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component'),
    children: [
      {
        path: '',
        title: 'Dashboard',
        loadComponent: () =>
          import('./dashboard/pages/analitycs/analitycs.component'),
      },
      {
        path: 'users',
        title: 'Usuarios',
        loadComponent: () => import('./dashboard/pages/users/users.component'),
      },
      {
        path: 'users/:id/show',
        title: 'User Destails',
        loadComponent: () =>
          import('./dashboard/pages/user-details/user-details.component'),
      },
      {
        path: 'users/create',
        title: 'Crear Usuario',
        loadComponent: () =>
          import('./dashboard/pages/form-user/form-user.component'),
      },
      {
        path: 'users/:id',
        title: 'Update Usuario',
        loadComponent: () =>
          import('./dashboard/pages/form-user/form-user.component'),
      },
      {
        path: 'courses',
        title: 'Cursos',
        loadComponent: () =>
          import('./dashboard/pages/courses/courses.component'),
      },
      {
        path: 'courses/:id/show',
        title: 'Course Deatils',
        loadComponent: () =>
          import('./dashboard/pages/course-details/course-details.component'),
      },
      {
        path: 'courses/create',
        title: 'Crear Curso',
        loadComponent: () =>
          import('./dashboard/pages/form-course/form-course.component'),
      },
      {
        path: 'courses/:id',
        title: 'Course Deatils',
        loadComponent: () =>
          import('./dashboard/pages/form-course/form-course.component'),
      },
      {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
