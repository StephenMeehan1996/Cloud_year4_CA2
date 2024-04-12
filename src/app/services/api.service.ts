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
  private storeStockURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/StoreStock/'; 
  private historyURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/OrderHistory'
  private officeDetail ='https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/detail/'
  
  //private updateDelURL = "https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys/"
   private updateDelURL = "https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/UpdateStatus";
  

  constructor(private http: HttpClient, private userService: UserService) { }

  

  getStockData(id: any): Observable<any> {

    let user: any = this.userService.getUser()

   if(user.email == 'stephenmeehan1996@gmail.com'){
    this.userService.setID(1);
    return this.http.get<any>(this.storeStockURL + id);
    
   }
   else if(user.email == 'donal.peter.peter@gmail.com'){
    this.userService.setID(2);
    return this.http.get<any>(this.storeStockURL + id);
   }
   else{
    this.userService.setID(3);
    return this.http.get<any>(this.getDeliveryURL);
   }
    
  }

  getOrderHistory(): Observable<any> {

    return this.http.get<any>(this.historyURL);

  }

  getOfficeDetailHistory(id: any): Observable<any> {

    
    return this.http.get<any>(this.officeDetail+id);

  }

  //Order Complete// 
  //Set order to one// 
  //Write to s3//
  //S3//

  postOrder(orderData: any, location : any, id: any): Observable<any> {
    let deliveryURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys';
    
    let plocation = ''

    if(id ==='swbixgfKMCNKNQDYYvq6rJFWHHq1'){
      plocation = 'HEADOFFICEIRELAND'
    }
    else{
      plocation = 'HEADOFFICEUSA'
    }

    const transformedJson = {
      "pickupLocation": plocation,
      "storeLocation": location,
      "storeid": id,
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

  updateDeliveryStatus(deliveryId: string): Observable<any> {

    let obj = {
      deliveryId: deliveryId
    }

    const url = `${this.updateDelURL}`;
    return this.http.put<any>(url, obj);
  }

 
}



 



