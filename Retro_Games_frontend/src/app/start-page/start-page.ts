import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  imports: [],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css'
})

export class StartPage {
  constructor (private router: Router) {}

  //metoda pentru ca utilizatorul sa navigheze la pagina de login
  goToLogin() {  
    this.router.navigate(['/login']);
  }

  //metoda pentru ca utilizatorul sa navigheze la pagina de register
  goToRegister() {  
    this.router.navigate(['/register']);
  }
}
