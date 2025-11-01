import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import ResponseEntity from '../Interfaces/ResponseEntity';
import LoginCredentials from '../Interfaces/loginCredentials';
import IUser from '../Interfaces/IUser';
import registrationCredentials from '../Interfaces/registrationCredentials';
import { authConfig } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class UserAuth {
  private initialData: IUser = {
    name: '',
    email: '',
    role: 'user',
    refreshToken: '',
    accessToken: '',
    cart: [],
    watchLater: [],
    purchaseCourses: [],
  };
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.googleConfiguration();
  }

  private errorMessage = new BehaviorSubject<string>('');
  errorMessage$ = this.errorMessage.asObservable();

  private userProfile = new BehaviorSubject<IUser>(this.initialData);
  userProfile$ = this.userProfile.asObservable();

  private authStatus = new BehaviorSubject<boolean>(this.hasToken());
  authStatus$ = this.authStatus.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('userToken');
  }

  get isLoggedIn(): boolean {
    return this.authStatus.value;
  }

  login(credentials: LoginCredentials): void {
    this.http.post<ResponseEntity>(`${this.apiUrl}/signin`, credentials).subscribe({
      next: (response): void => {
        this.changeObservableVal(response);
        this.saveUserData(response);
      },
      error: (err): void => {
        console.error(err);
        this.errorMessage.next(err.error.message);
      },
    });
  }
  register(registrationCredentials: registrationCredentials): void {
    this.http.post<ResponseEntity>(`${this.apiUrl}/signup`, registrationCredentials).subscribe({
      next: (response): void => {
        this.changeObservableVal(response);
        this.saveUserData(response);
      },
      error: (err): void => {
        console.error(err);
        this.errorMessage.next(err.error.message);
      },
    });
  }
  logout(): void {
    this.http
      .post<ResponseEntity>(
        `${this.apiUrl}/logout`,
        {} // body of the request
        // ! added in user interceptor
        // { headers: { authorization: `${localStorage.getItem('userToken')}` } }
      )
      .subscribe({
        next: (): void => {
          this.authStatus.next(false);
          this.userProfile.next(this.initialData);
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
        },
        error: (err): void => {
          console.error(err);
          this.errorMessage.next(err.error.message);
        },
      });
  }

  googleLogin(): void {
    this.oauthService.initLoginFlow();
    console.log('test in login ');
  }

  googleLogout(): void {
    this.oauthService.logOut();
  }

  isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  async googleConfiguration(): Promise<void> {
    this.oauthService.configure(authConfig);
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    // After redirect back, check if authenticated
    if (this.oauthService.hasValidAccessToken()) {
      const claims = this.oauthService.getIdentityClaims() as any;
      if (claims) {
        const userData = {
          name: claims.name,
          email: claims.email,
          picture: claims.picture,
        };

        this.http.post<ResponseEntity>(`${this.apiUrl}/with-google`, userData).subscribe({
          next: (response): void => {
            this.changeObservableVal(response);
            this.saveUserData(response);
          },
          error: (err): void => {
            console.error(err);
            this.errorMessage.next(err.error.message);
          },
        });
      }
    }
  }

  private saveUserData(response: ResponseEntity): void {
    localStorage.setItem('userToken', `Bearer ${response.data.accessToken}`);
    // localStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
  }

  private changeObservableVal(response: ResponseEntity): void {
    this.authStatus.next(response.success);
    this.userProfile.next(response.data);
  }
}
