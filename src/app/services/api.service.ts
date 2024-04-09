import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private hqStockURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/HQStock/HEADOFFICEIRELAND'
  private getDeliveryURL ='https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/Deliverys'
  private storeStockURL = 'https://roko7v7x9d.execute-api.eu-west-1.amazonaws.com/dev/StoreStock/f719238f-21a0-4f0b-b60c-99d6b1a93f2b'; // Replace this with your API URL

  constructor(private http: HttpClient) { }

  getStockData(): Observable<any> {
    return this.http.get<any>(this.hqStockURL);
  }
}
