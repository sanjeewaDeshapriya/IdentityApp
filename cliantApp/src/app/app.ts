import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Footer } from "./footer/footer";
import { SharedModule } from './shared/shared-module';
import { HttpClientModule } from '@angular/common/http';
import { Account } from './account/account';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer,SharedModule,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'cliantApp';

  constructor(private accountService: Account) { }

  ngOnInit() {
    this.refreshUser();
  }

  refreshUser() {
    const jwt = this.accountService.getJWT();
    if (jwt) {
      console.log(jwt);
      
      this.accountService.refreshUser(String(jwt))?.subscribe({
        next: _ => {},
        error: _ => {
          this.accountService.logout();
        }
      });
    }
    else{
      this.accountService.refreshUser(null)?.subscribe();
    }
  }
}
