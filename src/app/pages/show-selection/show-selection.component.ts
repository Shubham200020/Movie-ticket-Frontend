import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SeatsInputComponent } from "../../Booking/seats-input/seats-input.component";

@Component({
  selector: 'app-show-selection',
  standalone: true,
  imports: [CommonModule, SeatsInputComponent],
  templateUrl: './show-selection.component.html',
  styleUrl: './show-selection.component.css'
})
export class ShowSelectionComponent {
  isSeat=true;

  theatres = [
    {
      name: 'INOX Megaplex Phoenix Mall',
      shows: [
        { time: '10:45 AM', type: 'fast' },
        { time: '02:00 PM', type: 'fast' },
        { time: '08:30 PM', type: 'available' },
        { time: '11:45 PM', type: 'available' }
      ]
    },
    {
      name: 'PVR Phoenix Market City',
      shows: [
        { time: '08:30 PM', type: 'fast' },
        { time: '11:45 PM', type: 'available' }
      ]
    }
  ];

  selectShow(show: any) {
    console.log('Selected:', show);
  }
  OnClk(){
this.isSeat=false
  }
}
