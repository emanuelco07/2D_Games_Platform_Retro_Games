import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ScoreService } from '../../score.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

//enum = enumare, declarare de constante
//definim codurile tastelor
enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  SPACE = 'Space'
};

const CURRENT_GAME_NAME = "Tetris"; //numele jocului, ne va ajuta cand vom dori sa obtinem leaderboard ul

@Component({
  selector: 'app-tetris',
  imports: [CommonModule],
  templateUrl: './tetris.html',
  styleUrl: './tetris.css'
})
export class Tetris {

  arena: (string | 0)[][] = []; //memoram 0 cand celula e goala, sau culoare cand nu e goala
  nextPieceArena: (string | 0)[][] = []; //memoram 0 cand celula e goala, sau culoare cand nu e goala

  T_piece: number[][] = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0]
  ]

  O_piece: number[][] = [
    [1, 1],
    [1, 1]
  ]

  I_piece: number[][] = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  I_piece_rotation_2: number[][] = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0]
  ]

  S_piece: number[][] = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ]

  Z_piece: number[][] = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]

  L_piece: number[][] = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]

  J_piece: number[][] = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]

  //definim culorile pentru fiecare tip de piesa
  pieceColors: { [key: string]: string } = {
    T: 'purple',
    O: 'yellow',
    I: 'cyan',
    S: 'red',
    Z: 'green',
    L: 'orange',
    J: 'hotpink'
  };

  //piesa curenta
  currentPiece: number[][] = [];
  currentPieceColor: string = '';
  currentPiecePosition: { x: number, y: number } = { x: 0, y: 0 };

  //piesa pe care o vom folosi in functia generateRandomPiece() pentru a genera o piesa noua
  workingPiece: number[][] = [];
  workingPieceColor: string = '';
  workingPiecePosition: { x: number, y: number } = { x: 0, y: 0 };

  //piesa urmatoare
  nextPiece: number[][] = [];
  nextPieceColor: string = '';
  nextPiecePosition: { x: number, y: number } = { x: 0, y: 0 };

  piecesFrequency: number[] = [0, 0, 0, 0, 0, 0, 0]; //frecventa pieselor, pentru a nu genera aceeasi piesa de doua ori la rand
  I_pieceRotated: boolean = false; //ne va ajuta sa rotim piesa de I corect in 2 moduri

  playing = false; //variabila care ne ajuta sa stim daca jocul este in desfasurare sau nu
  pause: boolean = false; //variabila folosita pentru a pune pauza la joc
  points = 0; //punctele din jocul curent
  level = 1; //nivelul jocului
  linesCleared = 0; //numarul de linii golite in jocul curent (in functie de asta vom creste nivelul)
  message = ''; //mesajul de final de joc
  time = 830; //timpul in milisecunde pentru a muta piesa in jos (initial 830ms, dar se va reduce pe masura ce creste nivelul)

  username: string = ''; //numele utilizatorului conectat
  highscore = 0; //highscore ul curent al utilizatorului conectat
  leaderboard: { username: string, highScore: number }[] = []; //un array pentru a memora leaderboard ul

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

    //inializam arena cu 20 de linii si 10 coloane, puse pe 0
    this.arena = [];
    for (let i = 0; i < 20; i++) {
      this.arena.push(new Array(10).fill(0));
    }

    //initializam nextPieceArena cu 4 linii si 4 coloane, puse pe 0
    this.nextPieceArena = [];
    for (let i = 0; i < 4; i++) {
      this.nextPieceArena.push(new Array(4).fill(0));
    }

    //jocul de tetris incepe aici
    this.playing = true; //setam variabila playing la true pentru a incepe jocul

    //generam prima piesa
    this.generateRandomPiece();
    this.currentPiece = this.workingPiece;
    this.currentPieceColor = this.workingPieceColor;
    this.currentPiecePosition = this.workingPiecePosition;

    //generam urmatoarea piesa
    this.generateRandomPiece();
    this.nextPiece = this.workingPiece;
    this.nextPieceColor = this.workingPieceColor;
    this.nextPiecePosition = this.workingPiecePosition;

    this.startInterval(); //pentru a ne porni intervalul (jocul)
  }

  startInterval() {

    if(this.intervalId !== undefined)
      clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {

      if (!this.playing)
        return; //daca jocul nu este in desfasurare oprim intervalul

      //verificam daca piesa curenta a ajuns la capatul arenei sau s a lovit de o alta piesa
      if (this.checkCollision()) {
        this.colorArena(); //coloram arena cu piesa curenta
        this.clearFullRows(); //verificam daca sunt randuri pline si le golim
        this.getTime(); //pentru a obtine viteza de deplasare a pieselor in functie de nivel
        this.startInterval(); //repornim intervalul (in caz ca nivelul s a schimbat)

        //atribuim piesei curente valoarea urmatoarei piese, urmand sa ne generam alta
        this.currentPiece = this.nextPiece;
        this.currentPieceColor = this.nextPieceColor;
        this.currentPiecePosition = this.nextPiecePosition;

        this.generateRandomPiece(); //generam o noua piesa
        this.nextPiece = this.workingPiece;
        this.nextPieceColor = this.workingPieceColor;
        this.nextPiecePosition = this.workingPiecePosition;

        if (this.currentPiece === this.I_piece) //verificam daca piesa curenta este I pentru a reseta numarul de rotiri (trebuie pus aici pentru resetam doar cand piesa e afisata iar)
          this.I_pieceRotated = false; //resetam numarul de rotiri pentru piesa I

        //verificam daca jocul s a incheiat
        if (this.gameOver()) {
          this.message = 'You lost!'; //setam mesajul de final de joc
          this.playing = false; //daca jocul s a incheiat oprim intervalul pentru a nu mai genera nicio piesa
          clearInterval(this.intervalId); //oprim intervalul la Game Over
        }
      }
      else
        this.movePieceDown(); //daca nu s a lovit de nimic, mutam piesa in jos
    }, this.time); //piesa se va misca in jos la un anumit numar de milisecunde in functie de nivel
  }

  //functie pentru a asculta evenimentele de la tastatura
  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.pause || !this.playing) return; //blocam apasarea pe taste daca jocul e pe pauza sau oprit

    //blocam scroll-ul paginii cand apasam pe sageti
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowLeft' ||
      event.code === 'ArrowRight' ||
      event.code === 'Space'
    ) {
      event.preventDefault();
    }

    switch (event.code) {
      case KEY_CODE.LEFT_ARROW:
        if (this.checkDistanceToLeftWall() && !this.checkCollision() && !this.checkCollisionLeft())
          this.movePieceLeft() //mutam piesa in stanga (daca are loc si daca nu exista coliziune)
        break;
      case KEY_CODE.RIGHT_ARROW:
        if (this.checkDistanceToRightWall() && !this.checkCollision() && !this.checkCollisionRight())
          this.movePieceRight(); //mutam piesa in dreapta (daca are loc si daca nu exista coliziune)
        break;
      case KEY_CODE.DOWN_ARROW:
        if (!this.checkCollision()) {
          this.points++; //incrementam punctele cand mutam piesa in jos
          this.movePieceDown(); //mutam piesa in jos daca nu se loveste de nimic
        }
        break;
      case KEY_CODE.UP_ARROW:
        if (!this.checkCollision())
          this.movePieceClockwise(); //rotim piesa in sensul acelor de ceasornic (daca are loc si daca nu exista coliziune)
        break;
      case KEY_CODE.SPACE:
        if (!this.checkCollision()) //verificam coliziuneea totusi, pentru siguranta
          this.HardDrop(); //implementare hard drop la apasarea tastei space
        break;
      default:
        break;
    }
  }

  //functie pentru a muta piesa in jos
  movePieceDown() {
    this.currentPiecePosition.y++;
  }

  //functie pentru a muta piesa in stanga
  movePieceLeft() {
    this.currentPiecePosition.x--;
  }

  //functie pentru a muta piesa in dreapta
  movePieceRight() {
    this.currentPiecePosition.x++;
  }

  //functie pentru a implementa hard drop ul
  HardDrop() {
    while (!this.checkCollision()) {
      this.points += 2; //crestem cu 2 puncte per celula la hard drop
      this.movePieceDown();
    }
  }

  //functie pentru a roti piesa in sensul acelor de ceasornic
  movePieceClockwise() {
    let returnToOriginal: number[][] = this.currentPiece; //salvam piesa curenta pentru a o putea compara mai tarziu
    let copyCurrentPiece: number[][] = [];

    if (this.currentPiece !== this.O_piece) { //piesa O nu poate fi rotita

      if (this.currentPiece === this.I_piece || this.currentPiece === this.I_piece_rotation_2) { //daca piesa curenta este I, rotim in functie de numarul de rotiri
        if (this.I_pieceRotated === false) {
          this.currentPiece = this.I_piece_rotation_2;
          this.I_pieceRotated = true; //setam ca piesa a fost rotita
        } else {
          this.currentPiece = this.I_piece;
          this.I_pieceRotated = false; //setam ca piesa fiind adusa la forma initiala
        }
        copyCurrentPiece = this.currentPiece; //copiem piesa curenta pentru a o
      }
      else {
        let piecelength = this.currentPiece.length;
        //initializam matricea de copiere cu 0
        for (let i = 0; i < piecelength; i++) {
          copyCurrentPiece.push(new Array(piecelength).fill(0));

        }
        for (let x = 0; x < piecelength; x++)
          for (let y = 0; y < piecelength; y++) {
            copyCurrentPiece[y][piecelength - x - 1] = this.currentPiece[x][y];
          }
      }

      this.currentPiece = copyCurrentPiece; //inlocuim piesa curenta cu copia ei rotita
      if (this.checkCollision()) { //daca piesa se loveste de ceva, revenim la piesa initiala
        this.currentPiece = returnToOriginal;
      }
    }
  }

  //functie pentru a obtine culoarea celulei specificate
  getCellColor(x: number, y: number): string {
    //daca arena are celula specificata ocupata, returnam culoarea
    if (this.arena[y][x] !== 0) {
      return this.arena[y][x] as string;
    }

    //in cazul in care celula nu este ocupata, afisam culoarea piesei curente
    //verificam daca piesa curenta ocupa celula specificata
    const px = x - this.currentPiecePosition.x;
    const py = y - this.currentPiecePosition.y;
    if (
      py >= 0 &&
      py < this.currentPiece.length &&
      px >= 0 &&
      px < this.currentPiece[0].length &&
      this.currentPiece[py][px]
    ) {
      return this.currentPieceColor;
    }
    return '';
  }

  //returnam culoarea piesei urmatoare pentru a o afisa in nextPieceArena
  getNextPieceColor(x: number, y: number): string {
    //in cazul in care celula nu este ocupata, afisam culoarea piesei curente
    //verificam daca piesa curenta ocupa celula specificata
    let px = x - 0; //nextPiecePosition.x este 0, deoarece nextPieceArena este pozitionata in coltul stanga sus
    const py = y - 1; //nextPiecePosition.y este 1, deoarece nextPieceArena este pozitionata pe a doua linie

    if (this.nextPiece == this.O_piece)
      px--; //daca piesa urmatoare este O, trebuie sa o mutam cu 1 la stanga pentru a fi centrata

    if (
      py >= 0 &&
      py < this.nextPiece.length &&
      px >= 0 &&
      px < this.nextPiece[0].length &&
      this.nextPiece[py][px]
    ) {
      return this.nextPieceColor;
    }
    return '';
  }

  //functie pentru a verifica daca piesa s-a lovit de ceva si o putem aseza
  checkCollision() {
    for (let py = 0; py < this.currentPiece.length; py++)
      for (let px = 0; px < this.currentPiece[py].length; px++) {
        if (this.currentPiece[py][px]) { //daca celula curenta a piesei este ocupata
          const x = this.currentPiecePosition.x + px;
          const y = this.currentPiecePosition.y + py;

          if (y + 1 >= this.arena.length)
            return true; //verificam daca celula este in afara arenei (inferior)

          if (x < 0)
            return true; //verificam daca celula este in afara arenei (stanga)

          if (x >= this.arena[0].length)
            return true; //verificam daca celula este in afara arenei (dreapta)

          if (y < 0)
            return true; //verificam daca celula este in afara arenei (superior)

          //mai jos vom verifica daca celula este ocupata de o alta piesa
          if (y + 1 < this.arena.length)
            if (this.arena[y + 1][x] !== 0)
              return true; //verificam daca celula de sub piesa este ocupata de o alta piesa
        }
      }
    return false; //daca nu s a intamplat nimic, piesa poate continua sa se miste
  }

  //functie pentru a verifica daca piesa s a lovit de ceva in stanga
  checkCollisionLeft() {
    for (let py = 0; py < this.currentPiece.length; py++)
      for (let px = 0; px < this.currentPiece[py].length; px++) {
        if (this.currentPiece[py][px]) { //daca celula curenta a piesei este ocupata
          const x = this.currentPiecePosition.x + px;
          const y = this.currentPiecePosition.y + py;

          if (x - 1 >= 0)
            if (this.arena[y][x - 1] !== 0)
              return true; //verificam daca celula din stanga este ocupata de o alta piesa
        }
      }
    return false; //daca nu s a intamplat nimic, piesa poate continua sa se miste
  }

  //functie pentru a verifica daca piesa s a lovit de ceva in dreapta
  checkCollisionRight() {
    for (let py = 0; py < this.currentPiece.length; py++)
      for (let px = 0; px < this.currentPiece[py].length; px++) {
        if (this.currentPiece[py][px]) { //daca celula curenta a piesei este ocupata
          const x = this.currentPiecePosition.x + px;
          const y = this.currentPiecePosition.y + py;

          if (x + 1 < this.arena[0].length)
            if (this.arena[y][x + 1] !== 0)
              return true; //verificam daca celula din dreapta este ocupata de o alta piesa
        }
      }
    return false; //daca nu s a intamplat nimic, piesa poate continua sa se miste
  }

  //functie pentru a verifica distanta pana la peretele din stanga
  //in momentul in care rotim o piesa matricea arata ceva de genul:
  // 0 0 1
  // 0 1 1
  // 0 1 0
  //ca sa se poata apropia maxim de peretele din stanga
  checkDistanceToLeftWall() {
    //parcurgem matricea pe coloane, de aceea la currentPiecePosition.x adaugam py
    //py este coloana curenta, px este linia curenta
    for (let py = 0; py < this.currentPiece.length; py++)
      for (let px = 0; px < this.currentPiece[py].length; px++) {
        if (this.currentPiece[px][py] !== 0) //daca celula curenta a piesei este ocupata
          return this.currentPiecePosition.x + py > 0; //verificam daca piesa se poate apropia de peretele din stanga
      }
    return true; //daca nu s-a intamplat nimic, piesa se poate apropia de peretele din stanga
  }

  //similar functie de mai sus, dar pentru peretele din dreapta
  checkDistanceToRightWall() {
    //parcurgem matricea pe coloane, de aceea la currentPiecePosition.x adaugam py
    //py este coloana curenta, px este linia curenta
    for (let py = this.currentPiece.length - 1; py >= 0; py--)
      for (let px = this.currentPiece[py].length - 1; px >= 0; px--) {
        if (this.currentPiece[px][py] !== 0) //daca celula curenta a piesei este ocupata
          return this.currentPiecePosition.x + py < this.arena[0].length - 1; //verificam daca piesa se poate apropia de peretele din dreapta
      }
    return true; //daca nu s-a intamplat nimic, piesa se poate apropia de peretele din dreapta
  }

  //functie pentru a golii randurile daca sunt pline
  clearFullRows() {
    let contor_for_lines = 0; //contor pentru liniile golite

    for (let i = this.arena.length - 1; i >= 0;) {
      if (!this.arena[i].includes(0)) { //daca randul este plin (nu contine 0)
        this.arena.splice(i, 1); //eliminam randul plin (i - indicele randului, 1 - numarul de randuri eliminate incepand de la i)
        this.arena.unshift(new Array(10).fill(0)); //adaugam un rand nou, gol, la inceputul arenei
        //am modificat sa nu mai scrie newRow pentru ca mi se suprapuneau piesele
        contor_for_lines++; //incrementam contorul pentru liniile golite
      }
      else
        i--; //facem asta pentru ca atunci cand sunt 2 linii una langa alta nu mi le sterge pe ambele
    }

    this.linesCleared += contor_for_lines; //incrementam numarul de linii golite in jocul curent
    this.level = Math.floor(this.linesCleared / 10) + 1; //nivelul creste cu 1 la fiecare 10 linii golite

    //se pot goli maxim 4 randuri odata, deci verificam doar pentru acestea
    if (contor_for_lines == 1)
      this.points += 100 * this.level; //daca am golit un rand, adaugam 100 de puncte pentru fiecare rand golit, in functie de nivel
    else if (contor_for_lines == 2)
      this.points += 300 * this.level; //daca am golit 2 randuri, adaugam 300 de puncte pentru fiecare rand golit, in functie de nivel
    else if (contor_for_lines == 3)
      this.points += 500 * this.level; //daca am golit 3 randuri, adaugam 500 de puncte pentru fiecare rand golit, in functie de nivel
    else if (contor_for_lines == 4)
      this.points += 800 * this.level; //daca am golit 4 randuri, adaugam 800 de puncte pentru fiecare rand golit, in functie de nivel
    else
      this.points += 0; //daca nu am golit niciun rand, nu adaugam puncte
  }


  //functie pentru a seta viteza cu care coboara piesele in functie de level
  getTime() {
    if (this.level == 1)
      this.time = 830;
    else if (this.level == 2)
      this.time = 700;
    else if (this.level == 3)
      this.time = 600;
    else if (this.level == 4)
      this.time = 500;
    else if (this.level == 5)
      this.time = 400;
    else if (this.level == 6)
      this.time = 300;
    else if (this.level == 7)
      this.time = 200;
    else if (this.level == 8)
      this.time = 150;
    else if (this.level == 9)
      this.time = 100;
    else if (this.level == 10)
      this.time = 80;
    else
      this.time = 50;
  }

  //functie pentru a colora arena cu piesa curenta
  colorArena() {
    for (let py = 0; py < this.currentPiece.length; py++)
      for (let px = 0; px < this.currentPiece[py].length; px++) {
        if (this.currentPiece[py][px]) { //daca celula curenta a piesei este ocupata
          const x = this.currentPiecePosition.x + px;
          const y = this.currentPiecePosition.y + py;

          if (y >= 0 && y < this.arena.length && x >= 0 && x < this.arena[0].length)
            this.arena[y][x] = this.currentPieceColor; //coloram celula din arena cu culoarea piesei curente
        }
      }
  }

  //functie pentru a genera o piesa random (plus culoare si pozitia)
  generateRandomPiece() {

    //mai sus avem un array cu frecventa pieselor
    let randomIndex = Math.floor(Math.random() * 7);

    //daca exista cel putin o piesa care nu a fost generata
    if (this.piecesFrequency.includes(0)) {
      //cautam o piesa care nu a fost generata
      //verificam daca piesa a fost deja generata
      //daca a fost generata, generam alta
      while (this.piecesFrequency[randomIndex] == 1) {
        randomIndex = Math.floor(Math.random() * 7);
      }
    }
    else {
      //daca toate piesele au fost generate, resetam frecventa si generam o piesa random
      this.piecesFrequency = [0, 0, 0, 0, 0, 0, 0];
      randomIndex = Math.floor(Math.random() * 7);
    }

    //setam nextPiece, nextPieceColor si nextPiecePosition in functie de piesa generata folosin workingPiece
    switch (randomIndex) {
      case 0:
        this.workingPiece = this.T_piece;
        this.workingPieceColor = this.pieceColors['T'];
        this.workingPiecePosition = { x: 3, y: 0 };
        this.piecesFrequency[0] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 1:
        this.workingPiece = this.O_piece;
        this.workingPieceColor = this.pieceColors['O'];
        this.workingPiecePosition = { x: 4, y: 0 };
        this.piecesFrequency[1] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 2:
        this.workingPiece = this.I_piece;
        this.workingPieceColor = this.pieceColors['I'];
        this.workingPiecePosition = { x: 3, y: -1 }; //pozitia initiala a piesei I este putin mai sus, deoarece e diferita de celelalte piese
        this.piecesFrequency[2] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 3:
        this.workingPiece = this.S_piece;
        this.workingPieceColor = this.pieceColors['S'];
        this.workingPiecePosition = { x: 3, y: 0 };
        this.piecesFrequency[3] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 4:
        this.workingPiece = this.Z_piece;
        this.workingPieceColor = this.pieceColors['Z'];
        this.workingPiecePosition = { x: 3, y: 0 };
        this.piecesFrequency[4] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 5:
        this.workingPiece = this.L_piece;
        this.workingPieceColor = this.pieceColors['L'];
        this.workingPiecePosition = { x: 3, y: 0 };
        this.piecesFrequency[5] = 1; //marcam piesa ca fiind generata si folosita
        break;
      case 6:
        this.workingPiece = this.J_piece;
        this.workingPieceColor = this.pieceColors['J'];
        this.workingPiecePosition = { x: 3, y: 0 };
        this.piecesFrequency[6] = 1; //marcam piesa ca fiind generata si folosita
        break;
    }
  }

  //functie pentru a verifica daca jocul s a incheiat
  gameOver() {
    for (let px = 0; px < this.currentPiece.length; px++)
      for (let py = 0; py < this.currentPiece[px].length; py++) {
        const x = this.currentPiecePosition.x + px;
        const y = this.currentPiecePosition.y + py;
        if ((x >= 0 && x < 10) && (y >= 0 && y < 20))
          if (this.currentPiece[px][py])
            if (this.arena[y][x] !== 0) {
              //daca piesa curenta se suprapune cu o alta piesa, incheiem jocul si actualizam highscore ul daca e necesar
              if (this.points > this.highscore) {
                this.scoreService.updateHighScore(this.points, CURRENT_GAME_NAME).subscribe(() => {
                  this.highscore = this.points;
                  alert('Felicitări! Ai un nou highscore!');
                }, () => {
                  alert('Eroare la salvarea scorului.');
                });
              }
              return true;
            }
      }
    return false; //daca piesa curenta nu se suprapune cu o alta piesa, jocul continua
  }

  //folosim aceasta functie pentru a reinitializa jocul 
  startGame() {
    //inializam arena cu 20 de linii si 10 coloane, puse pe 0
    this.arena = [];
    for (let i = 0; i < 20; i++) {
      this.arena.push(new Array(10).fill(0));
    }

    //initializam nextPieceArena cu 4 linii si 4 coloane, puse pe 0
    this.nextPieceArena = [];
    for (let i = 0; i < 4; i++) {
      this.nextPieceArena.push(new Array(4).fill(0));
    }

    //jocul de tetris incepe aici
    this.playing = true; //setam variabila playing la true pentru a incepe jocul
    this.pause = false; //jocul nu mai e pe pauza
    this.level = 1;
    this.startInterval() //pornim intervalul pentru a cobori piesele

    //generam prima piesa
    this.generateRandomPiece();
    this.currentPiece = this.workingPiece;
    this.currentPieceColor = this.workingPieceColor;
    this.currentPiecePosition = this.workingPiecePosition;

    //generam urmatoarea piesa
    this.generateRandomPiece();
    this.nextPiece = this.workingPiece;
    this.nextPieceColor = this.workingPieceColor;
    this.nextPiecePosition = this.workingPiecePosition;

    this.message = '';
    this.points = 0;

    //obtinem un leaderboar cu top 5, reactualizam tabela la reinceperea jocului
    this.scoreService.getLeaderboard(CURRENT_GAME_NAME).subscribe(lb => {
      this.leaderboard = lb;
    });
  }

  //functie pentru a pune jocul pe pauza
  togglePause()
  {
    if (!this.playing) return; //daca jocul s-a terminat nu facem nimic

    this.pause = !this.pause; //schimbam valoarea variabilei in functie de apasarea butonului

    if(this.pause)
      clearInterval(this.intervalId); //oprim coborarea piesei
    else
      this.startInterval() //reluam jocul
  }

  //functie pentru a ne duce la pagina de start a jocului
  goToStartPage() {
    this.router.navigate(['/tetris-start-page']);
  }

  //functie pentru a deloga utilizatorul si al trimite catre pagina de login
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
