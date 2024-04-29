export interface CourseReqI {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: string;
  teacherId: string;
  schedules: Schedule[];
}

export interface Schedule {
  dayWeek: string;
  startTime: string;
  endTime: string;
}
