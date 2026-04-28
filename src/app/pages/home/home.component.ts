import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { RecomendedSystemComponent } from "../../recomended-system/recomended-system.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, MovieCardComponent, RecomendedSystemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
