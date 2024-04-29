export interface UsersResponseI {
  data: UserI[];
  links: Links;
  meta: Meta;
}

export interface UserResponseI {
  data: UserI;
}

export interface Course {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  type: string;
}

export interface UserI {
  id: string;
  name: string;
  email: string;
  lastName: string;
  age: number;
  role: RoleType;
  idCard: string;
  courses: Course[];
  lessons: Course[];
}

export type RoleType = 'admin' | 'teacher' | 'student';

interface Links {
  first: string;
  last: string;
  prev: null;
  next: string;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Link {
  url: null | string;
  label: string;
  active: boolean;
}
