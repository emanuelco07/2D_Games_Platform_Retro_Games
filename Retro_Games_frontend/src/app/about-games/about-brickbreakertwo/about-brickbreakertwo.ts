import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-brickbreakertwo',
  imports: [],
  templateUrl: './about-brickbreakertwo.html',
  styleUrl: './about-brickbreakertwo.css'
})
export class AboutBrickbreakertwo {

  constructor(private router: Router) {}

  //functie pentru a naviga inapoi la pagina de start a jocului brickbreakertwo
  goToBrickbreakertwo() {
    this.router.navigate(['/brickbreakertwo-start-page']);
  }
    
}
