import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal, OnInit, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserAuth } from '../../services/user-auth';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { ICourse } from '../../Interfaces/icourse';
import IUser from '../../Interfaces/IUser';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isProfileShown = signal(false);
  isCartShown = signal(false);
  isMenuOpen = false;
  userData!: IUser;
  isUserLoggedIn!: Observable<boolean>;
  cartItems!: Observable<ICourse[]>;
  constructor(
    private router: Router,
    private userAuth: UserAuth,
    private cartService: CartService
  ) {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  async goHome(event: MouseEvent) {
    event.preventDefault();

    const currentUrl = this.router.url.split('#')[0];

    if (currentUrl === '/home') {
      //  remove fragment from URL if found
      if (window.location.hash) {
        history.replaceState(null, '', '/home');
      }

      // scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      //if not on home, navigate to home
      await this.router.navigate(['/home']);
      // then scroll to top after a short delay to ensure the page has loaded
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  }

  toggleProfileMenu(): void {
    this.toggleGenericMenu(this.isProfileShown, this.isCartShown);
  }

  toggleCartMenu(): void {
    this.toggleGenericMenu(this.isCartShown, this.isProfileShown);
  }

  ngOnInit() {
    this.isUserLoggedIn = this.userAuth.authStatus$;
    this.cartItems = this.cartService.cartItems$;
    this.cartService.getCartItems();
    this.userData = JSON.parse(localStorage.getItem('userData') || '{}');
  }

  getCartTotal(): number {
    let total = 0;
    this.cartItems.subscribe((items) => {
      total = items.reduce((total, item) => total + item.price!, 0);
    });
    return total;
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
    this.cartService.getCartItems();
  }
  logout() {
    this.userAuth.logout();
    this.router.navigate(['/home']);
    this.closeProfileMenu();
  }

  goToWatchLaterPage(): void {
    this.router.navigate(['/watch-later']);
    this.closeProfileMenu();
  }

  private closeProfileMenu(): void {
    this.isProfileShown.set(false);
    this.isCartShown.set(false);
  }

  private toggleGenericMenu(
    firstMethod: WritableSignal<boolean>,
    secondMethod: WritableSignal<boolean>
  ): void {
    firstMethod.update((value) => !value);
    secondMethod.set(false);
  }
}
