import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' }) //marcheaza clasa ca fiind injectabila, o putem folosi oriunde (sau eu asa am inteles :))
export class AuthService {
  //vom folosi clasa pentru sistemele de login/register
  private isAuthenticated = false; //va fi definit de valoarea token ului
  private userId: number | null = null; //deifinim userId ca fiind de tip numar sau null, iar initial e null (luat din token)

  constructor(private http: HttpClient) {
    //la initializare verificam daca exista un token in LocalStorage
    this.loadToken();
  }

  //metoda pentru a incarca token ul din LocalStorage la pornirea aplicatiei
  private loadToken() {
    const token = localStorage.getItem("jwt_token");
    const id = localStorage.getItem("userId");
    if(token)
      this.isAuthenticated = true; //daca exista un token inseamna ca suntem autentificati
    if(id) 
      this.userId = Number(id); //incarcam si id ul utilizatorului in Local Storage
  }

  //facem o cerere de tip post catre backend-ul ASP.NET core pentru a loga un utilizator
  login(username: string, password: string): Observable<any> { //specificam tipul de retur
    //folosim apiURL din environment (src/environments/environment.ts)
    return this.http.post<any>(`${environment.apiUrl}/Auth/login`, {
      username,
      password
    }). pipe(
      tap(response => {
        //raspunsul contine un obiect cu proprietatea 'token'
        if(response && response.token) {
          localStorage.setItem('jwt_token', response.token); //salvam token ul in LocalStorage
          localStorage.setItem('userId', response.userId.toString()); //salvam userid ul in LocalStorage
          this.isAuthenticated = true; //utilizatorul este autentificat
          this.userId = response.userId; //pastram si id ul utilizatorului
        }
      })
    );
  }

  //facem o cerere de tip post catre backend-ul ASP.NET Core pentru a inregistra un utilizator
  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/Auth/register`, { //endpoint ul de inregistrare
      username,
      password
    });
  }

  //seteaza starea unui utilizator ca fiind delogat si sterge token ul
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
    this.isAuthenticated = false;
    this.userId = null;
  }

  //verificam daca un utilizator este logat prin existenta token ului
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token'); //verificam prezenta token ului
  }

  //obtinem token ul (va fi folosit de interceptor)
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
}
