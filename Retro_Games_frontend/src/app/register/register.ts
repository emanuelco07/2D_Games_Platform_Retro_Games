import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';
  error = ''; //mesaj de eroare pentru utilizator
  success = ''; //mesaj de succes 

  constructor(private authService: AuthService, private router: Router) {} //injectam doua servicii angular, pentru a face ceri de tip http (put, get...) si router pentru a naviga intre pagini

  register() {
    this.error = ''; //resetam erorile la fiecare inregistrare
    this.success = ''; //resetam mesajele de succes
    
    //verificam daca parolele sunt la fel
    if(this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (respone) => {
        this.success = 'Registration successful! You can now log in!';
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        if (err.status === 400 && err.error && err.error.message) {
          this.error = err.error.message;
        } else if (err.status === 409) { 
          this.error = 'Username already exists. Please choose a different one.';
        }
        else {
          this.error = 'An error occurred during registration. Please try again.';
        }
      }
    });
  }
}
