import { Component, AfterViewInit } from '@angular/core';
import { HomeHeroSection } from '../home-page/home sections/home-hero-section/home-hero-section';
import { ContactUs } from '../contact-us/contact-us';
import { Waves } from '../utils/waves/waves';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Our } from "../about-page/about sections/our/our";
import { OurStoryComponent } from '../about-page/about sections/our-story/our-story.component';

@Component({
  selector: 'app-home-page',
  imports: [HomeHeroSection, ContactUs, Waves, Our, OurStoryComponent],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements AfterViewInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // 🧠 ناخد الفراجمنت من الـ window مباشرة
        const fragment = window.location.hash.replace('#', '');

        if (fragment === 'contactForm') {
          // ✅ لو في fragment فعلاً، ننزل عليه
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              const yOffset = -80; // مسافة للـ navbar
              const y =
                element.getBoundingClientRect().top +
                window.scrollY +
                yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }, 400);
        } else {
          // ✅ مفيش fragment → نرجع لأعلى الصفحة
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }
}
