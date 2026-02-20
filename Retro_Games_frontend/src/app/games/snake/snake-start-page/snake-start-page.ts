import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snake-start-page',
  imports: [],
  templateUrl: './snake-start-page.html',
  styleUrl: './snake-start-page.css'
})
export class SnakeStartPage {
  constructor(private router: Router) {}

  //functie pentru ca utilizatorul sa poata alege dificultatea usoara a jocului
  startEasy() {
    this.router.navigate(['/snake1']);
  }

  //functie pentru ca utilizatorul sa poata alege dificultatea medie a jocului
  startMedium() {
    this.router.navigate(['/snake2']);
  }

  //functie pentru ca utilizatorul sa poata alege dificultatea grea a jocului
  startHard() {
    this.router.navigate(['/snake3']);
  }

  //functie pentru ca utilizatorul sa poata alege varianta fara pereti a jocului
  startNoWall() {
    this.router.navigate(['/snake-zero-wall']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-snake']);
  }

  //functie pentru ca utilizatorul sa se poata intoarce la pagina principala a jocurilor
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
