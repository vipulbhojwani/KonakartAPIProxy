import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KonakartService {

  constructor(private http: HttpClient) { }

  url = "api/"

  Login(emailAddr: any, password: any): Observable<any> {

    let params = new HttpParams();
    params = params.append('emailAddr', emailAddr);
    params = params.append('password', password);

    return this.http.get(this.url + 'User/Login', { params: params });
  }


  CreateAndSaveOrder(sessionId): Observable<any> {
    let body = new HttpParams();
    body = body.set('sessionId', sessionId);

    let params = new HttpParams();
    params = params.append('sessionId', sessionId);

    return this.http.post(this.url + 'User/Create/Order', body);
  }

  GetPaymentDetails(sessionId, orderId): Observable<any> {
    let params = new HttpParams();
    params = params.append('sessionId', sessionId);
    params = params.append('orderId', orderId);

    return this.http.get(this.url + 'User/Payment', { params: params });
  }

}
