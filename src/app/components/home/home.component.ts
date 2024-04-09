import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private userService: UserService,private apiService: ApiService,private webSocketService: WebSocketService) { }

  user: any = this.userService.getUser()
  stockData!: any[];
  storeLocation : string = ''
  storeID: string = ''

  messages: string[] = [];
  subscription: Subscription = new Subscription;


  ngOnInit(): void {
    this.subscription = this.apiService.getStockData().subscribe((data: any[]) => {
      this.stockData = data;
      console.log(this.stockData); 
      this.storeLocation = this.stockData[0].StoreLocation.S;
      this.storeID = this.stockData[0].StoreID.S;

      
      this.webSocketService.connect(this.storeID);

      this.subscription = this.webSocketService.messages.subscribe(
        (message: string) => {
          console.log('Received message:', message);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
    });
  }

  ngOnDestroy(): void {
    
    this.subscription.unsubscribe();
  }
}
