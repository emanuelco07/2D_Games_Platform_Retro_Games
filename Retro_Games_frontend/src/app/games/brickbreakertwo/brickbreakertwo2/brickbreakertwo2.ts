import { Component, HostListener } from '@angular/core';
import { ScoreService } from '../../../score.service';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

//definim codurile tastelor necesare pentru joc
enum KEY_CODE {
  LEFT_ARROW = 'ArrowLeft',
  RIGHT_ARROW = 'ArrowRight',
  SPACE = 'Space'
};

//ne definim directiile pentru minge
enum Direction {
  NorthEast,
  NorthWest,
  SouthEast,
  SouthWest
}

const CURRENT_GAME_NAME = "Brick Breaker 2"; //numele jocului

@Component({
  selector: 'app-brickbreakertwo2',
  imports: [CommonModule],
  templateUrl: './brickbreakertwo2.html',
  styleUrl: './brickbreakertwo2.css'
})

export class Brickbreakertwo2 {

  arena: (string | 0)[][] = []; //memoram 0 cand celula e goala sau culoarea cand nu e goala
  lifeArena: (string | 0) [][] = []; //o folosim pentru a arata utilizatorului cate vieti mai are, memoram 0 cand e goala, sau o 
                                      //culoare cand o celula e ocupata

  Life_piece: number[][] = [
    [1, 1, 1, 1]
  ]                              

  Paddle_piece: number[][] = [
    [1, 1, 1]
  ]

  Paddle_two_piece: number[][] = [
    [1, 1, 1]
  ]

  Ball_piece: number[][] = [
    [1]
  ]

