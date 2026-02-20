import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ScoreService } from '../../score.service';
import { CommonModule } from '@angular/common';

const CURRENT_GAME_NAME = "Super Bricks"; //numele jocului

//enum = enumare, declarare de constante
//definim codurile tastelor
enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  SPACE = 'Space'
};

@Component({
  selector: 'app-superbricks',
  imports: [CommonModule],
  templateUrl: './superbricks.html',
  styleUrl: './superbricks.css'
})

export class Superbricks {
  constructor(private router: Router, private authService: AuthService, private scoreService: ScoreService) {}

  arena: (string | 0)[][] = []; //memoram 0 cand celula e goala, sau culoare cand nu e goala
  lifeArena: (string | 0) [][] = []; //o folosim pentru a arata utilizatorului cate vieti mai are, memoram 0 cand e goala, sau o 
                                      //culoare cand o celula e ocupata

  Walls: (string | 0)[][] = []; //memoram 0 cand celula e goala, sau culoare cand nu e goala

  Life_piece: number[][] = [
    [1, 1, 1, 1]
  ]
  
  Rocket_piece: number[][] = [
    [0, 1, 0],
    [1, 1, 1]
  ];

  LifePosition: { x: number, y: number } = {x: 0, y: 0}; //pozitia initiala a vietilor
  RocketPosition: { x: number, y: number } = {x: 4, y: 18}; //pozitia initiala rachetei
  WallsPosition: { x: number, y: number} = {x: 0, y: 0}; //pozitia initiala a zidurilor

  //definim culorile pentru fiecare piesa
  pieceColor: { [key: string]: string} = {
    Life: 'red',
    Rocket: 'blue',
    Walls: 'grey'
  };

  playing = false; //variabila care ne ajuta sa stim daca jocul este in desfasurare sau nu
  pause: boolean = false; //variabila folosita pentru a pune pauza la joc
  points = 0; //punctele din jocul curent
  spaceStart: boolean = false; //variabila care ne ajuta sa stim daca s a apasat tasta space pentru a incepe jocul
  level = 1; //nivelul curent al jocului
  username: string = ''; //memoram username ul utilizatorului
  highscore = 0; //memoram highscore ul anterior al utilizatorului
  leaderboard: { username: string, highScore: number }[] = []; //un array pentru a memora leaderboard ul
  intervalId: number | undefined; //folosit pentru a reseta intervalul cand e nevoie
  time: number = 4000; //timpul in milisecunde pentru coborarea zidurilor
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

