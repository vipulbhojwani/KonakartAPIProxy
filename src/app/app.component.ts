import { Component } from '@angular/core';
import Stepper from 'bs-stepper';
import { KonakartService } from './konakart-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

constructor(private konakartService: KonakartService){}

  title = 'testbench';
  private stepper: Stepper;
  private sessionId: any;

  name = 'Angular';

  loginForm = {emailAddr: 'vipul.bhojwani@comprotechnologies.com', password: 'Vipul@123', sessionId: ''};

  createAndSaveForm = {orderId: ''};

  paymentForm = {data: {
    fields: [],
    requestUrl: ''
  }};

  login(){
    this.konakartService.Login(this.loginForm.emailAddr, this.loginForm.password).subscribe(data=>{
      this.loginForm.sessionId = data.sessionId;
    })
  }

  createAndSaveOrder(){
    this.konakartService.CreateAndSaveOrder(this.loginForm.sessionId).subscribe(data=>{
      this.createAndSaveForm.orderId = data.orderId;
    })

  }

  getPaymentDetails(){
    this.konakartService.GetPaymentDetails(this.loginForm.sessionId, this.createAndSaveForm.orderId).subscribe(data=>{
      this.paymentForm.data.requestUrl = data.requestUrl;
      this.paymentForm.data['fields'] = [];
      for(let i=0; i<32; i++)
      {
        this.paymentForm.data['fields'].push(data['parameters'].parameters[i]);
      }
      
    })
  }


  next() {
    this.stepper.next();
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })
  }

  
}
