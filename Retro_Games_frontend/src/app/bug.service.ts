import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface BugMessage {
    id?: number; //optional
    description: string; //obligatoriu
    reportedAt?: Date;
    UserId: number;
}

@Injectable({
    providedIn: 'root'
})
export class BugService {
    private url = `${environment.apiUrl}/bugs`; //api url ul catre bugs

    constructor(private http: HttpClient) {}

    //metoda pentru a raporta un bug nou
    reportBug(bug: BugMessage): Observable<BugMessage> {
        return this.http.post<BugMessage>(this.url, bug);
    }
}