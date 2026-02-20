import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPage } from './start-page/start-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { GamesPage } from './games-page/games-page';
import { SnakeStartPage } from './games/snake/snake-start-page/snake-start-page';
import { Snake1 } from './games/snake/snake1/snake1';
import { Snake3 } from './games/snake/snake3/snake3';
import { SnakeZeroWall } from './games/snake/snake-zero-wall/snake-zero-wall';
import { Snake2 } from './games/snake/snake2/snake2';
import { TetrisStartPage } from './games/tetris/tetris-start-page/tetris-start-page';
import { Tetris } from './games/tetris/tetris';
import { BrickbreakerStartPage } from './games/brickbreaker/brickbreaker-start-page/brickbreaker-start-page';
import { Brickbreaker1 } from './games/brickbreaker/brickbreaker1/brickbreaker1';
import { Brickbreaker2 } from './games/brickbreaker/brickbreaker2/brickbreaker2';
import { Brickbreaker3 } from './games/brickbreaker/brickbreaker3/brickbreaker3';

import { BrickbreakerHeart } from './games/brickbreaker/brickbreaker-heart/brickbreaker-heart';
import { BrickbreakertwoStratPage } from './games/brickbreakertwo/brickbreakertwo-strat-page/brickbreakertwo-strat-page';
import { Brickbreakertwo1 } from './games/brickbreakertwo/brickbreakertwo1/brickbreakertwo1';
import { Brickbreakertwo2 } from './games/brickbreakertwo/brickbreakertwo2/brickbreakertwo2';
import { Brickbreakertwo3 } from './games/brickbreakertwo/brickbreakertwo3/brickbreakertwo3';
import { BrickbreakertwoHeart } from './games/brickbreakertwo/brickbreakertwo-heart/brickbreakertwo-heart';
import { GoalscorerStratPage } from './games/goalscorer/goalscorer-strat-page/goalscorer-strat-page';
import { Goalscorer } from './games/goalscorer/goalscorer';
import { Superbricks } from './games/superbricks/superbricks';
import { SuperbricksStartPage } from './games/superbricks/superbricks-start-page/superbricks-start-page';
import { RankingsPage } from './rankings-page/rankings-page';
import { SnakeRankings } from './rankings-page/snake-rankings/snake-rankings';
import { TetrisRankings } from './rankings-page/tetris-rankings/tetris-rankings';
import { BrickbreakerRankings } from './rankings-page/brickbreaker-rankings/brickbreaker-rankings';
import { BrickbreakertwoRankings } from './rankings-page/brickbreakertwo-rankings/brickbreakertwo-rankings';
import { GoalscorerRankings } from './rankings-page/goalscorer-rankings/goalscorer-rankings';
import { SuperbricksRankings } from './rankings-page/superbricks-rankings/superbricks-rankings';
import { AboutSnake } from './about-games/about-snake/about-snake';
import { AboutTetris } from './about-games/about-tetris/about-tetris';
import { AboutBrickbreaker } from './about-games/about-brickbreaker/about-brickbreaker';
import { AboutBrickbreakertwo } from './about-games/about-brickbreakertwo/about-brickbreakertwo';
import { AboutGoalscorer } from './about-games/about-goalscorer/about-goalscorer';
import { AboutSuperbricks } from './about-games/about-superbricks/about-superbricks';
import { Chat } from './chat/chat';
import { ReportBugs } from './report-bugs/report-bugs';

export const routes: Routes = [
    {path: '', redirectTo: '/start-page', pathMatch: 'full' },
    {path: 'start-page', component: StartPage},
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'games-page', component: GamesPage},
    {path: 'snake-start-page', component: SnakeStartPage},
    {path: 'snake1', component: Snake1},
    {path: 'snake2', component: Snake2},
    {path: 'snake3', component: Snake3},
    {path: 'snake-zero-wall', component: SnakeZeroWall},    
    {path: 'tetris-start-page', component: TetrisStartPage},
    {path: 'tetris', component: Tetris},
    {path: 'brickbreaker-start-page', component: BrickbreakerStartPage},
    {path: 'brickbreaker1', component: Brickbreaker1},
    {path: 'brickbreaker2', component: Brickbreaker2},
    {path: 'brickbreaker3', component: Brickbreaker3},
    {path: 'brickbreaker-heart', component: BrickbreakerHeart},
    {path: 'brickbreakertwo-start-page', component: BrickbreakertwoStratPage},
    {path: 'brickbreakertwo1', component: Brickbreakertwo1},
    {path: 'brickbreakertwo2', component: Brickbreakertwo2},
    {path: 'brickbreakertwo3', component: Brickbreakertwo3},
    {path: 'brickbreakertwo-heart', component: BrickbreakertwoHeart},
    {path: 'goalscorer-start-page', component: GoalscorerStratPage},
    {path: 'goalscorer', component: Goalscorer}, 
    {path: 'superbricks-start-page', component: SuperbricksStartPage},
    {path: 'superbricks', component: Superbricks},
    {path: 'rankings-page', component: RankingsPage},
    {path: 'snake-rankings', component: SnakeRankings},
    {path: 'tetris-rankings', component: TetrisRankings},
    {path: 'brickbreaker-rankings', component: BrickbreakerRankings},
    {path: 'brickbreakertwo-rankings', component: BrickbreakertwoRankings},
    {path: 'goalscorer-rankings', component: GoalscorerRankings},
    {path: 'superbricks-rankings', component: SuperbricksRankings},
    {path: 'about-snake', component: AboutSnake},
    {path: 'about-tetris', component: AboutTetris},
    {path: 'about-brickbreaker', component: AboutBrickbreaker},
    {path: 'about-brickbreakertwo', component: AboutBrickbreakertwo},
    {path: 'about-goalscorer', component: AboutGoalscorer},
    {path: 'about-superbricks', component: AboutSuperbricks},
    {path: 'chat', component: Chat},
    {path: 'report-bugs', component: ReportBugs}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }