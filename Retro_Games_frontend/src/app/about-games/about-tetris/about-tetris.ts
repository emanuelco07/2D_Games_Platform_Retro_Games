import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-tetris',
  imports: [],
  templateUrl: './about-tetris.html',
  styleUrl: './about-tetris.css'
})
export class AboutTetris {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului tetris
  goToTetris() {
    this.router.navigate(['/tetris-start-page']);
  }
  
}
