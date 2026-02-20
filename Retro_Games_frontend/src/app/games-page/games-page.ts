import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-games-page',
  imports: [],
  templateUrl: './games-page.html',
  styleUrl: './games-page.css'
})
export class GamesPage {
  constructor (private router: Router, private authService: AuthService) {}

  //metoda pentru ca utilizatorul sa navigheze la jocul snake
  goToSnake() {  
    this.router.navigate(['/snake-start-page']);
  }

  //metoda pentru ca utilizatorul sa navigheze la jocul tetris
  goToTetris() {  
    this.router.navigate(['/tetris-start-page']);
  }

  //metoda pentru ca utilizatorul sa navigheze la jocul brickbreaker 1
  goToBrickBreaker() {
    this.router.navigate(['/brickbreaker-start-page']);
  }

  //metoda pentru ca utilizatorul sa navigheze la jocul brickbreaker 2
  goToBrickBreaker2() {
    this.router.navigate(['/brickbreakertwo-start-page']);
  }

  //metoda pentru ca utilizatorul sa navigheze la jocul goal scorer
  goToGoalscorer() {
    this.router.navigate(['/goalscorer-start-page']);
  }

  //metoda pentru ca utilizatorul sa navigheze la jocul super bricks
  goToSuperBricks() {
    this.router.navigate(['/superbricks-start-page']);
  }

  //metoda pentru a permite utilizatorului sa navigheze la chat
  goToChat() {
    this.router.navigate(['/chat']);
  }

  //metoda pentru a permite utilizatorului sa navigheze la pagina de reportat bug uri
  goToReportBugs() {
    this.router.navigate(['/report-bugs']);
  }


  //metoda pentru ca utilizatorul sa navigheze la pagina cu clasamentele jocurilor
  goToRankingsPage() {
    this.router.navigate(['/rankings-page'])
  }

  //metoda pentru delogarea utilizatorului
  onLogout() {
    this.authService.logout();
  }

  //metoda pentru a deloga utilizatorul si al redirectiona catre prima pagina
  goToFirstPage() {
    this.onLogout();
    this.router.navigate(['/start-page']);
  }
}
