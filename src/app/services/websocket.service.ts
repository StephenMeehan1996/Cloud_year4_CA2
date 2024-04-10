import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocketSubject!: WebSocketSubject<any>;
  private messagesSubject = new Subject<string>();

  constructor() { }

  connect(id: string): void {
    // Replace 'wss://your-websocket-api-endpoint' with the actual endpoint URL of your AWS WebSocket API
    this.webSocketSubject = webSocket('wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id=' + id);

    this.webSocketSubject.subscribe(
      (message: any) => {
        console.log('WebSocket Message Received:', message); // Log the received message to the console
        this.messagesSubject.next(message);
      },
      (error: any) => console.error('WebSocket Error:', error),
      () => console.log('WebSocket connection closed')
    );
  }

  disconnect(): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.complete(); // Close the connection
    }
  }

  // Method to send message over WebSocket
  sendMessage(message: any): void {

    let obj ={
      action: "sendMessage",
      message: "Testing Message from Client"
    }

    console.log(JSON.stringify(obj))
    if (this.webSocketSubject) {
      this.webSocketSubject.next(JSON.stringify(obj));
    } else {
      console.error('WebSocket connection not established.');
    }
  }

  // Getter for messages observable
  getMessages(): Observable<string> {
    return this.messagesSubject.asObservable();
  }
}
