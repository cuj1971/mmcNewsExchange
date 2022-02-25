import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, switchMap, tap, first } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { INewYorkTimesFullJSON } from '../../interfaces/newyorktimes';
import { News } from '../../classes/news'
import * as moment from 'moment';
import { ExchangeService } from '../exchange/exchange.service';
import { GeonamesService } from '../geonames/geonames.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // The BehaviorSubject will store the New York Times Search instance into memory and allows us to emit new values
  private _news: BehaviorSubject<News> = new BehaviorSubject<News>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  public news$: Observable<News> = this._news.asObservable();

  // The BehaviorSubject will store the Country instance into memory and allows us to emit new values
  private _country: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // The Observable is just a limited version of BehaviorSubject to expose to public
  public country$: Observable<any> = this._country.asObservable();

  private searchTerm: string;
  private startDate: string;
  private endDate: string;
  private local: boolean;
  private page: number;
  private apiKey = environment.newsConfig.apiKey;
  public countryData: any;
  public currency: any;

  constructor(
    private _geonames: GeonamesService,
    private _http:HttpClient, 
    private _exchangeService: ExchangeService) { }
  
  async getCoords(){
    await this._geonames.handleGeoEvents();
    const coords = await this._geonames.currentCoords;
    return coords;
  }

  async getCountry(lat, lon){
    // GETS COUNTRY ISO CODE based on user latitude and longitude

    // let apiEndPoint = `https://api.positionstack.com/v1/reverse?access_key=${environment.positionStack.apiKey}`;
    let apiEndPoint = `http://api.positionstack.com/v1/reverse?access_key=${environment.positionStack.apiKey}`;
     
    // auto - giving errors when I test in Chrome with different location ??
    // If I force latitude and longitude as hown below for Moscow it works as expected
    this.countryData = await this._http.get(apiEndPoint + `&query=${lat},${lon}`).toPromise().catch(err => err);
    // Moscow
    //this.countryData = await this._http.get(apiEndPoint + `&query=55.75,37.61`).toPromise().catch(err => err);
    await this.getCurrency();
  }

  async getCurrency(){
    // GET ISO CURRENCY CODE using ISO Country Code
    let apiEndPoint = `https://restcountries.eu/rest/v2/alpha/`;
    this.currency = await this._http.get(apiEndPoint + `${this.countryData.data[0].country_code}`).toPromise().catch(err => err);
  }

  public getNews$(): Observable<News> {
    return this.news$
  }

  public fetchAndGetNews$() {
    let apiEndpoint;
    this.page = 0; 
    //this.page = this.page + 1;     
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    if (this.local) {
      apiEndpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&fq=glocations:("${this.countryData.data[0].country}")AND pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&sort=newest&api-key=${this.apiKey}`;
    }else{
      apiEndpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&sort=newest&api-key=${this.apiKey}`;
    }

    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
      map(res => new News(res)),
      tap(news => this._news.next(news)),
      switchMap(() => this.getNews$())
    )
  }

  public addMoreNews$() {
    let apiEndpoint;
    this.page = this.page + 1;    
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

   // let apiEndpoint = 
   // `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&sort=newest&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&page=${this.page}&api-key=${this.apiKey}`;

    if (this.local){
      apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&fq=glocations:("${this.countryData.data[0].country}")AND pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&sort=newest&page=${this.page}&api-key=${this.apiKey}`;
    }else{
      apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&sort=newest&page=${this.page}&api-key=${this.apiKey}`;
    }

    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
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
      switchMap(() => this.getNews$())
    )
  }

  public setNewsQuery(local, val1, val2, val3) {
    this.searchTerm = val1;
    this.startDate = val2;
    this.endDate = val3;
    this.local = local;
  }

  public setExchangeQuery(val){
    this._exchangeService.setExchangeQuery(val, this.currency, this.local)
  }

}
