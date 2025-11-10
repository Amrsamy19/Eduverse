import { Injectable } from '@angular/core';
import { ICourse } from '../Interfaces/icourse';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import ResponseEntity from '../Interfaces/ResponseEntity';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://eduverse-backend-blush.vercel.app/api/courses';

  private courseSubject = new BehaviorSubject<ICourse>({
    _id: '',
    courseName: '',
    description: '',
    courseCover: '',
    price: 0,
    rate: 0,
    hours: 0,
    category: '',
    targetAudience: '',
    outline: [],
    conclusion: [],
  });
  course$ = this.courseSubject.asObservable();

  private coursesSubject = new BehaviorSubject<ICourse[]>([]);
  courses$ = this.coursesSubject.asObservable();

  getCourses() {
    this.http.get<ResponseEntity>(this.apiUrl).subscribe({
      next: (response): void => this.coursesSubject.next(response.data),
      error: (err): void => console.error('Error fetching courses:', err),
    });
  }

  addCourse(course: ICourse) {
    this.http.post<ResponseEntity>(this.apiUrl, course).subscribe({
      next: (response): void => {
        const current = this.coursesSubject.value;
        this.coursesSubject.next([...current, response.data]);
      },
      error: (err): void => console.error('Error adding course:', err),
    });
  }

  deleteCourse(_id: string) {
    this.http.delete(`${this.apiUrl}/${_id}`).subscribe({
      next: (): void => {
        const updated = this.coursesSubject.value.filter((c) => c._id !== _id);
        this.coursesSubject.next([...updated]);
      },
      error: (err): void => console.error('Error deleting course:', err),
    });
  }

  updateCourse(course: ICourse) {
    this.http.put<ResponseEntity>(`${this.apiUrl}/${course._id}`, course).subscribe({
      next: (response): void => {
        const updatedCourses = this.coursesSubject.value.map((c) =>
          c._id === response.data._id ? response.data : c
        );
        this.coursesSubject.next(updatedCourses);
      },
      error: (err): void => console.error('Error updating course:', err),
    });
  }

  getCourseById(_id: string) {
    this.http.get<ResponseEntity>(`${this.apiUrl}/${_id}`).subscribe({
      next: (response): void => this.courseSubject.next(response.data),
      error: (err): void => console.error('Error fetching course by ID', err),
    });
  }
}
