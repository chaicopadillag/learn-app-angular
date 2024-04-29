export interface CoursesResponseI {
  data: CourseI[];
  links: Links;
  meta: Meta;
}

export interface CourseI {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: Type;
  teacher: Teacher;
  schedules: Schedule[];
}

export interface Schedule {
  id: string;
  day_week: string;
  start_time: string;
  end_time: string;
  course_id: string;
}

export interface Teacher {
  id: string;
  name: Name;
  lastname: Lastname;
}

export enum Lastname {
  Breitenberg = 'Breitenberg',
  Huels = 'Huels',
  Robel = 'Robel',
}

export enum Name {
  ChadKulasSr = 'Chad Kulas Sr.',
  JesusMayert = 'Jesus Mayert',
  MrsMafaldaSchuppeSr = 'Mrs. Mafalda Schuppe Sr.',
}

export enum Type {
  InPerson = 'in_person',
  Virtual = 'virtual',
}

export interface Links {
  first: string;
  last: string;
  prev: null;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: null | string;
  label: string;
  active: boolean;
}

// Course by ID
export interface CourseResponseI {
  data: CourseI;
}
