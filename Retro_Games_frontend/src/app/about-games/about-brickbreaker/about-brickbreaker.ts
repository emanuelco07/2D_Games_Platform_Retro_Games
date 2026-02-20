import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-brickbreaker',
  imports: [],
  templateUrl: './about-brickbreaker.html',
  styleUrl: './about-brickbreaker.css'
})
export class AboutBrickbreaker {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului brickbreaker
  goToBrickbreaker() {
    this.router.navigate(['/brickbreaker-start-page']);
  }
    
}
