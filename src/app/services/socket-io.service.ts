import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  private webSocket: Socket;

  constructor() {
    this.webSocket = new Socket({
      url: "wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id=HEADOFFICEIRELAND",
      options: {},
    });

    // Add error handling for socket initialization
    this.webSocket.ioSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });
  }

  // Method to start connection/handshake of socket with the server
  connectSocket() {
    this.webSocket.connect();
  }

  // Method to send a message to the server
  sendMessage(msg: string) {
    this.webSocket.emit('message', msg);
  }

  // Method to receive messages from the server
  getMessage() {
    return this.webSocket.fromEvent('message').pipe(
      map((data: any) => data.msg),
      catchError(error => {
        console.error('Error in getMessage:', error);
        return throwError(error);
      })
    );
  }

  // Method to receive response from the server
  receiveResponse() {
    return this.webSocket.fromEvent('/get-response').pipe(
      catchError(error => {
        console.error('Error in receiveResponse:', error);
        return throwError(error);
      })
    );
  }

  // Method to end WebSocket connection
  disconnectSocket() {
    this.webSocket.disconnect();
  }
}
