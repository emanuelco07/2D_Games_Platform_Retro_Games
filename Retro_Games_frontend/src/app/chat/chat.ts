import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatMessage, ChatService } from '../chat.service';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {

  chatForm!: FormGroup; //declaram formularul
  chats: ChatMessage[] = []; //declaram chat urile (un vector)
  currentUserId = Number(localStorage.getItem('userId')); //obtinem id ul utilizatorului curent
  username = String(localStorage.getItem('username')); //obtinem numele utilizatorului

  constructor(private fb: FormBuilder, private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {

    //initializam formularul cu un text gol
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    })

    this.loadChats();
  }

  //functie folosita pentru a incarca toate mesajele
  loadChats(): void {
    this.chatService.getChats().subscribe({
      next: (data) => {
        this.chats = data.sort((a, b) =>
          new Date(a.sendAt || '').getTime() - new Date(b.sendAt || '').getTime()
        ); 
      },
      error: (err) => console.error('Eroare la incarcarea mesajelor: ', err)
    });
  }

  //trimite un mesaj nou
  sendMessage(): void {
    if(this.chatForm.invalid) return;

    const newChat: ChatMessage = {
      username: this.username,
      message: this.chatForm.value.message,
      UserId: this.currentUserId
    };

    this.chatService.addChat(newChat).subscribe({
      next: () => {
        this.chatForm.reset(); //resetam formularul
        this.loadChats(); //reincarcam mesajele dupa trimiterea unui mesaj
      },
      error: (err) => console.error('Eroare la trimiterea mesajului: ', err)
    });
  }

  //metoda folosita pentru ca utilizatorul sa poate da resfresh la chat
  refreshChat()
  {
    this.chatForm.reset(); //resetam formularul
    this.loadChats(); //reincarcam mesajele dupa trimiterea unui mesaj
  }

  //metoda pentru ca utilizatorul sa se poata intoarce la pagina cu jocuri
  goToGamesPage()
  {
    this.router.navigate(['/games-page']);
  }

}