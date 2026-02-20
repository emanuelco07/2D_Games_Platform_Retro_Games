import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brickbreakertwo-strat-page',
  imports: [],
  templateUrl: './brickbreakertwo-strat-page.html',
  styleUrl: './brickbreakertwo-strat-page.css'
})
export class BrickbreakertwoStratPage {
constructor(private router: Router) {}

  //functie pentru a naviga la nivelul usor
  startEasy() {
    this.router.navigate(['/brickbreakertwo1']);
  }

  //functie pentru a naviga la nivelul mediu
  startMedium() {
    this.router.navigate(['/brickbreakertwo2']);
  }

  //functie pentru a naviga la nivelul greu
  startHard() {
    this.router.navigate(['/brickbreakertwo3']);
  }

  //functie pentru a naviga la nivelul cu inimi
  startHeart() {
    this.router.navigate(['/brickbreakertwo-heart']);
  }

  //functie pentru ca utilizatorul sa poata accesa pagina cu informatii despre joc
  goToAboutGame() {
    this.router.navigate(['/about-brickbreakertwo']);
  }

  //functie pentru a naviga la pagina de jocuri
  goToGames() {
    this.router.navigate(['/games-page'])
  }
}
