import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from '../account/account';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(public accounService: Account){

  }
  

}
