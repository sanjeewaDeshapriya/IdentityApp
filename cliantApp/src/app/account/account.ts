
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogIn } from  '../shared/models/Login';
import { User } from '../shared/models/Login copy';
import { map, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

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
