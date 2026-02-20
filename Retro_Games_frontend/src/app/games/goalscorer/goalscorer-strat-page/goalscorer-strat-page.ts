import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-goalscorer-strat-page',
  imports: [],
  templateUrl: './goalscorer-strat-page.html',
  styleUrl: './goalscorer-strat-page.css'
})
export class GoalscorerStratPage {
constructor(private router: Router) {}

  //metoda pentru ca utilizatorul sa navigheze la jocul Goal Scorer
  goToGame() {  
    this.router.navigate(['/goalscorer']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-goalscorer']);
  }

  //metoda pentru ca utilizatorul sa navigheze la pagina cu toate jocurile
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
