import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification {

  @Input() isSuccsess: boolean = true;
  @Input() title: string = '';
  @Input() message: string = '';

  constructor() { }

  close(){
    this.isSuccsess = false;
    this.title = '';
    this.message = '';
  }


  

}
