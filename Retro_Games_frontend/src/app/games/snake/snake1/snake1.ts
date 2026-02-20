import { Component, HostListener } from '@angular/core';
import { ScoreService } from '../../../score.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

//enum = enumare, declarare de constante
//declarare coduri pentru taste
enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft'
}

//declarare directii
enum Direction {
  UP,
  DOWN, 
  LEFT,
  RIGHT
}

//definim coordonatele
interface Coordinate {
  x: number;
  y: number;
}

const DELTA = 40; //dimensiunea unui block din sarpe, mar, grid
const GRID_WIDTH = 20; //inmultim acest numar cu DELTA si obtineam latineam grid ului, care este 800 (multiplu de 40)
const GRID_HEIGHT = 15; //inmultim acest numar cu DELTA si obtinem inaltimea grid ului, care este 600 (multiplu de 40)
const WIDTH = GRID_WIDTH * DELTA; //latimea grid ului
const HEIGHT = GRID_HEIGHT * DELTA; //inaltimea grid ului
const CURRENT_GAME_NAME = "Snake"; //numele jocului

@Component({
  selector: 'app-snake1',
  imports: [CommonModule],
  templateUrl: './snake1.html',
  styleUrl: './snake1.css'
})

export class Snake1 {

  constructor (private scoreService: ScoreService, private router: Router, private authService: AuthService) {}

  pause: boolean = false; //variabila folosita pentru a pune pauza la joc
  intervalId: number | undefined; //folosit pentru a reseta intervalul cand e nevoie
  username: string = ''; //numele utilizatorului conectat
  highscore = 0; //highscore ul curent al utilizatorului conectat
  leaderboard: { username: string; highScore: number }[] = []; //ne definim un array pentru a memora leaderboard ul
  apple: Coordinate = {x: 0, y: 0} //definim coordonatele marului

  //definim coordonatele sarpelui, utlimele coordonate reprezinta capul lui x: 120, y: 280
  snake: Coordinate[] = [
    {x: 0, y: 280}, 
    {x: 40, y: 280}, 
    {x: 80, y: 280},
    {x: 120, y: 280},
  ];

  direction: Direction = Direction.RIGHT; //predefinim directia in care se va misca initial sarpele (dreapta)
  playing = false; //folosita pentru a verifica daca jocul inca "merge", adica daca utilizatorul e logat si vrea sa incepe sa joace
  started = false; //pentru a verifica daca jocul a inceput, daca jucatorul a apasat pe butonul play
  message = ''; //mesajul de final de joc
  points = 0; //punctele din jocul curent
  directionChange = false; //pentru a nu putea muta in acelasi interval de timp directia de mai multe ori, sa evitam un bug

