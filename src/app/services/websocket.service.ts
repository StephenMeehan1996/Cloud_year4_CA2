import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private webSocketSubject!: WebSocketSubject<any>;

  constructor() { }

  connect(id: string): void {
    // Replace 'wss://your-websocket-api-endpoint' with the actual endpoint URL of your AWS WebSocket API
    this.webSocketSubject = webSocket('wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id='+ id);
  }

  disconnect(): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.complete(); // Close the connection
    }
  }

  // Method to send message over WebSocket
  sendMessage(message: any): void {
    if (this.webSocketSubject) {
      this.webSocketSubject.next(message);
    } else {
      console.error('WebSocket connection not established.');
    }
  }

  // Getter for messages observable
  get messages(): any {
    return this.webSocketSubject.asObservable();
  }
}
