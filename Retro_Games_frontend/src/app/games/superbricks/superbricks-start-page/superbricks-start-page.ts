import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superbricks-start-page',
  imports: [CommonModule],
  templateUrl: './superbricks-start-page.html',
  styleUrl: './superbricks-start-page.css'
})
export class SuperbricksStartPage {
  constructor(private router: Router) {}
  
  //metoda pentru ca utilizatorul sa navigheze la jocul super bricks
  goToGame() {  
    this.router.navigate(['/superbricks']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-superbricks']);
  }

  //metoda pentru ca utilizatorul sa navigheze la pagina cu toate jocurile
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