    this.startGame(); //pornim jocul
  }

  //functie pentru a asculta evenimentele de la tastatura
  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.pause || !this.playing) return; //blocam apasarea pe taste daca jocul e pe pauza sau oprit

    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }
    
    if(!this.GameOver()) //daca jocul nu s a terminat, putem apasa pe taste
      switch (event.code) {
        case KEY_CODE.LEFT_ARROW:
          this.moveRocketLeft();
          break;
        case KEY_CODE.RIGHT_ARROW:
          this.moveRocketRight();
          break;
        case KEY_CODE.SPACE:
          if(!this.spaceStart) //daca nu s a apasat tasta space pana acum, o setam la true
          {
            this.message = ''; //stergem mesajul (Press space key to start!)
            this.startInterval(); //pornim intervalul (jocul incepe)
            this.spaceStart = true; //pentru a putea incepe jocul (tasta space a fost apasata)
          }
          else //daca s a apasat deja tasta space, atunci tragem cu racheta
          {
            this.Shoot();
            this.checkClearedRows(); //verificam daca un rand e complet si il stergem
            this.GameOver(); //verificam daca jocul s a terminat
            //aici actualizam nivelul si timpul in functie de punctele jucatorului
            let previousLevel = this.level;
            this.getLevel(); //actualizam nivelul
            if(previousLevel != this.level) //daca nivelul s-a schimbat, actualizam timpul
              this.getTime(); //actualizam timpul
            //vom reseta intervalul mai tarziu pentru a evita bug urile (intervalul se va reseta la urmatorul frame in functie de this.time)
          }
          break;
    }
  }

  startInterval() {

    if(this.intervalId !== undefined)
      clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {

      if (!this.playing || !this.spaceStart || this.GameOver() || this.checkConditionForLifeLoss())
        return; //daca jocul nu este in desfasurare oprim intervalul

      //aici actualizam nivelul si timpul in functie de punctele jucatorului
      let previousLevel = this.level;
      this.getLevel(); //actualizam nivelul
      if(previousLevel != this.level) //daca nivelul s-a schimbat, actualizam timpul
        this.getTime(); //actualizam timpul
      this.startInterval(); //resetam intervalul cu noul timp

      this.moveWallsDown(); //mutam zidurile in jos
      this.generateNewRow(); //generam un nou rand de ziduri
      this.GameOver(); //verificam daca jocul s a terminat

    }, this.time); //piesa se va misca in jos la un anumit numar de milisecunde in functie de nivel
  }

  startGame() {
    //ia highscore ul din tabela users pentru al putea verifica/actualiza
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

    //initializam zidurile cu 19 linii si 10 coloane, puse pe 0
    this.Walls = [];
    for(let i = 0; i < 19; i++) {
      this.Walls.push(new Array(10).fill(0));
    }

    //resetam vietile la inceputul jocului
    this.lifeArena = [];
    for (let i = 0; i < 1; i++) {
      this.lifeArena.push(new Array(4).fill(1));
    }

    for(let i = 0; i < this.Life_piece.length; i++)
      for(let j = 0; j < this.Life_piece[i].length; j++)
        this.Life_piece[i][j] = 1;

    this.LifePosition = {x: 0, y: 0}; //pozitia initiala a vietilor
    this.RocketPosition = {x: 4, y: 18}; //pozitia initiala a rachetei
    this.points = 0; //resetam punctele
    this.level = 1; //resetam nivelul
    this.time = 4000; //resetam timpul
    this.message = 'Press Space to start!'; //resetam mesajul
    this.playing = true; //jocul este in desfasurare
    this.spaceStart = false; //jocul nu a inceput pana nu se apasa space
    this.pause = false; //jocul nu e pus pe pauza
  }

  //functie pentru a obtine culoarea celulei specificate
  getCellColor(x: number, y: number): string {
    //daca arena are celula specificata ocupata, returnam culoarea
    if (this.arena[y][x] !== 0) {
      return this.arena[y][x] as string;
    }

    //obtinem culoare rachetei
    const px_rocket = x - this.RocketPosition.x;
    const py_rocket = y - this.RocketPosition.y;
    if (
      py_rocket >= 0 &&
      py_rocket < this.Rocket_piece.length &&
      px_rocket >= 0 &&
      px_rocket < this.Rocket_piece[0].length &&
      this.Rocket_piece[py_rocket][px_rocket]
    ) {
      return this.pieceColor['Rocket'];
    }

    //obtinem culoarea zidurilor
    const px_walls = x - this.WallsPosition.x;
    const py_walls = y - this.WallsPosition.y;
    if (
      py_walls >= 0 &&
      py_walls < this.Walls.length &&
      px_walls >= 0 &&
      px_walls < this.Walls[0].length &&
      this.Walls[py_walls][px_walls]
    ) {
      return this.pieceColor['Walls'];
    }
    //daca celula este goala, returnam un string gol
    return '';
  }

  //functie pentru a ne arata cate vieti mai are utilizatorul
  getLifeArenaColor(x: number, y: number): string {
    const px_life = x - this.LifePosition.x;
    const py_life = y - this.LifePosition.y;
    if (
      py_life >= 0 &&
      py_life < this.Life_piece.length &&
      px_life >= 0 &&
      px_life < this.Life_piece[0].length &&
      this.Life_piece[py_life][px_life]
    ) {
      return this.pieceColor['Life'];
    }
    return '';
  }

  //functia pentru a muta racheta in stanga
  moveRocketLeft() {
    if (this.RocketPosition.x > -1) {
      this.RocketPosition.x--;
    }
  }
  
  //functie pentru a muta racheta in dreapta
  moveRocketRight() {
    if (this.RocketPosition.x + this.Rocket_piece[0].length < this.arena[0].length + 1) {
      this.RocketPosition.x++;
    }
  }

  //functie pentru a trage cu racheta
  Shoot() {
    let position = this.RocketPosition.x + 1; //retinem pozitia tunului rachetei
    for(let i = this.Walls.length - 1; i >= 0; i--) //parcurgem randurile de jos in sus
      if(this.Walls[i][position] !== 0) //daca randul curent are o celula ocupata
      {
        this.Walls[i + 1][position] = this.pieceColor['Walls']; //setam celula de dedesupt pe culoarea zidului
        break; //iesim din bucla
      }
      else if(i === 0) //daca am ajuns sus si nu am gasit niciun zid
      {
        this.Walls[i][position] = this.pieceColor['Walls']; //setam celula curenta pe culoarea zidului
        break; //iesim din bucla
      }
  }

  //functie pentru a sterge ultimul rand daca e complet 
  checkClearedRows() {
    let row_occupied_position = -1; //verificam daca un rand e ocupat
    
    for(let i = this.Walls.length - 1; i >= 0; i--) //parcurgem randurile de jos in sus
    {
      let cnt = 0; //numaram cate celule sunt ocupate in randul curent
      for(let j = 0; j < this.Walls[i].length; j++)
        if(this.Walls[i][j] !== 0) //numaram celulele ocupate
          cnt++;
        
      if(cnt === 10) //daca toate celulele sunt ocupate
      {
        row_occupied_position = i; //retinem pozitia randului  
        break; //iesim din bucla
      }
    }
    if(row_occupied_position !== -1) //daca un rand e ocupat
    {
      this.points += this.getPoints(); //adaugam puncte in functie de nivel
      for(let i = 0; i < 10; i++)
        this.Walls[row_occupied_position][i] = 0; //setam randul ocupat pe 0
      this.IfNecessaryMoveRowsUp(row_occupied_position); //daca un rand e sters, mutam celelalte randuri in sus
    }
  }

  //functie pentru a verifica daca a ajuns vreun brick pe randul 18 (deasupra rachetei)
  checkConditionForLifeLoss() {
    for(let i = 0; i < this.Walls[18].length; i++) //parcurgem doar randul 18 (sau 19, daca le numerotam de la 1)
      if(this.Walls[18][i] !== 0 && this.pieceColor['Walls']) //daca gasim o celula ocupata si este de culoarea zidului
        return true; //daca gasim o celula ocupata, returnam true (pierdem o viata)
    return false; //daca nu gasim nicio celula ocupata, returnam false (nu pierdem nicio viata)
  }

  //pe langa faptul ca returnam numarul de vieti, stergem si o viata daca e cazul
  returnNumberOfLives() {
    let position = -1; //pozitia vietii care urmeaza sa fie stearsa
    for(let i = this.Life_piece[0].length - 1; i >= 0; i--) //parcurgem vietile
      if(this.Life_piece[0][i] !== 0) //daca gasim o viata
      {
        position = i; //retinem pozitia vietii care a fost stearsa
        break; //iesim din bucla
      }
    if(this.checkConditionForLifeLoss() === true) //daca un brick a ajuns pe randul 18
    {
      this.Life_piece[0][position] = 0; //stergem viata de pe pozitia retinuta
      this.resetGameRound();
      return position;
    } 
    return position + 1; 
  }

  //daca utilizatorul pierde o viata, resetam racheta si zidurile
  resetGameRound() {
    this.RocketPosition = {x: 4, y: 18};
    this.WallsPosition = {x: 0, y: 0};

    for(let i = 0; i < this.Walls.length; i++)
      for(let j = 0; j < this.Walls[i].length; j++)
        this.Walls[i][j] = 0;
  }

  //functie pentru a verifica daca jocul s-a incheiat
  GameOver() 
  {
    if(this.returnNumberOfLives() < 1) //daca nu mai avem vieti
    {
      this.finalGameMessage(); //apelam functia pentru a verifica si actualiza scorul
      return true; //jocul este incheiat
    }
    return false; //jocul continua
  }

  //functie pentru a afisa un mesaj daca utilizatorul are un nou highscore
  finalGameMessage() {
    if(this.Life_piece[0][0] === 0)
      if (this.points > this.highscore) {
        this.scoreService.updateHighScore(this.points, CURRENT_GAME_NAME).subscribe(() => {
          this.highscore = this.points;
            alert('Felicitări! Ai un nou highscore!');
        }, () => {
            alert('Eroare la salvarea scorului.');
        });
      }
  }

  //functie pentru a muta randurile mai sus atunci cand este eliminat un rand
  IfNecessaryMoveRowsUp(position: number) {
    for(let i = position; i < this.Walls.length; i++) //parcurgem randurile de jos in sus
      for(let j = 0; j < this.Walls[i].length; j++) //parcurgem coloanele
        this.Walls[i][j] = this.Walls[i + 1][j]; //mutam fiecare celula cu o linie mai sus
  }

  //functie pentru a genera un nou rand de ziduri
  generateNewRow() {

    //generam maxim 6 bucati de zid pentru ca jocul sa fie mai greu
    for(let i = 1; i <= 6; i++) {
      let randomNumber: number = Math.floor(Math.random() * 10); //generam un numar random intre 0 si 9
      this.Walls[0][randomNumber] = this.pieceColor['Walls']; //setam o celula random din prima linie a zidurilor
    }
  }

  //functie pentru a muta zidurile in jos
  moveWallsDown() {
    let row_occupied_position = -1; //verificam daca un rand e ocupat

    //in Angular break ul iese doar din bucla curenta, nu si din cea exterioara
    //asa ca vom folosi un label pentru a iesi din ambele bucle
    outerLoop:
    for(let i = this.Walls.length - 1; i >= 0; i--) //parcurgem randurile de jos in sus
      for(let j = 0; j < this.Walls[i].length; j++)
        if(this.Walls[i][j] !== 0) //daca randul curent are o celula ocupata
        {
          row_occupied_position = i; //retinem pozitia randului  
          break outerLoop; //iesim din ambele bucle
        }
       

    if(row_occupied_position !== this.Walls.length - 1) //daca un rand e ocupat si nu e pe ultima linie
    {
      for(let i = row_occupied_position + 1; i > 0; i--) //parcurgem randurile de la cel ocupat pana la primul
        for(let j = 0; j < this.Walls[i].length; j++) //parcurgem coloanele
          this.Walls[i][j] = this.Walls[i - 1][j]; //mutam fiecare celula cu o linie mai jos
      for(let i = 0; i < this.Walls[0].length; i++)
        this.Walls[0][i] = 0; //setam prima linie pe 0
    }
  }

  //functie pentru a obtine nivelul
  getLevel() {
    if (this.points < 1000)
      this.level = 1;
    else if (this.points < 2000)
      this.level = 2;
    else if (this.points < 3000)
      this.level = 3;
    else if (this.points < 4000)
      this.level = 4;
    else if (this.points < 5000)
      this.level = 5;
    else if (this.points < 6000)
      this.level = 6;
    else if (this.points < 7000)
      this.level = 7;
    else if (this.points < 8000)
      this.level = 8;
    else if (this.points >= 10000)
      this.level = 9;
  }

  //functie pentru a creste numarul de puncte in functie de nivel
  getPoints() {
    if(this.level == 1)
      return 100;
    else if(this.level == 2)
      return 200;
    else if(this.level == 3)
      return 300;
    else if(this.level == 4)
      return 400;
    else if(this.level == 5)
      return 500;
    else if(this.level == 6)
      return 600;
    else if(this.level == 7)
      return 700;
    else if(this.level == 8)
      return 800;
    else 
      return 999;
  }

  //functie pentru a seta viteza cu care se misca mingea in functie de level
  getTime() {
    if (this.level == 1)
      this.time = 4000;
    else if (this.level == 2)
      this.time = 3750;
    else if (this.level == 3)
      this.time = 3500;
    else if (this.level == 4)
      this.time = 3250;
    else if (this.level == 5)
      this.time = 3000;
    else if (this.level == 6)
      this.time = 2500;
    else if (this.level == 7)
      this.time = 2000;
    else if (this.level == 8)
      this.time = 1500;
    else if(this.level >= 9)
      this.time = 1000;
  }

  //functie pentru a redirectiona utilizatorul catre pagina de inceput a jocului
  goToStartPage() {
    this.router.navigate(['/superbricks-start-page']);
  }

  //functie pentru a deloga utilizatorul si al trimite catre pagina de login
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  //functie pentru a puse jocul pe pause/resume
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
