import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, switchMap, tap} from 'rxjs/operators';
import * as moment from 'moment';
import { IExchangeJSON } from '../../interfaces/exchangeratesapi';
import { Exchange } from '../../classes/exchange';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  // The BehaviorSubject will store the New York Times Search instance into memory and allows us to emit new values
  private _rates: BehaviorSubject<Exchange> = new BehaviorSubject<Exchange>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  private rates$: Observable<Exchange> = this._rates.asObservable();
  user$;
  private startDate: string;
  private baseCurr: any;
  public targetCurr: any;

  constructor(
    private _http:HttpClient,
    private _userService:UserService) { }

  public setExchangeQuery(val1, base){
    this.startDate = val1;
    this.baseCurr = base;
    this.targetCurr = this._userService.userData.targetCurrency;
    console.log('this._userService.userData', this._userService.userData);
  }

  public getRates$(): Observable<Exchange> {
    return this.rates$
  }

  public fetchAndGetRates() {
    let a = moment(this.startDate);
    let startDate = a.clone().subtract(2, 'week');
    // SET RANGE FROM ONE WEEK BEFORE, UNTIL ONE WEEK AFTER THE SELECTED ARTICLE DATE
    let startString = `${startDate.year()}-${startDate.month()+1}-${startDate.date()}`; // this.currencyCode.currencies[0].code
    let endDate = a.clone().add(2, 'week');
    let endString = `${endDate.year()}-${endDate.month()+1}-${endDate.date()}`;
 
    //let apiEndpoint = `https://api.exchangeratesapi.io/history?start_at=${startString}&end_at=${endString}&base=${this.baseCurr.currencies[0].code}&symbols=USD`;
    let apiEndpoint = `https://api.exchangeratesapi.io/history?start_at=${startString}&end_at=${endString}&base=${this.baseCurr.currencies[0].code}&symbols=${this.targetCurr}`;
    
    return this._http.get<IExchangeJSON>(apiEndpoint).pipe(
      map(res => new Exchange(res)),
      tap(res => this._rates.next(res)),
      switchMap(() => this.getRates$())
    )
  }
  
}
