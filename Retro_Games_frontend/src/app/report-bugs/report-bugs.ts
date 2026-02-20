import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BugMessage, BugService } from '../bug.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-bugs',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report-bugs.html',
  styleUrl: './report-bugs.css'
})
export class ReportBugs {

  bugForm!: FormGroup; //declaram formularul pentru trimiterea erorilor
  bugs: BugMessage [] = []; //declaram bug urile (un vector)
  currentUserId = Number(localStorage.getItem('userId')); //obtinem id ul utilizatorului

  constructor(private fb: FormBuilder, private bugService: BugService, private router: Router) {}

  ngOnInit(): void { 

    //initializam formularul cu un text gol
    this.bugForm = this.fb.group({ 
      description: ['', Validators.required]
    })
  }

  //trimite un bug nou
  sendMessage(): void {
    if(this.bugForm.invalid) return;

    const newBug: BugMessage = {
      description: this.bugForm.value.description,
      UserId: this.currentUserId
    }

    this.bugService.reportBug(newBug).subscribe({
      next: () => {
        this.bugForm.reset(); //resetam formularul
      }
    })
  }

  //metoda pentru ca utilizatorul sa se poata intoarce la pagina cu jocuri
  goToGamesPage()
  {
    this.router.navigate(['/games-page']);
  }
}
