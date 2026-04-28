import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatGridComponent } from "../seat-grid/seat-grid.component";
import { ShowSelectionComponent } from "../../pages/show-selection/show-selection.component";
import { RecomendedSystemComponent } from "../../recomended-system/recomended-system.component";
import { SafeUrlPipe } from '../../services/safe-url.pipe';

@Component({
  selector: 'app-show-card',
  standalone: true,
  imports: [CommonModule, SeatGridComponent, ShowSelectionComponent, RecomendedSystemComponent, SafeUrlPipe],
  templateUrl: './show-card.component.html',
  styleUrl: './show-card.component.css'
})
export class ShowCardComponent {
  indication:boolean=false;

  constructor(private http:HttpClient ,private router:Router,private route:ActivatedRoute) {
      
  }
 id: number=0;
  ngOnInit (){
       this.id = Number(this.route.snapshot.paramMap.get('id'));
      console.log(this.id)
      this.loadMovies()
  }
   
    data:any=[]
  routers(){
      this.indication=!this.indication
  }
loadMovies() {
    this.http.get('https://localhost:7061/api/movie/'+this.id).subscribe({
      next: (response) => {
        this.data = response;  
        console.log('Movies:', this.data);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
