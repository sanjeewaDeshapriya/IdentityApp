
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/account/register';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogIn } from  '../shared/models/account/Login';
import { User } from '../shared/models/account/user';
import { map, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmEmail } from './confirm-email/confirm-email';
import { Confirm_Email } from '../shared/models/account/confirmEmail';
import { ResetPassword } from './reset-password/reset-password';
import { Reset_Password } from '../shared/models/account/resetPassword';
import { RegisterWithExternal } from '../shared/models/account/registerWithExternal';
import { LoginWithExternal } from '../shared/models/account/loginWithExternal';

@Injectable({
  providedIn: 'root'
})
export class Account {

  private userSource = new ReplaySubject<User | null>();
  user$ = this.userSource.asObservable();

  constructor(private http:HttpClient , private router:Router) { }

  login(model:LogIn){
    return this.http.post<User>(`${environment.appurl}/api/Account/Login`,model).pipe(
      map((user:User) => {
        if (user) {
          this.setUser(user);
          return user;
        }
        return null;
      })
    )
  }

  register(model:Register){
    return this.http.post(`${environment.appurl}/api/Account/Register`,model);
  }
  loginWithThirdParty(model: LoginWithExternal) {
    return this.http.post<User>(`${environment.appurl}/api/account/login-with-third-party`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }

  confirmEmail(model: Confirm_Email) {
    return this.http.put(`${environment.appurl}/api/account/confirm-email`, model);
  }

  resendEmailConfirmationLink(email: string) {
    return this.http.post(`${environment.appurl}/api/account/resend-email-confirmation-link/${email}`, {});
  }

  resetPassword(model: Reset_Password) {
    return this.http.put(`${environment.appurl}/api/Account/reset-password`, model);
  }
  forgotUsernameOrPassword(email: string) {
    return this.http.post(`${environment.appurl}/api/account/forgot-username-or-password/${email}`, {});
  }
  registerWithThirdParty(model: RegisterWithExternal) {
    return this.http.post<User>(`${environment.appurl}/api/account/register-with-third-party`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    );
  }




  refreshUser(jwt: string | null) {
  console.log("refreshUser called");

  if (jwt === null) {
    this.userSource.next(null);
    return null // return an observable of null to maintain return type consistency
  }



  console.log(`jwt is ${jwt}`);

  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + jwt);

  return this.http.get<User>(`${environment.appurl}/api/Account/refresh-user-toke`, { headers }).pipe(
    map((user: User) => {
      if (user) {
        this.setUser(user);
        return user;
      }
      return null;
    })
  );
}



  getJWT(){
    const key= localStorage.getItem(environment.userKey);
    if (key){
      const user:User = JSON.parse(key);
      console.log(user.jwt);
      return user.jwt;
      
      
    }else{
      return null;
    }
  }

  logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }

  private setUser(user:User){
    localStorage.setItem(environment.userKey,JSON.stringify(user));
    this.userSource.next(user);

    this.user$.subscribe({
      next:(res)=>console.log(res)
      
    })
  }
}
