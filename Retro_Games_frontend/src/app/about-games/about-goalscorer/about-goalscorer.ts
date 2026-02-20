import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-goalscorer',
  imports: [],
  templateUrl: './about-goalscorer.html',
  styleUrl: './about-goalscorer.css'
})
export class AboutGoalscorer {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului goal scorer
  goToGoalscorer() {
    this.router.navigate(['/goalscorer-start-page']);
  }

}
