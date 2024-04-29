import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChalkboardTeacher,
  faGraduationCap,
  faTableColumns,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarItemI } from '@interfaces/sidebar-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  logo = faGraduationCap;

  menutItems: SidebarItemI[] = [
    {
      path: '/dashboard',
      title: 'Dashboard',
      icon: faTableColumns,
    },
    {
      path: '/dashboard/users',
      title: 'Usuarios',
      icon: faUserGraduate,
    },

    {
      path: '/dashboard/courses',
      title: 'Cursos',
      icon: faChalkboardTeacher,
    },
  ];
}
