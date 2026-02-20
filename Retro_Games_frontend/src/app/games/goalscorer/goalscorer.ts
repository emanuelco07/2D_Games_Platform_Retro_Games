import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { ScoreService } from '../../score.service';

const CURRENT_GAME_NAME = "Goal Scorer"; //numele jocului

//enum = enumare, declarare de constante
//definim codurile tastelor
enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  SPACE = 'Space'
};

//ne definim directiile pentru minge
enum Direction {
  NorthEast,
  NorthWest,
  SouthEast,
  SouthWest
}

@Component({
  selector: 'app-goalscorer',
  imports: [CommonModule],
  templateUrl: './goalscorer.html',
  styleUrl: './goalscorer.css'
})
export class Goalscorer {
  constructor(private router: Router, private authService: AuthService, private scoreService: ScoreService) {}

  arena: (string | 0)[][] = []; //memoram 0 cand celula e goala, sau culoare cand nu e goala
  lifeArena: (string | 0) [][] = []; //o folosim pentru a arata utilizatorului cate vieti mai are, memoram 0 cand e goala, sau o 
                                      //culoare cand o celula e ocupata
  Life_piece: number[][] = [
    [1, 1, 1, 1]
  ] 

  Left_Wall_Piece: number[][] = [
    [1, 1, 1],
    [1, 1, 0],
    [1, 0, 0]
  ]

  Right_Wall_Piece: number[][] = [
    [1, 1, 1],
    [0, 1, 1],
    [0, 0, 1]
  ]

  Scorer_Piece: number[][] = [
    [1, 1, 1, 1]
  ]

  Ball_Piece: number[][] = [
    [1]
  ]

  Goalkeeper_Piece: number[][] = [
    [1, 1, 1]
  ]

  LifePosition: { x: number, y: number } = {x: 0, y: 0}; //pozitia de start a vietii
  Left_Wall_Position: { x: number, y: number } = {x: 0, y: 0}; //pozitia de start a peretelui din stanga
  Right_Wall_Position: { x: number, y: number } = {x: 7, y: 0}; //pozitia de start a peretelui din dreapta
  Scorer_Position: { x: number, y: number } = {x: 3, y: 19}; //pozitia de start a jucatorului
  Ball_Position: { x: number, y: number } = {x: 4, y: 18}; //pozitia de start a mingii
  Goalkeeper_Position: { x: number, y: number } = {x: 3, y: 8}; //pozitia de start a portarului

  //definim culorile pentru fiecare piesa
  pieceColor: { [key: string]: string} = {
    Scorer: 'yellow',
    Goalkeeper: '#32CD32',
    Ball: 'gray',
    Walls: 'blue',
    Life: 'red'
  };

  playing = false; //variabila care ne ajuta sa stim daca jocul este in desfasurare sau nu
  pause: boolean = false; //variabila folosita pentru a pune pauza la joc
  points = 0; //punctele din jocul curent
  spaceStart: boolean = false; //variabila care ne ajuta sa stim daca s a apasat tasta space pentru a incepe jocul
  BallGoingUp = true; //pentru a stii daca bila se duce in sus sau in jos
  moveToRight: boolean = true; //pentru a stii daca portarul se misca spre dreapta sau spre stanga
  level = 1; //nivelul curent al jocului
  username: string = ''; //numele utilizatorului conectat
  direction = Direction.NorthEast; //directia initiala a mingii
  highscore = 0; //highscore ul anterior al utilizatorului
  leaderboard: { username: string, highScore: number }[] = []; //un array pentru a memora leaderboard ul
  intervalId: number | undefined; //folosit pentru a reseta intervalul cand e nevoie
  time: number = 400; //timpul in milisecunde pentru miscaea bilei/portarului, va scadea pe masura ce nivelul creste
  message: string = ''; //mesajul de final de joc

