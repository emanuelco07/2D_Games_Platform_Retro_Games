import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-snake',
  imports: [],
  templateUrl: './about-snake.html',
  styleUrl: './about-snake.css'
})
export class AboutSnake {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului snake
  goToSnake() {
    this.router.navigate(['/snake-start-page']);
  }
}
