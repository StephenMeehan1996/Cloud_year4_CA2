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

  
  subject = webSocket('wss://u3iw9dl7f4.execute-api.eu-west-1.amazonaws.com/dev/?id=HEADOFFICEIRELAND');
  
  constructor(private router: Router, private userService: UserService,private apiService: ApiService,private webSocketService: WebSocketService,private zone: NgZone) { }

  user: any = this.userService.getUser()
  id: any ;
  stockData: any;
  storeLocation : string = ''
  storeID: string = ''

  subscriptionStock: Subscription = new Subscription;

  messages: string[] = [];
  subscriptionNotify: Subscription = new Subscription;

   // Parse the provided JSON data into this array

  delData!: any;

  filteredOrders: any;
  filterDriverId: string = '';

  selectedItem: string = '';
  quantity: number = 1;
  cartItems: { stockItem: string, amount: number }[] = [];

 
  ngOnInit(): void {
    this.subscriptionStock = this.apiService.getStockData().subscribe((data: any) => {
      this.id = this.userService.getID();
      if (this.id != 3) {
        this.stockData = data;
        console.log(this.stockData); 
        this.storeLocation = this.stockData[0].StoreLocation.S;
        this.storeID = this.stockData[0].StoreID.S;
      } else {
        // Extract the array from the data object and assign it to stockData
        this.stockData = JSON.parse(data.body); // Transform object to array
        console.log(this.stockData);
        alert(typeof(this.stockData))

        
      }
    });

  
    

    this.webSocketService.connect('HEADOFFICEIRELAND');

    this.subscriptionNotify = this.webSocketService.getMessages().subscribe(
      (message: string) => {
        console.log('Received message:', message);
        this.zone.run(() => {
          alert('Test'); // Display alert inside Angular's zone
          this.messages.push(message);
        });
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );

 
  }

   extractTypeNotation(obj: any): any {
    if (Array.isArray(obj)) {
        // If obj is an array, map over its elements and recursively extract type notation
        return obj.map(item => this.extractTypeNotation(item));
    } else if (typeof obj === 'object' && obj !== null) {
        // If obj is an object, iterate over its properties and recursively extract type notation
        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = this.extractTypeNotation(obj[key]);
            }
        }
        return result;
    } else {
        // If obj is neither an array nor an object, return its type
        return typeof obj;
    }
}

// Assuming your JSON array is named jsonData



  applyFilter() {
    this.filteredOrders = this.stockData.filter((order: any) => {
      // Ensure that the structure of ordersData matches the structure of your orders
      // Access DeliveryDriver.S accordingly
      if (order.DeliveryDriver && order.DeliveryDriver.S) {
        return order.DeliveryDriver.S.includes(this.filterDriverId);
      }
      return false; // Handle the case where DeliveryDriver is not present or doesn't have an S property
    });
  }

  completeOrder(deliveryId: string) {
    // Logic to handle completing the order
    console.log(`Order with DeliveryID ${deliveryId} completed.`);
  }


  addToCart() {
    if (this.selectedItem && this.quantity > 0) {
      this.cartItems.push({ stockItem: this.selectedItem, amount: this.quantity });
      this.selectedItem = '';
      this.quantity = 1;
    }
  }

  placeOrder(){


    this.apiService.postOrder(this.cartItems).subscribe(
      response => {
        console.log('Response:', response);
        // Handle success response here
      },
      error => {
        console.error('Error:', error);
        // Handle error response here
      }
    );
  }

  testGet(): void{
    console.log(this.webSocketService.getMessages())
  }

  sendNotification(message: string): void{
    this.webSocketService.sendMessage('Testing send message');
  }

  ngOnDestroy(): void {
    
    this.subscriptionStock.unsubscribe();
    this.subscriptionNotify.unsubscribe();
  }
}
