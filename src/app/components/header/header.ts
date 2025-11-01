import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, signal, OnInit, WritableSignal, HostListener } from '@angular/core';
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

  // Listen for clicks outside the menus
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if click is outside profile menu
    const profileMenu = document.querySelector('[data-profileMenu="true"]');
    const profileButton = target.closest('button[class*="cursor-pointer"]');

    if (this.isProfileShown() && profileMenu && !profileMenu.contains(target) && !this.isProfileButton(target)) {
      this.isProfileShown.set(false);
    }

    // Check if click is outside cart menu
    const cartMenu = document.querySelector('[data-cartMenu="true"]');

    if (this.isCartShown() && cartMenu && !cartMenu.contains(target) && !this.isCartButton(target)) {
      this.isCartShown.set(false);
    }

    // Check if click is outside mobile nav menu
    const navbar = document.getElementById('navbar-menu');
    const hamburgerButton = target.closest('button[type="button"]');

    if (this.isMenuOpen && navbar && !navbar.contains(target) && !hamburgerButton) {
      this.isMenuOpen = false;
    }
  }

  // Helper to check if clicked element is profile button
  private isProfileButton(element: HTMLElement): boolean {
    const profileButtonSvg = element.closest('svg');
    if (profileButtonSvg) {
      const svgClasses = profileButtonSvg.getAttribute('class') || '';
      return svgClasses.includes('lucide-user-round');
    }
    return false;
  }

  // Helper to check if clicked element is cart button
  private isCartButton(element: HTMLElement): boolean {
    const cartButtonSvg = element.closest('svg');
    if (cartButtonSvg) {
      const svgClasses = cartButtonSvg.getAttribute('class') || '';
      return svgClasses.includes('lucide-shopping-cart');
    }
    return false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Close other menus when opening mobile menu
    if (this.isMenuOpen) {
      this.isProfileShown.set(false);
      this.isCartShown.set(false);
    }
  }

  // Close mobile menu when clicking on nav items
  closeMenuOnNavClick(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  async goHome(event: MouseEvent) {
    event.preventDefault();

    // Close mobile menu if open
    this.closeMenuOnNavClick();

    const currentUrl = this.router.url.split('#')[0];

    if (currentUrl === '/home') {
      // Remove fragment from URL if found
      if (window.location.hash) {
        history.replaceState(null, '', '/home');
      }

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If not on home, navigate to home
      await this.router.navigate(['/home']);
      // Then scroll to top after a short delay to ensure the page has loaded
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  toggleProfileMenu(): void {
    this.toggleGenericMenu(this.isProfileShown, this.isCartShown);
    // Close mobile menu when opening profile
    if (this.isProfileShown()) {
      this.isMenuOpen = false;
    }
  }

  toggleCartMenu(): void {
    this.toggleGenericMenu(this.isCartShown, this.isProfileShown);
    // Close mobile menu when opening cart
    if (this.isCartShown()) {
      this.isMenuOpen = false;
    }
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
    return +total.toFixed(2);
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
  }

  logout() {
    this.userAuth.logout();
    this.userAuth.googleLogout();
    this.router.navigate(['/home']);
    this.closeAllMenus();
  }

  goToWatchLaterPage(): void {
    this.router.navigate(['/watch-later']);
    this.closeAllMenus();
  }

  private closeAllMenus(): void {
    this.isProfileShown.set(false);
    this.isCartShown.set(false);
    this.isMenuOpen = false;
  }

  private toggleGenericMenu(
    firstMethod: WritableSignal<boolean>,
    secondMethod: WritableSignal<boolean>
  ): void {
    firstMethod.update((value) => !value);
    secondMethod.set(false);
  }
}
