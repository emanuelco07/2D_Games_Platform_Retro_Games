import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ScoreService } from '../../score.service';
import { Router } from '@angular/router';

const CURRENT_GAME_NAME = "Brick Breaker"; //numele jocului

@Component({
  selector: 'app-brickbreaker-rankings',
  imports: [CommonModule],
  templateUrl: './brickbreaker-rankings.html',
  styleUrl: './brickbreaker-rankings.css'
})

export class BrickbreakerRankings {
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
