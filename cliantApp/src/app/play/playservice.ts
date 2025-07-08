import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Account } from '../account/account';

@Injectable({
  providedIn: 'root'
})
export class Playservice {

  

  jwt: any;

  constructor(private http: HttpClient, private accountservice: Account) {
    this.jwt = this.accountservice.getJWT();
  }

  getPlayers(){

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.jwt);

  
    return this.http.get('http://localhost:5090/api/Play/Get-Players', { headers });
  }
}
