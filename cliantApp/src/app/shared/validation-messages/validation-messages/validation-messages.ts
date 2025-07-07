import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-validation-messages',
  imports: [CommonModule],
  templateUrl: './validation-messages.html',
  styleUrl: './validation-messages.css'
})
export class ValidationMessages {

  @Input() errorMessage: string[] | undefined;

}
