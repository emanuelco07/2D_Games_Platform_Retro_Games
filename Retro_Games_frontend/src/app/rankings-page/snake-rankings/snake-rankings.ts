import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScoreService } from '../../score.service';
import { Router } from '@angular/router';

const CURRENT_GAME_NAME = "Snake"; //numele jocului

@Component({
  selector: 'app-snake-rankings',
  imports: [CommonModule],
  templateUrl: './snake-rankings.html',
  styleUrl: './snake-rankings.css'
})

export class SnakeRankings {
  constructor(private scoreService: ScoreService, private router: Router) {}
  
  rankings: { username: string, highScore: number }[] = []; //un array pentru a memora clasamentul total

  ngOnInit() {
    //obtinem clasamentul
    this.scoreService.getRankings(CURRENT_GAME_NAME).subscribe(rk => {
      this.rankings = rk;
    });
  }

  //metoda pentru a ne intoarce pe pagina cu toate clasamentele
  goToRankingsPage() {
    this.router.navigate(['/rankings-page']);
  }
}
