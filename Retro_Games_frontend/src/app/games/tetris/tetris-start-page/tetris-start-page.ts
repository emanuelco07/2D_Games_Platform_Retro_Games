import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tetris-start-page',
  imports: [],
  templateUrl: './tetris-start-page.html',
  styleUrl: './tetris-start-page.css'
})
export class TetrisStartPage {
constructor(private router: Router) {}

  //metoda pentru ca utilizatorul sa navigheze la jocul Tetris
  goToGame() {  
    this.router.navigate(['/tetris']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-tetris']);
  }

  //metoda pentru ca utilizatorul sa navigheze la pagina principala a jocurilor
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
