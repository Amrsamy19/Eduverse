import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICourse } from '../Interfaces/icourse';
import { HttpClient } from '@angular/common/http';
import ResponseEntity from '../Interfaces/ResponseEntity';
import IUser from '../Interfaces/IUser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://eduverse-backend-blush.vercel.app/api/users/cart';
  private apiPurchaseUrl = 'https://eduverse-backend-blush.vercel.app/api/payment/check-out';
  private cartItems = new BehaviorSubject<ICourse[]>([]);
  cartItems$ = this.cartItems.asObservable();

  addToCart(course: ICourse) {
    this.http
      .patch<ResponseEntity>(
        this.apiUrl,
        { courseId: course._id },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('userToken')}`,
          },
        }
      )
      .subscribe({
        next: (response): void => {
          this.cartItems.next(response.data.cart);
        },
        error: (err): void => console.error('Error adding course to cart', err),
      });
  }

  getCartItems() {
    this.http
      .get<ResponseEntity>(
        `${this.apiUrl}/${JSON.parse(localStorage.getItem('userData') || '{}').userId}`,
        {
          headers: { Authorization: `${localStorage.getItem('userToken')}` },
        }
      )
      .subscribe({
        next: (response): void => this.cartItems.next(response.data),
        error: (err): void => console.error('Error fetching cart items', err),
      });
  }

  purchaseCart() {
    this.http
      .post<ResponseEntity>(
        this.apiPurchaseUrl,
        { coursesIds: this.cartItems.getValue().map((course) => course._id) },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('userToken')}`,
          },
        }
      )
      .subscribe({
        next: (response): void => {
          window.location.href = response.data;
          this.cartItems.next([]);
        },
        error: (err): void => console.error('Error purchasing cart', err),
      });
  }

  removeFromCart(courseId: string) {
    this.http
      .patch<ResponseEntity>(
        this.apiUrl,
        { courseId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${localStorage.getItem('userToken')}`,
          },
        }
      )
      .subscribe({
        next: (response): void => {
          this.cartItems.next(response.data.cart);
        },
        error: (err): void => console.error('Error removing course from cart', err),
      });
  }
}
