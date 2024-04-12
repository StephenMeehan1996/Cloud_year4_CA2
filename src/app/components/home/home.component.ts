import { Component, OnDestroy, NgZone, OnInit } from '@angular/core';
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

  constructor(private router: Router, private userService: UserService, private apiService: ApiService, private webSocketService: WebSocketService, private zone: NgZone) { }

  user: any = this.userService.getUser()
  id: any;
  stockData: any;
  orderHistory: Order[] =[]
  selectedDate: string = '';
  storeDetail: any;
  displayedOrder: Order | undefined;
  storeLocation: string = ''
  storeID: string = ''

  subscriptionStock: Subscription = new Subscription;
  subscriptionHistory: Subscription = new Subscription;
  subscriptionDetail: Subscription = new Subscription;

  messages: string[] = [];
  subscriptionNotify: Subscription = new Subscription;

  // Parse the provided JSON data into this array

  delData!: any;

  filteredData: any;
  uniqueDrivers: any;
  selectedDriver: string = "all";

  selectedItem: string = ''
  quantity: number = 1;
  cartItems: { stockItem: string, amount: number }[] = [];




  activeTab = 'activeDeliveries';

  setActiveTab(tab: string) {
    this.activeTab = tab;
    console.log(this.activeTab);
  }

  onSelectDate(): void {
    this.displayedOrder = this.orderHistory.find((order: { Date: string; }) => order.Date === this.selectedDate);
  }

  convertToTwoDecimalPlaces(value: number): string {
    return value.toFixed(2);
  }

  

  ngOnInit(): void {
    this.subscriptionStock = this.apiService.getStockData(this.user?.uid ).subscribe((data: any) => {
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
        this.filteredData = this.stockData;
        this.getUniqueDrivers();

        this.subscriptionHistory = this.apiService.getOrderHistory().subscribe((data: any) => {
          this.orderHistory =  JSON.parse(data.body);;
          console.log('Order History: ' + JSON.stringify(this.orderHistory));
        });
      }
    });

    this.subscriptionDetail = this.apiService.getOfficeDetailHistory(this.user?.uid).subscribe((data: any) => {
      this.storeDetail =  data;
      console.log('Order History: ' + JSON.stringify(this.storeDetail));
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

  getUniqueDrivers() {
    console.log('Inside getUniqueDrivers function');
    try {
      const driversSet = new Set();
      this.stockData.forEach((delivery: { DeliveryDriver: { S?: unknown; }; }) => {
        console.log('Processing delivery:', delivery);
        if (delivery && delivery.DeliveryDriver && delivery.DeliveryDriver.S) {
          driversSet.add(delivery.DeliveryDriver.S);
        } else {
          console.warn('Invalid delivery object:', delivery);
        }
      });
      this.uniqueDrivers = Array.from(driversSet);
      console.log('Unique drivers:', this.uniqueDrivers);
    } catch (error) {
      console.error('Error in getUniqueDrivers:', error);
    }
  }
  applyFilter() {
    if (this.selectedDriver === "all") {
      this.filteredData = this.stockData;
    } else {
      this.filteredData = this.stockData.filter((delivery: { DeliveryDriver: { S: string; }; }) => delivery.DeliveryDriver.S === this.selectedDriver);
    }
  }


  addToCart() {
    if (this.selectedItem && this.quantity > 0) {
      this.cartItems.push({ stockItem: this.selectedItem, amount: this.quantity });
      this.selectedItem = '';
      this.quantity = 1;
    }
  }

  placeOrder() {
    this.apiService.postOrder(this.cartItems, this.storeLocation, this.storeID ).subscribe(
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

  testGet(): void {
    console.log(this.webSocketService.getMessages())
  }

  sendNotification(message: string): void {
    this.webSocketService.sendMessage('Testing send message');
  }

  ngOnDestroy(): void {

    this.subscriptionStock.unsubscribe();
    this.subscriptionNotify.unsubscribe();
  }

  
  completeDelivery(deliveryID: string, index: number) {
    // Print delivery ID
    console.log("Delivery ID: ", deliveryID);

    // Remove the delivery from the table
    // this.filteredData.splice(index, 1);

    this.apiService.updateDeliveryStatus(deliveryID).subscribe(
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
}

interface Order {
  Date: string;
  ItemTotals: {
    HeadOfficeIreland: { [key: string]: { Quantity: number, Total: number } },
    HeadOfficeUSA: { [key: string]: { Quantity: number, Total: number } }
  },
  DailyOrderTotalIreland: number;
  DailyOrderTotalUSA: number;
}
