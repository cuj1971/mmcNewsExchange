import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private startDate: string;

  constructor() { }

  public setExchangeQuery(val1){
    this.startDate = val1;
  }
}
