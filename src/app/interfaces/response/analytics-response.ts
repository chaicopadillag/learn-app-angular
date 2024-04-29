export interface AnalyticsResponseI {
  popularCourses: PopularCourse[];
  popularStudents: PopularStudent[];
  totals: Totals;
}

interface PopularCourse {
  id: string;
  name: string;
  type: string;
  students_count: number;
}

interface PopularStudent {
  id: string;
  name: string;
  lastname: string;
  email: string;
  email_verified_at: Date;
  age: number;
  id_card: string;
  role: string;
  status: number;
  created_at: Date;
  updated_at: Date;
  courses_count: number;
}

interface Totals {
  totalCurses: number;
  totalStudents: number;
}
