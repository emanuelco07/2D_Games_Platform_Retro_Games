import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  error = ''; //mesaj de eroare pentru utilizator

  constructor(private authService: AuthService, private router: Router) {} //scriem in constructor private..., etc pentru a folosi dependency injection

  login() {
    this.error = ''; //resetam eroarea la fiecare login

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('username', this.username);
        this.router.navigateByUrl('/games-page');
      },
      error: (err) => {
        if(err.status === 401) {
          this.error = 'Invalid username or password!'; //mesaj specific pentru utilizator
        } else if(err.status === 400 && err.error && err.error.message) {
          //daca backend ul trimite un mesaj de eroare specific in corpul raspunsului 400
          this.error = err.error.message;
        }
        else {
          this.error = 'An error occurred during login, please try again!';
        }
      }
    });
  }
}
