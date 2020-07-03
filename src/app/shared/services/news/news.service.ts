import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, switchMap, tap, first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { INewYorkTimesFullJSON } from '../../interfaces/newyorktimes';
import { News } from '../../classes/news'
import * as moment from 'moment';
import { ExchangeService } from '../exchange/exchange.service';
import { nextTick } from 'process';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // The BehaviorSubject will store the New York Times Search instance into memory and allows us to emit new values
  private _news: BehaviorSubject<News> = new BehaviorSubject<News>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  public news$: Observable<News> = this._news.asObservable();

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
    //this.page = this.page + 1;     
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


  public addMoreNews$() {
    console.log('addMoreNews:');
    this.page = this.page + 1;    
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    let apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&sort=newest&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&page=${this.page}&api-key=${this.apiKey}`;

    console.log('this._news.value', this._news.value)
    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
      //tap(res => console.log('res docs[]:', res.response.docs)),
      //tap(res => console.log('_news docs[]:', this._news.value.rawResponse.response.docs)),
      map(res => new News(
        {
          response: {
            meta: res.response.meta,
            docs: [...this._news.value.rawResponse.response.docs, ...res.response.docs]
          },
          copyright: res.copyright,
          status: res.status
        }
        )),
      tap(news => this._news.next(news)),
      tap(res => console.log('after ... => _news docs[]:', this._news.value.rawResponse.response.docs)),
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
