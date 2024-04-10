import { Component, OnDestroy,NgZone, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/websocket.service';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  message = 'hello';
  subject = webSocket('wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id=HEADOFFICEIRELAND');
  
  constructor(private router: Router, private userService: UserService,private apiService: ApiService,private webSocketService: WebSocketService,private zone: NgZone) { }

  user: any = this.userService.getUser()
  stockData!: any[];
  storeLocation : string = ''
  storeID: string = ''

  subscriptionStock: Subscription = new Subscription;

  messages: string[] = [];
  subscriptionNotify: Subscription = new Subscription;

  private socket$: WebSocketSubject<any> | undefined;


  ngOnInit(): void {
    // this.subscriptionStock= this.apiService.getStockData().subscribe((data: any[]) => {
    //   this.stockData = data;
    //   console.log(this.stockData); 
    //   this.storeLocation = this.stockData[0].StoreLocation.S;
    //   this.storeID = this.stockData[0].StoreID.S;
    // });



    // this.webSocketService.connect('HEADOFFICEIRELAND');

    // this.subscriptionNotify = this.webSocketService.getMessages().subscribe(
    //   (message: string) => {
    //     console.log('Received message:', message);
    //     this.zone.run(() => {
    //       alert('Test'); // Display alert inside Angular's zone
    //       this.messages.push(message);
    //     });
    //   },
    //   (error: any) => {
    //     console.error('Error:', error);
    //   }
    // );

    this.socket$ = webSocket('wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id=HEADOFFICEIRELAND');

    // Subscribe to messages
    this.socket$.subscribe(
      (message) => {
        console.log('Received message:', message);
      },
      (error) => {
        console.error('WebSocket error:', error);
      },
      () => {
        console.log('WebSocket connection closed');
      }
    );
  }

  testGet(): void{
    console.log(this.webSocketService.getMessages())
  }

  sendNotification(message: string): void{
   // this.webSocketService.sendMessage('Testing send message');

       // Check if the WebSocket connection is open
       if (!this.socket$ || this.socket$.closed) {
        console.error('WebSocket connection is not open');
        return;
      }
  
      // Send the message
      this.socket$.next(message);
     // console.log('Sent message:', message);
  }

  ngOnDestroy(): void {
    
    this.subscriptionStock.unsubscribe();
    this.subscriptionNotify.unsubscribe();
  }
}
