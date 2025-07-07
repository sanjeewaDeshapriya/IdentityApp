
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class Account {

  constructor(private http:HttpClient) { }

  register(model:Register){
    return this.http.post(`${environment.appurl}/api/Account/Register`,model);
  }
}