  Bricks_piece: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ]

  //definim culorile pentru fiecare piesa
  pieceColor: { [key: string]: string} = {
    Paddle: '#a86cf5',
    Ball: '#40e0d0',
    Bricks: '#ff6fa1',
    Life: 'red'
  };

  playing = false; //variabila care ne ajuta sa stim daca jocul este in desfasurare sau nu
  pause: boolean = false; //variabila folosita pentru a pune pauza la joc
  points = 0; //punctele din jocul curent
  message = 'Press Space to Start!'; //mesajul de inceput/final de joc
  time = 300; //folosita pentru a reporni intervalul
  direction = Direction.NorthEast; //pentru a memora directia in care se duce bila
  BallGoingUp = true; //pentru a stii daca bila se duce in sus sau in jos
  spaceStart = false; //pentru a verifica daca s a apasat tasta space pentru prima data pentru a incepe jocul

  username: string = ''; //numele utilizatorului conectat
  highscore = 0; //highscore ul curent al utilizatorului conectat
  leaderboard: { username: string, highScore: number }[] = []; //un array pentru a memora leaderboard ul

  PaddlePosition: { x: number, y: number } = {x: 3, y: 19}; //pozitia initiala a paddle ului de jos
  PaddleTwoPosition: { x: number, y: number } = {x: 3, y: 0}; //pozitia initiala a paddle ului de sus
  BricksPosition: { x: number, y: number } = {x: 0, y: 8}; //pozitia initiala a brick urilor
  BallPosition: { x: number, y: number } = {x: 4, y: 18}; //pozitia initiala a bilei
  LifePosition: { x: number, y: number } = {x: 0, y: 0}; //pozitia initiala a vietilor

  intervalId: number | undefined; //folosit pentru a reseta intervalul cand e nevoie

  constructor(private scoreService: ScoreService, private router: Router, private authService: AuthService) { }

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


    //initializam arena cu 20 de linii si 10 coloane, puse pe 0
    this.arena = [];
    for (let i = 0; i < 20; i++) {
      this.arena.push(new Array(10).fill(0));
    }

    //initializam arena vietilor cu 1 linie si 4 coloane, puse pe 0
    this.lifeArena = [];
    for (let i = 0; i < 1; i++) {
      this.lifeArena.push(new Array(4).fill(0));
    }

    //jocul de brick breaker incepe aici
    this.playing = true; //setam variabila playing la true pentru a incepe jocul
  }

  startInterval() {

    if(this.intervalId !== undefined)
      clearInterval(this.intervalId);
    
    this.intervalId = setInterval(() => {

      if(this.gameOver()) return; //daca jocul s-a terminat nu facem nimic
      if(this.gameWon()) return; //daca jocul s-a castigat, nu facem nimic

      if (!this.playing || !this.spaceStart)
        return; //daca jocul nu este in desfasurare sau daca nu s-a apasat tasta space oprim intervalul
  
      this.checkWall(); //verificam coliziunile bilei cu brick urile
      this.direction = this.checkBallCollision(); //verificam coliziunile bilei cu peretii si paddle urile

      //punem acest if aici pentru ca atunci cand bila pica si ii resetam pozitia, aceasta se mai misca o data (un frame)
      if(this.spaceStart) //daca s a apasat tasta space, bila se poate misca
        //schimbam pozitia de miscare a bilei
        switch (this.direction) {
          case Direction.NorthEast:
            this.moveBallNorthEast();
            break;
          case Direction.NorthWest:
            this.moveBallNorthWest();
            break;
          case Direction.SouthEast:
            this.moveBallSouthEast();
            break;
          case Direction.SouthWest:
            this.moveBallSouthWest();
            break;
      }
      
    }, this.time);
  }

  //functie pentru a asculta evenimentele de la tastatura
  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.pause || !this.playing) return; //blocam apasarea pe taste daca jocul e pe pauza sau oprit

    //prevenim scroll ul paginii cand apasam tastele folosite in joc
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }
    
    //putem muta paddle ul stanga dreapta, iar cand apasam space, bila se va misca mai repede
    if(this.gameWon()) return; //daca jocul s-a castigat, nu facem nimic
    if(this.gameOver()) return; //daca jocul s-a terminat nu facem nimic
      switch (event.code) {
        case KEY_CODE.LEFT_ARROW:
          this.movePaddleLeft();
          break;
        case KEY_CODE.RIGHT_ARROW:
          this.movePaddleRight();
          break;
        case KEY_CODE.SPACE:
          if(this.gameWon()) return; //daca jocul s-a castigat, nu facem nimic
          if(this.gameOver()) return; //daca jocul s-a terminat nu facem nimic
          if(!this.spaceStart) //daca nu s a apasat tasta space pana acum, o setam la true
          {
            this.message = ''; //resetam mesajul
            this.startInterval(); //pornim intervalul (jocul incepe)
            this.spaceStart = true; //pentru a putea incepe jocul
          }
          else //daca s a apasat deja tasta space, miscam bila mai repede
            this.moveBallFaster();
          break;
      }
  }

  //functie pentru a verifica coliziunile bilei cu peretii si paddle urile
  checkBallCollision() {
    if(this.BallPosition.x === 0){ //verificam coliziunea cu zidul din stanga
      if(this.BallGoingUp === true) 
        return Direction.NorthEast;
      else 
        return Direction.SouthEast;
    }
    else if(this.BallPosition.x === 9) { //verificam coliziunea cu zidul din dreapta
      if(this.BallGoingUp === true) 
        return Direction.NorthWest;
      else 
        return Direction.SouthWest;
    }
    else if(this.BallPosition.y === 0) //verificam coliziunea cu zidul de sus
    {
      //scadem din viata
      let position = -1;
      for(let i = 0; i < 4; i++)
        if(this.Life_piece[0][i] === 1)
          position = i;
      
      //daca nu mai avem ce scadea din viata, jocul este incheiat
      if(position === 0)
      {
        //aici vom pierde jocul
        this.Life_piece[0][position] = 0;
        this.gameOver();
        this.message = 'You lost!';
      }
      else //daca mai are viata, scadem una
      {
        this.Life_piece[0][position] = 0;
        this.resetGameRound(); //resetam runda curenta
      }

      clearInterval(this.intervalId); //oprim intervalul
      return this.direction; //returnam directia curenta a bilei
    } 
    else if(this.BallPosition.y + 1 === this.PaddlePosition.y) //verificam coliziunea cu paddle ul de jos (pe axa y)
    {
      if(
        this.BallPosition.x === this.PaddlePosition.x - 1 || //adaugam si cazul in care bila loveste paddle ul pe margine
        this.BallPosition.x === this.PaddlePosition.x ||
        this.BallPosition.x === this.PaddlePosition.x + 1 ||
        this.BallPosition.x === this.PaddlePosition.x + 2 ||
        this.BallPosition.x === this.PaddlePosition.x + 3 //adaugam si cazul in care bila loveste paddle ul pe margine
      ) //verificam conexiunea cu paddle ul pe axa x
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.SouthEast)
          return Direction.NorthEast;
        else if(this.direction === Direction.SouthWest)
          return Direction.NorthWest;
      }
    } 
    else if(this.BallPosition.y - 1 === this.PaddleTwoPosition.y) //verificam coliziunea cu paddle ul de sus (pe axa y)
    {
      if(
        this.BallPosition.x === this.PaddleTwoPosition.x - 1 || //adaugam si cazul in care bila loveste paddle ul pe margine
        this.BallPosition.x === this.PaddleTwoPosition.x ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 1 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 2 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 3 //adaugam si cazul in care bila loveste paddle ul pe margine
      ) //verificam conexiunea cu paddle ul pe axa x
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast)
          return Direction.SouthEast;
        else if(this.direction === Direction.NorthWest)
          return Direction.SouthWest;
      }
    }
    else if(this.BallPosition.y > 19 || this.BallPosition.x > 9 || this.BallPosition.x < 0) //daca bila iese in afara grid ului in partea de jos (trece pe langa scorer)
                                                              //sau bila iese in partea dreapta a gridului sau in partea stanga (rezolvare bug uri)
    {
      //scadem din viata
      let position = -1;
      for(let i = 0; i < 4; i++)
        if(this.Life_piece[0][i] === 1)
          position = i;
      
      //daca nu mai avem ce scadea din viata, jocul este incheiat
      if(position === 0)
      {
        //aici vom pierde jocul
        this.Life_piece[0][position] = 0;
        this.gameOver();
        this.message = 'You lost!';
      }
      else //daca mai are viata, scadem una
      {
        this.Life_piece[0][position] = 0;
        this.resetGameRound(); //resetam runda curenta
      }

      clearInterval(this.intervalId); //oprim intervalul
      return this.direction; //returnam directia curenta a bilei
    }
    return this.direction;
  }
  //functie pentru a reseta runda curenta (dupa ce bila pica pe langa paddle)
  resetGameRound() {
    //resetam pozitia paddle ului, bilei si directia de miscare a bilei
    this.direction = Direction.NorthEast;
    this.BallGoingUp = true;
    this.BallPosition.x = 4, this.BallPosition.y = 18; //reinitializam pozitia bilei
    this.PaddlePosition.x = 3, this.PaddlePosition.y = 19; //reinitializam pozitia paddle ului de jos
    this.PaddleTwoPosition.x = 3, this.PaddleTwoPosition.y = 0; //reinitializam pozitia paddle ului de sus
    this.spaceStart = false; //resetam si tasta space pentru a putea incepe jocul din nou
    this.message = 'Press Space to Continue!'; //afisam mesajul initial
  }

  //functie pentru a verifica coliziunea bilei cu brick urile
  checkWall() {
    for (let i = 0; i < this.Bricks_piece.length; i++) {
      for (let j = 0; j < this.Bricks_piece[i].length; j++) {
        if (this.Bricks_piece[i][j] !== 0) {
          const brickX = this.BricksPosition.x + j;
          const brickY = this.BricksPosition.y + i;

          // --- COLIZIUNI ---
          
          //1. Coliziune directa (bila loveste direct centrul caramizii)
          if (this.BallPosition.x === brickX && this.BallPosition.y === brickY) {
            this.destroyBrick(i, j);
            this.reverseBoth(); //sare inapoi pe ambele axe
            return;
          }

          //2. Coliziune de sus (bila loveste partea de jos a caramizii)
          if (this.BallPosition.x === brickX && this.BallPosition.y + 1 === brickY) {
            this.destroyBrick(i, j);
            this.reverseY(); // schimba doar axa Y
            return;
          }

          //3. Coliziune de jos (bila loveste partea de sus a caramizii)
          if (this.BallPosition.x === brickX && this.BallPosition.y - 1 === brickY) {
            this.destroyBrick(i, j);
            this.reverseY();
            return;
          }

          //4. Coliziune din stanga (bila loveste partea dreapta a caramizii)
          if (this.BallPosition.x + 1 === brickX && this.BallPosition.y === brickY) {
            this.destroyBrick(i, j);
            this.reverseX(); // schimba doar axa X (practic bila oricum coboara)
            return;
          }

          //5. Coliziune din dreapta (bila loveste partea stanga a caramizii)
          if (this.BallPosition.x - 1 === brickX && this.BallPosition.y === brickY) {
            this.destroyBrick(i, j);
            this.reverseX();
            return;
          }

          //6. Coliziuni colt (diagonale)
          if (
            (this.BallPosition.x - 1 === brickX && this.BallPosition.y - 1 === brickY) || // colt stanga sus
            (this.BallPosition.x + 1 === brickX && this.BallPosition.y - 1 === brickY) || // colt dreapta sus
            (this.BallPosition.x - 1 === brickX && this.BallPosition.y + 1 === brickY) || // colt stanga jos
            (this.BallPosition.x + 1 === brickX && this.BallPosition.y + 1 === brickY)    // colt dreapta jos
          ) {
            this.destroyBrick(i, j);
            this.reverseBoth(); // sare inapoi pe ambele axe
            return;
          }
        }
      }
    }
  }

  //functie pentru distrugerea unui brick si adaugarea de puncte
  destroyBrick(i: number, j: number) {
    this.points += 200;
    this.Bricks_piece[i][j] = 0;
  }

  //inverseaza bila doar pe axa Y (iti deviaza bila pe verticala)
  reverseY() {
    if (this.direction === Direction.NorthEast) this.direction = Direction.SouthEast;
    else if (this.direction === Direction.NorthWest) this.direction = Direction.SouthWest;
    else if (this.direction === Direction.SouthEast) this.direction = Direction.NorthEast;
    else if (this.direction === Direction.SouthWest) this.direction = Direction.NorthWest;

    this.BallGoingUp = !this.BallGoingUp;
  }

  //inverseaza bila doar pe axa X (iti deviaza bila pe orizontala)
  reverseX() {
    if (this.direction === Direction.NorthEast) this.direction = Direction.NorthWest;
    else if (this.direction === Direction.NorthWest) this.direction = Direction.NorthEast;
    else if (this.direction === Direction.SouthEast) this.direction = Direction.SouthWest;
    else if (this.direction === Direction.SouthWest) this.direction = Direction.SouthEast;
  }

  //inverseaza bila pe ambele axe (coliziuni directe sau colturi)
  reverseBoth() {
    if (this.direction === Direction.NorthEast) this.direction = Direction.SouthWest;
    else if (this.direction === Direction.NorthWest) this.direction = Direction.SouthEast;
    else if (this.direction === Direction.SouthEast) this.direction = Direction.NorthWest;
    else if (this.direction === Direction.SouthWest) this.direction = Direction.NorthEast;

    this.BallGoingUp = !this.BallGoingUp;
  }

  //functie pentru a muta paddle urile la stanga
  movePaddleLeft() {
    //verificam daca paddle ul nu depaseste limita stanga
    if(this.PaddlePosition.x > 0)
    {
      this.PaddlePosition.x--;
      if(this.BallPosition.y + 1 === this.PaddlePosition.y && 
        (this.BallPosition.x === this.PaddlePosition.x - 1 ||
        this.BallPosition.x === this.PaddlePosition.x ||
        this.BallPosition.x === this.PaddlePosition.x + 1 ||
        this.BallPosition.x === this.PaddlePosition.x + 2 ||
        this.BallPosition.x === this.PaddlePosition.x + 3
        )) {
        this.moveBallWest(); //daca bila este pe paddle, o miscam si pe ea
      }
    }

    //verificam daca paddle ul nu depaseste limita stanga
    if(this.PaddleTwoPosition.x > 0)
    {
      this.PaddleTwoPosition.x--;
      if(this.BallPosition.y - 1 === this.PaddleTwoPosition.y && 
        (this.BallPosition.x === this.PaddleTwoPosition.x - 1 ||
        this.BallPosition.x === this.PaddleTwoPosition.x ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 1 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 2 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 3
        )) {
        this.moveBallWest(); //daca bila este pe paddle, o miscam si pe ea
      }
    }

    this.checkBallCollision(); //verificam coliziunile bilei cu peretii si paddle ul pentru a evita bug uri
  }

  //functie pentru a muta paddle urile la dreapta
  movePaddleRight() {
    if(this.PaddlePosition.x + 2 < 9)
    {
      this.PaddlePosition.x++;
      if(this.BallPosition.y + 1 === this.PaddlePosition.y && 
        (this.BallPosition.x === this.PaddlePosition.x - 1 ||
        this.BallPosition.x === this.PaddlePosition.x ||
        this.BallPosition.x === this.PaddlePosition.x + 1 ||
        this.BallPosition.x === this.PaddlePosition.x + 2 ||
        this.BallPosition.x === this.PaddlePosition.x + 3
        )) {
        this.moveBallEast(); //daca bila este pe paddle, o miscam si pe ea
      }
    }

    if(this.PaddleTwoPosition.x + 2 < 9)
    {
      this.PaddleTwoPosition.x++;
      if(this.BallPosition.y - 1 === this.PaddleTwoPosition.y && 
        (this.BallPosition.x === this.PaddleTwoPosition.x - 1 ||
        this.BallPosition.x === this.PaddleTwoPosition.x ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 1 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 2 ||
        this.BallPosition.x === this.PaddleTwoPosition.x + 3
        )) {
        this.moveBallEast(); //daca bila este pe paddle, o miscam si pe ea
      }
    }

    this.checkBallCollision(); //verificam coliziunile bilei cu peretii si paddle ul pentru a evita bug uri
  }

  //functie pentru a muta bila in stanga (vest)
  moveBallWest() {
    this.BallPosition.x--;
  }

  //functie pentru a muta bila in dreapta (est)
  moveBallEast() {
    this.BallPosition.x++;
  }

  //functe pentru a muta bila in diagonala dreapta sus (nord est)
  moveBallNorthEast() {
    this.BallPosition.x++;
    this.BallPosition.y--;
  }

  //functie pentru a muta bila in diagonala stanga sus (nord vest)
  moveBallNorthWest() {
    this.BallPosition.x--;
    this.BallPosition.y--;
  }

  //functie pentru a muta bila in diagonala dreapta jos (sud est)
  moveBallSouthEast() {
    this.BallPosition.x++;
    this.BallPosition.y++;
  }

  //functie pentru a muta bila in diagonala stanga jos (sud vest)
  moveBallSouthWest() {
    this.BallPosition.x--;
    this.BallPosition.y++;
  }

  //functie pentru a obtine culoarea celulei specificate
  getCellColor(x: number, y: number): string {
    //daca arena are celula specificata ocupata, returnam culoarea
    if (this.arena[y][x] !== 0) {
      return this.arena[y][x] as string;
    }

    //in cazul in care celula nu este ocupata, afisam culoarea bilei
    //verificam daca bila ocupa celula specificata
    const px_ball = x - this.BallPosition.x;
    const py_ball = y - this.BallPosition.y;
    if (
      py_ball >= 0 &&
      py_ball < this.Ball_piece.length &&
      px_ball >= 0 &&
      px_ball < this.Ball_piece[0].length &&
      this.Ball_piece[py_ball][px_ball]
    ) {
      return this.pieceColor['Ball'];
    }

    //in cazul in care celula nu este ocupata, afisam culoarea brick urilor
    //verificam daca brick urile ocupa celula specificata
    const px_bricks = x - this.BricksPosition.x;
    const py_bricks = y - this.BricksPosition.y;
    if (
      py_bricks >= 0 &&
      py_bricks < this.Bricks_piece.length &&
      px_bricks >= 0 &&
      px_bricks < this.Bricks_piece[0].length &&
      this.Bricks_piece[py_bricks][px_bricks]
    ) {
      return this.pieceColor['Bricks'];
    }

    //in cazul in care celula nu este ocupata, afisam culoarea paddle ului
    //verificam daca paddle ul ocupa celula specificata
    const px_paddle = x - this.PaddlePosition.x;
    const py_paddle = y - this.PaddlePosition.y;
    if (
      py_paddle >= 0 &&
      py_paddle < this.Paddle_piece.length &&
      px_paddle >= 0 &&
      px_paddle < this.Paddle_piece[0].length &&
      this.Paddle_piece[py_paddle][px_paddle]
    ) {
      return this.pieceColor['Paddle'];
    }

    //in cazul in care celula nu este ocupata, afisam culoarea paddle ului
    //verificam daca paddle ul ocupa celula specificata
    const px_paddle_two = x - this.PaddleTwoPosition.x;
    const py_paddle_two = y - this.PaddleTwoPosition.y;
    if (
      py_paddle_two >= 0 &&
      py_paddle_two < this.Paddle_two_piece.length &&
      px_paddle_two >= 0 &&
      px_paddle_two < this.Paddle_two_piece[0].length &&
      this.Paddle_two_piece[py_paddle_two][px_paddle_two]
    ) {
      return this.pieceColor['Paddle'];
    }

    return '';
  }
  
  //functie pentru a (re)incepe jocul
  startGame() {
    //initializam arena cu 20 de linii si 10 coloane, puse pe 0
    this.arena = [];
    for (let i = 0; i < 20; i++) {
      this.arena.push(new Array(10).fill(0));
    }

    //initializam arena vietilor cu 1 linie si 4 coloane, puse pe 0
    this.lifeArena = [];
    for (let i = 0; i < 1; i++) {
      this.lifeArena.push(new Array(4).fill(0));
    }

    //jocul de brick breaker incepe aici
    this.playing = true; //setam variabila playing la true pentru a incepe jocul
    this.pause = false; //jocul nu mai e pe pauza
    this.spaceStart = false; //resetam tasta space pentru a putea incepe jocul din nou

    this.PaddlePosition.x = 3, this.PaddlePosition.y = 19 //pozitia initiala a paddle ului de jos
    this.PaddleTwoPosition.x = 3, this.PaddleTwoPosition.y = 0; //pozitia initiala a paddle ului de sus
    this.BricksPosition.x = 0, this.BricksPosition.y = 8; //pozitia initiala a brick urilor
    this.BallPosition.x = 4, this.BallPosition.y = 18; //pozitia initiala a bilei
    this.LifePosition.x = 0, this.LifePosition.y = 0; //pozitia initiala a vietilor

    //resetam brick urile
    for(let i = 0; i < this.Bricks_piece.length; i++)
      for(let j = 0; j < this.Bricks_piece[i].length; j++)
        this.Bricks_piece[i][j] = 1;

    //resetam vietile
    for(let i = 0; i < this.Life_piece.length; i++)
      for(let j = 0; j < this.Life_piece[i].length; j++)
        this.Life_piece[i][j] = 1;

    this.time = 300; //resetam timpul intervalului

    //obtinem un leaderboard cu top 5, reactualizam tabela la reinceperea jocului
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });

    this.message = 'Press Space to Start!'; //afisam mesajul initial
    this.points = 0; //resetam punctele
    this.direction = Direction.NorthEast; //resetam directia bilei
    this.BallGoingUp = true; //resetam directia bilei pe verticala
    this.intervalId = undefined; //resetam intervalul
  }

  //functie pentru a ne duce la pagina de start a jocului
  goToStartPage() {
    this.router.navigate(['/brickbreakertwo-start-page']);
  }

  //functie pentru a deloga utilizatorul si a l trimite la pagina de login
  onLogout() {
    this.authService.logout(); //delogam utilizatorul
    this.router.navigate(['/login']);
  }

  //functie pentru a pune jocul pe pauza sau a l relua
  togglePause() {
    if (!this.playing) return; //daca jocul s-a terminat nu facem nimic

    this.pause = !this.pause; //schimbam valoarea variabilei in functie de apasarea butonului

    if(this.pause)
      clearInterval(this.intervalId); //oprim coborarea piesei
    else
      this.startInterval() //reluam jocul
  }

  //functie pentru a verifica daca jocul a fost pierdut
  gameOver() {
    if(this.Life_piece[0][0] === 0) //daca nu mai avem vieti, jocul este incheiat
    {
      this.finalGameMessage(); //apelam functia pentru a verifica si actualiza scorul
      return true; //jocul este incheiat
    }
    else
      return false; //jocul nu este incheiat
  }

  //functie pentru a verifica daca jocul a fost castigat
  gameWon() {
    let allBricksDestroyed = true;
    for(let i = 0; i < this.Bricks_piece.length; i++)
      for(let j = 0; j < this.Bricks_piece[i].length; j++)
        if(this.Bricks_piece[i][j] !== 0)
        {
          allBricksDestroyed = false; //daca macar un brick nu este distrus, jocul nu este castigat
          break;
        }

    if(allBricksDestroyed)
    {
      this.message = 'You won!'; //afisam mesajul de castig
      this.finalGameMessage(); //apelam functia pentru a verifica si actualiza scorul
      return true; //jocul este castigat
    }
    else
      return false; //jocul nu este castigat
  }

  //functie pentru a verifica si actualiza highscore ul daca este cazul
  finalGameMessage() {
    if (this.points > this.highscore) {
      this.scoreService.updateHighScore(this.points, CURRENT_GAME_NAME).subscribe(() => {
        this.highscore = this.points;
          alert('Felicitări! Ai un nou highscore!');
      }, () => {
          alert('Eroare la salvarea scorului.');
      });
    }
  }
 
  //functie pentru a ne determina si afisa cate vieti mai are jucatorul
  getLifeArenaColor(x: number, y: number): string {
    const px = x - this.LifePosition.x;
    const py = y - this.LifePosition.y;
    if (
      py >= 0 &&
      py < this.Life_piece.length &&
      px >= 0 &&
      px < this.Life_piece[0].length &&
      this.Life_piece[py][px]
    ) {
      return this.pieceColor['Life'];
    }
    return '';

  }

  //functie pentru a permite bilei sa se miste mai repede
  moveBallFaster() {
    this.checkWall(); //verificam coliziunile bilei cu brick urile
    this.direction = this.checkBallCollision(); //verificam coliziunile bilei cu peretii si paddle ul

    this.points += 2; //marim cu doua puncte atunci cand bila de misca mai repede 

    //schimbam pozitia de miscare a bilei
    switch (this.direction) {
      case Direction.NorthEast:
        this.moveBallNorthEast();
        break;
      case Direction.NorthWest:
        this.moveBallNorthWest();
        break;
      case Direction.SouthEast:
        this.moveBallSouthEast();
        break;
      case Direction.SouthWest:
        this.moveBallSouthWest();
        break;
    }
  }
}
