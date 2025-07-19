export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  courses: Array<{
    name: string;
    grade: string;
    percentage: number;
    credits: number;
    teacher: string;
  }>;
  attendance: number;
  totalCredits: number;
  gpa: number;
  comments: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  teacher: string;
  students: number;
  credits: number;
  status: string;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  department: string;
  courses: number;
  status: string;
}

export interface Classroom {
  id: number;
  name: string;
  building: string;
  capacity: number;
  equipment: string;
  status: string;
}

export interface Note {
  id: number;
  title: string;
  course: string;
  author: string;
  date: string;
  type: string;
  status: string;
}
