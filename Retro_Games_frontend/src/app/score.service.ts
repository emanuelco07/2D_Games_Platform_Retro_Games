import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  //vom folosi apiURL ul din environment

  constructor(private http: HttpClient) {}

  //trimitem o cere de tip PUT pentru o modifica scorul utilizatorului
  //se va extrage username ul din token
  updateHighScore(score: number, gameName: string): Observable<any> {
    const url = `${environment.apiUrl}/Users/updatehighscore`;
    const body = { 
      score: score,
      gameName: gameName
    } //trimitem scorul si numele jocului ca obiect json
    
    return this.http.put(url, body); //HttpClient trimite automat JSON pentru obiecte
  }

  //trimitem o cere post catre backend pentru a obtine scorul utilizatorului
  getHighScore(gameName: string): Observable<number> {

    const requestBody = {gameName: gameName}; //trimitem numele jocului

    return this.http.post<any>(`${environment.apiUrl}/Users/highscore`, requestBody).pipe(
      map(response => response.highScore || response.HighScore)
    ); 
  }

  //obtinem leadearboard-ul 
  getLeaderboard(gameName: string): Observable<{ username: string; highScore: number }[]> {
    const url = `${environment.apiUrl}/Users/leaderboard`;

    const requestBody = {gameName: gameName}; //trimitem numele jocului

    return this.http.post<{ username: string; highScore: number }[]>(url, requestBody); //post necesita un al doilea argument, am pus {} pentru ca 
                                                                              //asa se declara un obiect gol in typescript
                                                                              //am modificat pentru ca aveam nevoie de numele jocului
  }

  //obtinem clasamentul total
  getRankings(gameName: string): Observable<{ username: string; highScore: number }[]> {
    const url = `${environment.apiUrl}/Users/rankings`;

    const requestBody = {gameName: gameName}; //trimitem numele jocului

    return this.http.post<{ username: string; highScore: number }[]>(url, requestBody);
  }
}
