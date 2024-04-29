import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChalkboardTeacher,
  faPersonShelter,
  faUserGraduate,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { AnalyticsService } from '@services/analytics.service';
import { CardStatsComponent } from '../../components/card-stats/card-stats.component';

@Component({
  selector: 'app-analitycs',
  standalone: true,
  imports: [FontAwesomeModule, CardStatsComponent],
  templateUrl: './analitycs.component.html',
  styleUrl: './analitycs.component.css',
})
export default class AnalitycsComponent implements OnInit {
  iconUser = faUserGraduate;
  iconChalboard = faChalkboardTeacher;
  iconTeacher = faPersonShelter;
  iconUsers = faUsers;

  private analytics = inject(AnalyticsService);

  ngOnInit(): void {
    this.analytics.getAnalytics().subscribe();
  }

  get popularCourses() {
    return this.analytics.data?.popularCourses;
  }

  get popularStudents() {
    return this.analytics.data?.popularStudents;
  }

  get totals() {
    return this.analytics.data?.totals;
  }
}
