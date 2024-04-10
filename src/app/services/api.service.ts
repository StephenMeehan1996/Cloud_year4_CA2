import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private hqStockURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/HQStock/HEADOFFICEIRELAND'
  private getDeliveryURL ='https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys'
  private storeStockURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/StoreStock/f719238f-21a0-4f0b-b60c-99d6b1a93f2b'; 
  
  //private updateDelURL = "https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys/"
   private updateDelURL = "https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Update/";
  

  constructor(private http: HttpClient, private userService: UserService) { }

  

  getStockData(): Observable<any> {

    let user: any = this.userService.getUser()

   if(user.email == 'stephenmeehan1996@gmail.com'){
    this.userService.setID(1);
    return this.http.get<any>(this.storeStockURL);
    
   }
   else if(user.email == 'donal.peter.peter@gmail.com'){
    this.userService.setID(2);
    return this.http.get<any>(this.hqStockURL);
   }
   else{
    this.userService.setID(3);
    return this.http.get<any>(this.getDeliveryURL);
   }
    
  }

  postOrder(orderData: any): Observable<any> {
    let deliveryURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys';
    const transformedJson = {
      "pickupLocation": "HEADOFFICEIRELAND",
      "storeLocation": "Store 1",
      "items": orderData.map((item: { stockItem: any; amount: any; }) => ({
        "stockItem": item.stockItem,
        "amount": item.amount
      }))
    };

    console.log(JSON.stringify(transformedJson));
 

   return this.http.post<any>(deliveryURL, transformedJson)
    .pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error; // Rethrow the error to propagate it further
      })
    );
  
  }

  updateDeliveryStatus(deliveryId: string, newStatus: number): Observable<any> {
    const url = `${this.updateDelURL}/${deliveryId}`;
    return this.http.get<any>(url);
  }

 
}



 