  ngOnInit() {

    this.username = localStorage.getItem('username') || ''; //obtinem numele utilizatorului conectat

    //ia highscore ul din tabela users pentru al putea verifica/actualiza
    this.scoreService.getHighScore(CURRENT_GAME_NAME).subscribe(hs => {
      this.highscore = hs ?? 0; //primim doar numarul
    });

    //obtinem un leaderboar cu top 5
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });

    //pornim jocul (o parte din el)
    this.startGame();
  }

  //functie pentru a asculta evenimentele de la tastatura
  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.pause || !this.playing) return; //blocam apasarea pe taste daca jocul e pe pauza sau oprit

    //prevenim scroll ul paginii cand apasam pe sageti sau space
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }
    
    if(!this.gameOver()) //daca jocul nu s a terminat, putem apasa pe taste
      //putem muta paddle ul stanga dreapta, iar cand apasam space, bila se va misca mai repede
      switch (event.code) {
        case KEY_CODE.LEFT_ARROW:
          this.moveScorerLeft();
          break;
        case KEY_CODE.RIGHT_ARROW:
          this.moveScorerRight();
          break;
        case KEY_CODE.SPACE:
          if(this.gameOver()) return; //daca jocul s-a terminat nu facem nimic
          if(this.checkLifeLoss()) return; //daca am pierdut o viata nu facem nimic
          if(!this.spaceStart) //daca nu s a apasat tasta space pana acum, o setam la true
          {
            this.message = ''; //stergem mesajul
            this.startInterval(); //pornim intervalul (jocul incepe)
            this.spaceStart = true; //setam pe true pentru ca jocul sa inceapa
          }
          else //daca s a apasat deja tasta space, miscam bila mai repede
            this.moveBallFaster();
          break;
    }
  }

  //functie pentru a muta scorer ul stanga
  moveScorerLeft() {
    //verificam daca scorer ul nu depaseste limita stanga
    if(this.Scorer_Position.x > 0)
    {
      this.Scorer_Position.x--;
      if(this.Ball_Position.y + 1 === this.Scorer_Position.y && 
        (this.Ball_Position.x === this.Scorer_Position.x ||
        this.Ball_Position.x === this.Scorer_Position.x + 1 ||
        this.Ball_Position.x === this.Scorer_Position.x + 2 ||
        this.Ball_Position.x === this.Scorer_Position.x + 3
        )) {
        this.moveBallWest(); //daca bila este pe scorer, o miscam si pe ea
      }
    }
  }

  //functie pentru a muta scorer ul dreapta
  moveScorerRight() {
    //verificam daca scorer ul nu depaseste limita dreapta
    if(this.Scorer_Position.x + 3 < 9)
    {
      this.Scorer_Position.x++;
      if(this.Ball_Position.y + 1 === this.Scorer_Position.y && 
        (this.Ball_Position.x === this.Scorer_Position.x ||
        this.Ball_Position.x === this.Scorer_Position.x + 1 ||
        this.Ball_Position.x === this.Scorer_Position.x + 2 ||
        this.Ball_Position.x === this.Scorer_Position.x + 3
        )) {
        this.moveBallEast(); //daca bila este pe scorer, o miscam si pe ea
      }
    }
  }

  //functie pentru a muta bila spre stanga (vest)
  moveBallWest() {
    this.Ball_Position.x--;
  }

  //functie pentru a muta bila spre dreapta (est)
  moveBallEast() {
    this.Ball_Position.x++;
  }

  //functie pentu a muta bila in diagonala dreapta sus (nord-est)
  moveBallNorthEast() {
    this.Ball_Position.x++;
    this.Ball_Position.y--;
  }

  //functie pentu a muta bila in diagonala stanga sus (nord-vest)
  moveBallNorthWest() {
    this.Ball_Position.x--;
    this.Ball_Position.y--;
  }

  //functie pentu a muta bila in diagonala dreapta jos (sud-est)
  moveBallSouthEast() {
    this.Ball_Position.x++;
    this.Ball_Position.y++;
  }

  //functie pentu a muta bila in diagonala stanga jos (sud-vest)
  moveBallSouthWest() {
    this.Ball_Position.x--;
    this.Ball_Position.y++;
  }

  //functie pentru a porni intervalul care misca bila si portarul
  startInterval() {

    if(this.intervalId !== undefined)
      clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {

      if (!this.playing || !this.spaceStart || this.gameOver() || this.checkLifeLoss())
        return; //daca jocul nu este in desfasurare sau s-a pierdut o viata oprim intervalul

      //aici actualizam nivelul si timpul in functie de punctele jucatorului
      let previousLevel = this.level;
      this.getLevel(); //actualizam nivelul
      if(previousLevel != this.level) //daca nivelul s-a schimbat, actualizam timpul
        this.getTime(); //actualizam timpul
      this.startInterval(); //resetam intervalul cu noul timp

      this.direction = this.scorerCollision(); //verificam coliziunea cu scorer ul
      this.direction = this.GoalkeeperCollision(); //verificam coliziunea cu portarul
      this.direction = this.checkBallCollision(); //verificam coliziunile bilei cu peretii gridului
      this.direction = this.checkWallsCollision(); //verificam coliziunea cu peretii portii
      if(!this.checkGoal()) //verificam daca s a dat gol si mutam goalkeeper ul doar daca nu s a dat gol
        this.moveGoalkeeper(); //mutam portarul

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

    }, this.time); //piesa se va misca in jos la un anumit numar de milisecunde in functie de nivel
  }

  //functie pentru inceperea jocului
  startGame() {
    //Ia highscore ul din tabela users pentru al putea verifica/actualiza
    this.scoreService.getHighScore(CURRENT_GAME_NAME).subscribe(hs => {
      this.highscore = hs ?? 0; //primim doar numarul
    });

    //obtinem un leaderboar cu top 5
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });

    //inializam arena cu 20 de linii si 10 coloane, puse pe 0
    this.arena = [];
    for (let i = 0; i < 20; i++) {
      this.arena.push(new Array(10).fill(0));
    }

    //resetam vietile la inceputul jocului (initializare vector)
    this.lifeArena = [];
    for (let i = 0; i < 1; i++) {
      this.lifeArena.push(new Array(4).fill(0));
    }

    //setam vietile la inceputul jocului
    for(let i = 0; i < this.Life_piece.length; i++)
      for(let j = 0; j < this.Life_piece[i].length; j++)
        this.Life_piece[i][j] = 1;

    this.playing = true; //setam ca jocul este in desfasurare
    this.points = 0; //resetam punctele la inceputul jocului
    this.pause = false; //resetam pauza
    this.spaceStart = false; //resetam variabila pentru a putea incepe jocul
    this.message = 'Press Space to start!'; //resetam mesajul
    this.direction = Direction.NorthEast; //setam directia initiala a mingii
    this.BallGoingUp = true; //pentru a stii daca bila se duce in sus sau in jos
    this.moveToRight = true; //pentru a stii daca portarul se misca spre dreapta sau spre stanga
    this.level = 1; //resetam nivelul
    this.time = 400; //resetam timpul de miscare a bilei

    this.Left_Wall_Position = {x: 0, y: 0}; //setam pozitia peretelui din stanga
    this.Right_Wall_Position = {x: 7, y: 0}; //setam pozitia peretelui din dreapta
    this.LifePosition = {x: 0, y: 0}; //setam pozitia vietii
    this.Scorer_Position = {x: 3, y: 19}; //setam pozitia jucatorului
    this.Ball_Position = {x: 4, y: 18}; //setam pozitia mingii
    this.Goalkeeper_Position = {x: 3, y: 8}; //setam pozitia portarului

  }

  //functie pentru a obtine culoarea celulei specificate
  getCellColor(x: number, y: number): string {
    //daca arena are celula specificata ocupata, returnam culoarea
    if (this.arena[y][x] !== 0) {
      return this.arena[y][x] as string;
    }

    //in cazul in care celula nu este ocupata, afisam culoarea peretilor stanga
    //verificam daca peretele ocupa celula specificata
    const px_left_wall = x - this.Left_Wall_Position.x;
    const py_left_wall = y - this.Left_Wall_Position.y;
    if (
      py_left_wall >= 0 &&
      py_left_wall < this.Left_Wall_Piece.length &&
      px_left_wall >= 0 &&
      px_left_wall < this.Left_Wall_Piece[0].length &&
      this.Left_Wall_Piece[py_left_wall][px_left_wall]
    ) {
      return this.pieceColor['Walls'];
    }

    //in cazul in care celula nu este ocupata, afisam culoarea peretirilor dreapta
    //verificam daca peretele ocupa celula specificata
    const px_right_wall = x - this.Right_Wall_Position.x;
    const py_right_wall = y - this.Right_Wall_Position.y;
    if (
      py_right_wall >= 0 &&
      py_right_wall < this.Right_Wall_Piece.length &&
      px_right_wall >= 0 &&
      px_right_wall < this.Right_Wall_Piece[0].length &&
      this.Right_Wall_Piece[py_right_wall][px_right_wall]
    ) {
      return this.pieceColor['Walls'];
    }

    //afisam culoare mingii
    const px_ball = x - this.Ball_Position.x;
    const py_ball = y - this.Ball_Position.y;
    if (
      py_ball >= 0 &&
      py_ball < this.Ball_Piece.length &&
      px_ball >= 0 &&
      px_ball < this.Ball_Piece[0].length &&
      this.Scorer_Piece[py_ball][px_ball]
    ) {
      return this.pieceColor['Ball'];
    }

    //afisam culoare jucatorului
    const px_scorer = x - this.Scorer_Position.x;
    const py_scorer = y - this.Scorer_Position.y;
    if (
      py_scorer >= 0 &&
      py_scorer < this.Scorer_Piece.length &&
      px_scorer >= 0 &&
      px_scorer < this.Scorer_Piece[0].length &&
      this.Scorer_Piece[py_scorer][px_scorer]
    ) {
      return this.pieceColor['Scorer'];
    }

    //afisam culoare portarului
    const px_Goalkeeper = x - this.Goalkeeper_Position.x;
    const py_Goalkeeper = y - this.Goalkeeper_Position.y;
    if (
      py_Goalkeeper >= 0 &&
      py_Goalkeeper < this.Goalkeeper_Piece.length &&
      px_Goalkeeper >= 0 &&
      px_Goalkeeper < this.Goalkeeper_Piece[0].length &&
      this.Goalkeeper_Piece[py_Goalkeeper][px_Goalkeeper]
    ) {
      return this.pieceColor['Goalkeeper'];
    }

    //daca celula este goala, returnam un string gol
    return '';
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

  //functie pentru a permite utilizatorului sa se duca la pagina de start a jocului
  goToStartPage() {
    this.router.navigate(['/goalscorer-start-page']);
  }

  //functie pentru a deloga utilizatorul
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

  //functie pentru a verifica coliziunea bilei cu peretii gridului
  checkBallCollision() {
    if(this.Ball_Position.x === 0){ //verificam coliziunea cu zidul din stanga
      if(this.BallGoingUp === true) 
        return Direction.NorthEast;
      else 
        return Direction.SouthEast;
    }
    else if(this.Ball_Position.x === 9) { //verificam coliziunea cu zidul din dreapta
      if(this.BallGoingUp === true) 
        return Direction.NorthWest;
      else 
        return Direction.SouthWest;
    }
    return this.direction;
  }

  //functie pentru a vedea daca s a dat gol si a reseta anumite variabile (+marire scor)
  checkGoal() {
    if(this.Ball_Position.y === 0 && (this.Ball_Position.x > 2 && this.Ball_Position.x < 7)) //daca mingea a intrat in poarta
    {
      this.points += 10;
      this.spaceStart = false; //pentru a putea incepe jocul din nou
      clearInterval(this.intervalId); //oprim intervalul
      this.Ball_Position = {x: 4, y: 18}; //resetam pozitia bilei
      this.direction = Direction.NorthEast; //resetam directia bilei
      this.BallGoingUp = true; //resetam directia de miscare a bile
      this.Scorer_Position = {x: 3, y: 19}; //resetam pozitia jucatorului
      this.Goalkeeper_Position = {x: 3, y: 8}; //resetam pozitia portarului
      this.moveToRight = true; //resetam directia de miscare a portarului
      return true;
    }
    return false;
  }

  //functie pentru a verifica daca s-a pierdut o viata
  checkLifeLoss() {
    if(this.Ball_Position.y > 19 || this.Ball_Position.x > 9 || this.Ball_Position.x < 0) //daca bila iese in afara grid ului in partea de jos (trece pe langa scorer)
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
        this.message = 'You lost!';
        this.gameOver();
      }
      else //daca mai are viata, scadem una
      {
        this.Life_piece[0][position] = 0;
        clearInterval(this.intervalId); //oprim intervalul
        this.resetGameRound(); //resetam runda curenta
      }
      return true;
    }
    return false;
  }

  //functie pentru a reseta jocul dupa ce s a pierdut o viata
  resetGameRound() {
    this.spaceStart = false; //pentru a putea incepe jocul din nou
    this.Ball_Position = {x: 4, y: 18}; //resetam pozitia bilei
    this.direction = Direction.NorthEast; //resetam directia bilei
    this.BallGoingUp = true; //resetam directia de miscare a bile
    this.Scorer_Position = {x: 3, y: 19}; //resetam pozitia jucatorului
    this.Goalkeeper_Position = {x: 3, y: 8}; //resetam pozitia portarului
    this.moveToRight = true; //resetam directia de miscare a portarului
    this.message = 'Press Space to continue!'; //afisam mesajul pentru a continua jocul
  }

  //functie pentru incheierea jocului
  gameOver() {
    if(this.Life_piece[0][0] === 0) //daca nu mai avem vieti, jocul este incheiat
    {
      this.finalGameMessage(); //apelam functia pentru a verifica si actualiza scorul
      return true; //jocul este incheiat
    }
    else
      return false; //jocul nu este incheiat
  }

  //mesaj de final de joc si actualizare highscore daca e cazul
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

  //functie pentru verificarea coliziunii dintre minge si scorer
  scorerCollision() {
    if(this.Ball_Position.y + 1 === this.Scorer_Position.y) //verificam coliziunea cu scorer ul (pe axa y)
    {
      if(
        this.Ball_Position.x === this.Scorer_Position.x - 1 || //adaugam -1 pentru a putea prinde bila si cand loveste coltul din stanga
        this.Ball_Position.x === this.Scorer_Position.x ||
        this.Ball_Position.x === this.Scorer_Position.x + 1 ||
        this.Ball_Position.x === this.Scorer_Position.x + 2 ||
        this.Ball_Position.x === this.Scorer_Position.x + 3 ||
        this.Ball_Position.x === this.Scorer_Position.x + 4 //adaugam +4 pentru a putea prinde bila si cand loveste coltul din dreapta
      ) //verificam conexiunea cu scorer ul pe axa x
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.SouthEast)
          return Direction.NorthEast;
        else if(this.direction === Direction.SouthWest)
          return Direction.NorthWest;
      }
    }
    return this.direction; 
  }

  //functie pentru a verifica coliziunea dintre portar si minge
  GoalkeeperCollision() {
    //verificam coliziunea cu portarul daca mingea se duce in sus
    if(this.BallGoingUp === true){
      if(this.Ball_Position.y - 1 === this.Goalkeeper_Position.y) //verificam coliziunea cu portarul (pe axa y)
      {
        if(
          this.Ball_Position.x === this.Goalkeeper_Position.x - 1 || //adaugam -1 pentru a putea prinde bila si cand loveste coltul din stanga
          this.Ball_Position.x === this.Goalkeeper_Position.x ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 1 ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 2 ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 3 //adaugam +3 pentru a putea prinde bila si cand loveste coltul din dreapta
        ) //verificam conexiunea cu portarul pe axa x
        {
          this.BallGoingUp = false;
          if(this.direction === Direction.NorthEast)
            return Direction.SouthEast;
          else if(this.direction === Direction.NorthWest)
            return Direction.SouthWest;
        }
      }

      //verificam coliziunea cu portarul daca mingea loveste in stanga lateral
      if(this.Ball_Position.y === this.Goalkeeper_Position.y && this.Ball_Position.x === this.Goalkeeper_Position.x - 1)
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.NorthEast)
          return Direction.NorthWest;
        else if(this.direction === Direction.NorthWest)
          return Direction.NorthWest;
      }

      //verificam coliziunea cu portarul daca mingea loveste in dreapta lateral
      if(this.Ball_Position.y === this.Goalkeeper_Position.y && this.Ball_Position.x === this.Goalkeeper_Position.x + 3)
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.NorthEast)
          return Direction.NorthEast;
        else if(this.direction === Direction.NorthWest)
          return Direction.NorthEast;
      }
    }
    //verificam coliziunea cu portarul daca mingea se duce in jos
    else {
      if(this.Ball_Position.y + 1 === this.Goalkeeper_Position.y) //verificam coliziunea cu portarul (pe axa y)
      {
        if(
          this.Ball_Position.x === this.Goalkeeper_Position.x - 1 || //adaugam -1 pentru a putea prinde bila si cand loveste coltul din stanga
          this.Ball_Position.x === this.Goalkeeper_Position.x ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 1 ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 2 ||
          this.Ball_Position.x === this.Goalkeeper_Position.x + 3 //adaugam +3 pentru a putea prinde bila si cand loveste coltul din dreapta
        ) //verificam conexiunea cu portarul pe axa x
        {
          this.BallGoingUp = true;
          if(this.direction === Direction.SouthEast)
            return Direction.NorthEast;
          else if(this.direction === Direction.SouthWest)
            return Direction.NorthWest;
        }
      }

      //verificam coliziunea cu portarul daca mingea loveste in stanga lateral
      if(this.Ball_Position.y === this.Goalkeeper_Position.y && this.Ball_Position.x === this.Goalkeeper_Position.x - 1)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.SouthEast)
          return Direction.SouthWest;
        else if(this.direction === Direction.SouthWest)
          return Direction.SouthWest;
      }

      //verificam coliziunea cu portarul daca mingea loveste in dreapta lateral
      if(this.Ball_Position.y === this.Goalkeeper_Position.y && this.Ball_Position.x === this.Goalkeeper_Position.x + 3)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.SouthEast)
          return Direction.SouthEast;
        else if(this.direction === Direction.SouthWest)
          return Direction.SouthEast;
      }
    }

    return this.direction;
  }

  //functie pentru a verifica coliziunea bilei cu peretii portii
  checkWallsCollision() {

    if(this.BallGoingUp === true) //verificam coliziunea cu peretii doar daca bila se duce in sus
    {
      //verificam coliziunea cu peretele din stanga
      if(this.Ball_Position.y === this.Left_Wall_Position.y + 3 && this.Ball_Position.x === 0)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest || this.direction === Direction.NorthEast)
          return Direction.SouthEast;
      }
      else if(this.Ball_Position.y === this.Left_Wall_Position.y + 3 && this.Ball_Position.x === 1)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest)
          return Direction.SouthEast;
      }
      else if(this.Ball_Position.y === this.Left_Wall_Position.y + 2 && this.Ball_Position.x === 1)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest || this.direction === Direction.NorthEast)
          return Direction.SouthEast;
      }
      else if(this.Ball_Position.y === this.Left_Wall_Position.y + 2 && this.Ball_Position.x === 2)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest)
          return Direction.SouthEast;
      }
      else if(this.Ball_Position.y === this.Left_Wall_Position.y + 1 && this.Ball_Position.x === 2)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest || this.direction === Direction.NorthEast)
          return Direction.SouthEast;
      }
      else if(this.Ball_Position.y === this.Left_Wall_Position.y + 1 && this.Ball_Position.x === 3)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthWest)
          return Direction.SouthEast;
      } 
      else if(this.Ball_Position.y === this.Left_Wall_Position.y && this.Ball_Position.x === 3)
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.NorthWest || this.direction === Direction.NorthEast)
          return Direction.NorthEast; //pentru ca bila sa intre in poarta
      }

      //verificam coliziunea cu peretele din dreapta
      if(this.Ball_Position.y === this.Right_Wall_Position.y + 3 && this.Ball_Position.x === 9)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast || this.direction === Direction.NorthWest)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y + 3 && this.Ball_Position.x === 8)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y + 2 && this.Ball_Position.x === 8)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast || this.direction === Direction.NorthWest)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y + 2 && this.Ball_Position.x === 7)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y + 1 && this.Ball_Position.x === 7)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast || this.direction === Direction.NorthWest)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y + 1 && this.Ball_Position.x === 6)
      {
        this.BallGoingUp = false;
        if(this.direction === Direction.NorthEast)
          return Direction.SouthWest;
      }
      else if(this.Ball_Position.y === this.Right_Wall_Position.y && this.Ball_Position.x === 6)
      {
        this.BallGoingUp = true;
        if(this.direction === Direction.NorthEast || this.direction === Direction.NorthWest)
          return Direction.NorthWest; //pentru ca bila sa intre in poarta
      }
    }
    return this.direction;
  }

  //functie pentru a misca portarul in intervalul [3, 7]
  moveGoalkeeper() {
    if (this.moveToRight) {
      if (this.Goalkeeper_Position.x >= 5) {
        this.moveToRight = false;
        this.Goalkeeper_Position.x--;
      } else {
        this.Goalkeeper_Position.x++;
      }
    } else {
      if (this.Goalkeeper_Position.x <= 2) {
        this.moveToRight = true;
        this.Goalkeeper_Position.x++;
      } else {
        this.Goalkeeper_Position.x--;
      }
    }
  }

  //functie pentru a misca bila mai repede cand se apasa tasta space
  moveBallFaster() {
    this.direction = this.scorerCollision(); //verificam coliziunea cu scorer ul
    this.direction = this.GoalkeeperCollision(); //verificam coliziunea cu portarul
    this.direction = this.checkBallCollision(); //verificam coliziunile bilei cu peretii gridului
    this.direction = this.checkWallsCollision(); //verificam coliziunea cu peretii portii
    this.checkGoal(); //verificam daca s a dat gol
    this.checkLifeLoss(); //verificam daca am pierdut o viata

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

  //functie pentru a seta nivelul in functie de punctele jucatorului
  getLevel() {
    if (this.points < 50)
      this.level = 1;
    else if (this.points < 100)
      this.level = 2;
    else if (this.points < 150)
      this.level = 3;
    else if (this.points < 200)
      this.level = 4;
    else if (this.points < 250)
      this.level = 5;
    else if (this.points < 300)
      this.level = 6;
    else if (this.points >= 300)
      this.level = 7;
  }

  //functie pentru a seta viteza cu care se misca mingea in functie de level
  getTime() {
    if (this.level == 1)
      this.time = 400;
    else if (this.level == 2)
      this.time = 350;
    else if (this.level == 3)
      this.time = 300;
    else if (this.level == 4)
      this.time = 250;
    else if (this.level == 5)
      this.time = 200;
    else if (this.level == 6)
      this.time = 150;
    else if (this.level >= 7)
      this.time = 50;
  }
}