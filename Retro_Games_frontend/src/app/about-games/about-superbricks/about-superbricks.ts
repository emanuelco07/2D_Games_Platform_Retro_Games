import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-superbricks',
  imports: [],
  templateUrl: './about-superbricks.html',
  styleUrl: './about-superbricks.css'
})
export class AboutSuperbricks {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului super bricks
  goToSuperbricks() {
    this.router.navigate(['/superbricks-start-page']);
  }

}
