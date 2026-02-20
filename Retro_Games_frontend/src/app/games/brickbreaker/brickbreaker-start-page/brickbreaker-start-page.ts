import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brickbreaker-start-page',
  imports: [],
  templateUrl: './brickbreaker-start-page.html',
  styleUrl: './brickbreaker-start-page.css'
})
export class BrickbreakerStartPage {
constructor(private router: Router) {}

  //functie pentru ca utilizatorul sa poate alege nivelul usor de dificultate
  startEasy() {
    this.router.navigate(['/brickbreaker1']);
  }

  //functie pentru ca utilizatorul sa poate alege nivelul mediu de dificultate
  startMedium() {
    this.router.navigate(['/brickbreaker2']);
  }

  //functie pentru ca utilizatorul sa poate alege nivelul greu de dificultate
  startHard() {
    this.router.navigate(['/brickbreaker3']);
  }

  //functie pentru ca utilizatorul sa poate alege nivelul cu inimi de dificultate
  startHeart() {
    this.router.navigate(['/brickbreaker-heart']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-brickbreaker']);
  }

  //functie pentru a te intoarce la pagina principala de jocuri
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
