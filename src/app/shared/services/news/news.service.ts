import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, switchMap, tap, first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { INewYorkTimesFullJSON } from '../../interfaces/newyorktimes';
import { News } from '../../classes/news'
import * as moment from 'moment';
import { ExchangeService } from '../exchange/exchange.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // The BehaviorSubject will store the New York Times Search instance into memory and allows us to emit new values
  private _news: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  public news$: Observable<any> = this._news.asObservable();

  private searchTerm: string;
  private startDate: string;
  private endDate: string;
  private page: number;
  private apiKey = environment.newsConfig.apiKey;

  constructor(private _http:HttpClient, private _exchangeService: ExchangeService) { }

  public getNews$(): Observable<News> {
    console.log('getNews:');
    return this.news$
  }

  public fetchAndGetNews$() {
    console.log('fetchAndGetNews:');
    this.page = 0;    
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    let apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&sort=newest&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&api-key=${this.apiKey}`;

    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
      map(res => new News(res)),
      tap(news => this._news.next(news)),
      switchMap(() => this.getNews$())
    )
  }


  async addMoreNews$() {
    console.log('addMoreNews:');
    this.page = this.page + 1;    
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    let apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&sort=newest&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&page=${this.page}&api-key=${this.apiKey}`;

    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
      map(res => new News(res)),
      tap(news => this._news.next([
        news,
        ...this._news.value()])),
      switchMap(() => this.getNews$())
    )

  }

  public setNewsQuery(val1, val2, val3) {
    this.searchTerm = val1;
    this.startDate = val2;
    this.endDate = val3;
  }

  public setExchangeQuery(val){
    this._exchangeService.setExchangeQuery(val)
  }

}