  ngOnInit() {
    this.username = localStorage.getItem('username') || ''; //obtinem numele utilizatorului conectat

    //ia highscore ul din tabela users pentru al putea verifica/actualiza
    this.scoreService.getHighScore(CURRENT_GAME_NAME).subscribe(hs => {
      this.highscore = hs ?? 0; //primim doar numarul
    });

    //obtinem un leaderboard cu top 5
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });

    this.placeApple(); //plasam marul pe harta
  }

  //functie pentru a porni intervalul care misca sarpele
  startInterval() {

    if(this.intervalId !== undefined)
      clearInterval(this.intervalId);

    //setam un interval la care pozitia sarpelui va fi actualizata (0,2 secunde)
    this.intervalId = setInterval(() => {

      //verificare daca jocul s a incheiat/daca a pornit, ori daca e pe pauza
      if(!this.playing || !this.started || this.pause) {
        return;
      }
      const size = this.snake.length; //memoram marimea sarpelui
      this.directionChange = false; //resetam variabila pentru ca nu mai putem modifica directia

      //mai jos vom muta sarpele, mutam "piesele una peste alta" si doar capului ii schimbam directia
      //toate celelalte "piese" vor urma capul
      for (let i = 0; i < size - 1; i++) {
            this.snake[i].x = this.snake[i + 1].x;
            this.snake[i].y = this.snake[i + 1].y;
          }

      //schimbare de directie sarpe
      switch (this.direction) {
        case Direction.RIGHT:
          this.snake[size - 1].x += DELTA
          break;
        case Direction.LEFT:
          this.snake[size - 1].x -= DELTA
          break;
        case Direction.UP:
          this.snake[size - 1].y -= DELTA
          break;
        case Direction.DOWN:
          this.snake[size - 1].y += DELTA
          break;
      }

      //verificam daca marul a fost "lovit" (mancat)
      this.checkApple();

      //verificam daca sarpele a iesit in afara grid ului
      this.checkBorder();

      //verificam daca sarpele s-a lovit pe el insusi
      this.checkHit();

      }, 200);
    }

  //functie pentru a verifica daca sarpele a mancat marul
  checkApple() {
    const last = this.snake[this.snake.length - 1]; //memoram pozitia capului sarpelui

    //verificam daca sarpele a mancat marul
    if(last.x == this.apple.x && last.y == this.apple.y) {
      this.snake.unshift({x: this.snake[0].x, y: this.snake[0].y}) //unshift adauga un element nou la inceputul array-ului, care practic e finalul sarpelui
      this.points++; //fiecare mar mancat valoreaza 1 punct
      this.placeApple();
    }
  }

  //functie pentru a verifica daca sarpele s a lovit pe el insusi
  checkHit()
  {
    const last = this.snake[this.snake.length - 1]; //obtinem pozitia capului sarpelui
 
    //verificam daca capul a lovit vreo piesa din corpului sarpelui (last != b pentru a nu considera ca s a lovit "cap in cap")
    if(this.snake.find((b) => last != b && b.x === last.x && b.y == last.y)) {
      this.message = 'You lost!';
      this.gameOver();
      this.playing = false;
    }
  }

  //functie pentru a verifica daca sarpele a iesit in afara grid ului
  checkBorder() {
    const last = this.snake[this.snake.length - 1]; //obtinem pozitia capului sarpelui

    //verificam ca sarpele sa nu fi depasit careul 
    if(last.x >= WIDTH || last.x < 0 || last.y >= HEIGHT || last.y < 0) {
      this.message = 'You lost!';
      this.gameOver();
      this.playing = false;
      return;
    }
  }

  //functie pentru a plasa marul pe harta
  placeApple() {
    //functia asta imi da noi coordonate random pentru mar
    while (true) {
      const x = Math.floor(Math.random() * GRID_WIDTH) * DELTA;
      const y = Math.floor(Math.random() * GRID_HEIGHT) * DELTA;

      //verificam ca noua pozitie a marului sa nu fie "pe sarpe"
      if(this.snake.find((b) => b.x === x && b.y === y)) {
        continue;
      }
      //console.log({x, y})
      this.apple.x = x;
      this.apple.y = y;
      break;
    }
  }

  //functie pentru a actualiza highscore ul daca e cazul si a opri jocul
  gameOver() {
    //in cazul in care jucatorul a obtinut un punctaj mai bun decat highscore ul actual acesta va fi actualizat 
    //daca nu se poate actualiza, in fereastra se va afisa un mesaj de eroare 

    this.playing = false; //oprim jocul

    if (this.points > this.highscore) {
      this.scoreService.updateHighScore(this.points, CURRENT_GAME_NAME).subscribe(() => {
        this.highscore = this.points;
        alert('Felicitări! Ai un nou highscore!');
      }, () => {
        alert('Eroare la salvarea scorului.');
      });
    }
  }

  //functie pentru a incepe/reincepe jocul
  startGame() {
    //folosim aceasta functie pentru a initializa jocul 
    this.message = '';
    this.points = 0;
    this.snake = [
      {x: 0, y: 280}, 
      {x: 40, y: 280}, 
      {x: 80, y: 280},
      {x: 120, y: 280},
    ];
    this.direction = Direction.RIGHT;
    if(this.playing === true || this.started === true) 
      this.placeApple();
    this.playing = true;
    this.started = true;
    this.pause = false;

    //obtinem un leaderboar cu top 5, reactualizam tabela la reinceperea jocului
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });

    this.startInterval(); //pornim intervalul care misca sarpele
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    //blocheaza scroll-ul pentru orice tasta apasata, deoarece in momentul in care apasam pe 
    //sagetile up sau down mi se ducea in sus/jos toata pagina
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }
    
    if(this.directionChange == true) return; //ignoram daca deja am schimbat directia

    //aici facem cateva verificari, in sensul ca daca sarpele merge in sus sa nu putem apasa sa mearga in jos imediat, ar fi un bug
    //la fel si daca merge in jos, sa nu apasam in sus, stanga-dreapta si dreapta-stanga
    switch (event.code) {
      case KEY_CODE.UP_ARROW:
        if(this.direction === Direction.DOWN)
          break;
        this.direction = Direction.UP
        this.directionChange = true; //directia a fost modificata
        break;
      case KEY_CODE.DOWN_ARROW:
        if(this.direction === Direction.UP)
          break;
        this.direction = Direction.DOWN
        this.directionChange = true; //directia a fost modificata
        break;
      case KEY_CODE.LEFT_ARROW:
        if(this.direction === Direction.RIGHT)
          break;
        this.direction = Direction.LEFT
        this.directionChange = true; //directia a fost modificata
        break;
      case KEY_CODE.RIGHT_ARROW:
        if(this.direction === Direction.LEFT)
          break;
        this.direction = Direction.RIGHT
        this.directionChange = true; //directia a fost modificata
        break;
      default:
        break;
    }
  }

  //functie pentru a ne duce inapoi la pagina de start a jocului
  goToStartPage() {
    this.router.navigate(['/snake-start-page']);
  }

  //functie pentru a deloga utilizatorul si a l duce inapoi la pagina de login
  onLogout() {
    this.authService.logout(); //delogam utilizatorul
    this.router.navigate(['/login']);
  }

  //functie pentru a putea pune jocul pe pauza
  togglePause()
  {
    if (!this.playing) return; //daca jocul s-a terminat nu facem nimic

    this.pause = !this.pause; //schimbam valoarea variabilei in functie de apasarea butonului

    if(this.pause)
      clearInterval(this.intervalId); //oprim coborarea piesei
    else
      this.startInterval() //reluam jocul
  }
}
