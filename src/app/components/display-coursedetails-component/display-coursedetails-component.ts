import { Component, signal, WritableSignal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WatchLaterService } from '../../services/watch-later-service';
import { CartService } from '../../services/cart-service';
import { ICourse } from '../../Interfaces/icourse';
import { CourseService } from '../../services/course-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-display-coursedetails-component',
  imports: [CommonModule, ReactiveFormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './display-coursedetails-component.html',
  styleUrl: './display-coursedetails-component.css',
})
export class DisplayCoursedetailsComponent implements OnInit {
  // toggle display button
  isCollapsed: boolean = true;
  isListCollapsed: boolean = true;

  toggleDescription() {
    this.isCollapsed = !this.isCollapsed;
  }
  toggleList() {
    this.isListCollapsed = !this.isListCollapsed;
  }

  // back button
  goBack(): void {
    this.location.back();
  }

  // add review and comment form
  reviewForm: FormGroup;
  // Keep the rating signal for visual state of stars only
  rating: WritableSignal<number> = signal(0);

  course!: Observable<ICourse>;

  cartItems = signal<ICourse[]>([]);

  watchLaterList = signal<ICourse[]>([]);

  constructor(
    private location: Location,
    private router: Router,
    private watchLater: WatchLaterService,
    private cartService: CartService,
    private courseService: CourseService
  ) {
    this.reviewForm = new FormGroup({
      name: new FormControl(''),
      rating: new FormControl(0, [Validators.required, Validators.min(1)]),
      comment: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    const courseId = this.router.url.split('/')[2];
    this.courseService.getCourseById(courseId);
    this.course = this.courseService.course$;
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems.set(items);
    });
    this.watchLater.watchLater$.subscribe((items) => {
      this.watchLaterList.set(items);
    });
  }
  isInCart(id: string): boolean {
    return this.cartItems().some((item) => item._id === id);
  }

  addToCart(course: ICourse): void {
    this.cartService.addToCart(course);
  }

  selectRating(newRating: number): void {
    this.rating.set(newRating);
    // Crucially, update the rating FormControl value
    this.reviewForm.controls['rating'].setValue(newRating);
    // Mark as touched to show validation error if rating is 0
    this.reviewForm.controls['rating'].markAsTouched();
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      console.error('Form is invalid. Please ensure all required fields are filled.');
      this.reviewForm.markAllAsTouched();
      return;
    }
    const formValue = this.reviewForm.value;

    const reviewData = {
      name: formValue.name?.trim() || 'Anonymous User',
      rating: formValue.rating,
      comment: formValue.comment,
      timestamp: new Date().toISOString(),
    };

    console.log('--- Review Submitted (Reactive Form) ---');
    console.log(reviewData);

    this.resetForm();
  }

  resetForm(): void {
    this.reviewForm.reset({
      name: '',
      rating: 0,
      comment: '',
    });
    this.rating.set(0);
  }

  handleWatchLater() {
    this.watchLater.toggleCourseToWatchLater(this.router.url.split('/')[2]);
  }

  isInWatchLater(id: string): boolean {
    return this.watchLaterList().some((item) => item._id === id);
  }
}
