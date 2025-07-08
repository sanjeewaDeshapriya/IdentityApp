import { Component, OnInit } from '@angular/core';
import { Playservice } from './playservice';

@Component({
  selector: 'app-play',
  imports: [],
  templateUrl: './play.html',
  styleUrl: './play.css'
})
export class Play  implements OnInit{

  message: string | undefined;


  constructor(private playService : Playservice){}
  ngOnInit(): void {

    this.playService.getPlayers().subscribe({
      next: (response:any) => {
        console.log(response);
        this.message = response.value.message;
      },
      error: (error) => {
        console.error("Error fetching players", error);
      }
    
  })


}
}