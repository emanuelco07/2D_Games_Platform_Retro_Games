import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface ChatMessage {
    id?: number; //optional
    message: string; //obligatoriu
    username: string; //obligatoriu
    sendAt?: Date;
    UserId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
    private url = `${environment.apiUrl}/chats`; //api url ul catre chats

    constructor(private http: HttpClient) {}

    //metoda pentru a adauga un nou mesaje
    addChat(chat: ChatMessage): Observable<ChatMessage> {
        return this.http.post<ChatMessage>(this.url, chat);
    }

    //metoda pentru a prelua toate mesajele
    getChats(): Observable<ChatMessage[]> {
        return this.http.get<ChatMessage[]>(this.url);
    }
}