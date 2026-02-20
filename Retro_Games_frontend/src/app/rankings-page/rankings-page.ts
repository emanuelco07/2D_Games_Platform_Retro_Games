import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-rankings-page',
  imports: [],
  templateUrl: './rankings-page.html',
  styleUrl: './rankings-page.css'
})
export class RankingsPage {
  constructor (private router: Router, private authService: AuthService) {}

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului snake
  goToSnake() {  
    this.router.navigate(['/snake-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului tetris
  goToTetris() {  
    this.router.navigate(['/tetris-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului brickbreaker 1
  goToBrickBreaker() {
    this.router.navigate(['/brickbreaker-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului brickbreaker 2
  goToBrickBreaker2() {
    this.router.navigate(['/brickbreakertwo-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului goal scorer
  goToGoalscorer() {
    this.router.navigate(['/goalscorer-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la clasamentul jocului super bricks
  goToSuperBricks() {
    this.router.navigate(['/superbricks-rankings']);
  }

  //metoda pentru ca utilizatorul sa navigheze la pagina cu jocuri
  goToGamesPage() {
    this.router.navigate(['/games-page'])
  }

  //metoda pentru a deloga utilizatorul
  onLogout() {
    this.authService.logout();
  }

  //metoda pentru a deloga utilizatorul si al trimite catre prima pagina
  goToFirstPage() {
    this.onLogout();
    this.router.navigate(['/start-page']);
  }
}
