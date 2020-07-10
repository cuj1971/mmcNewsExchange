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
import { LocationService } from '../location/location.service';
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
  private page: number;
  private apiKey = environment.newsConfig.apiKey;
  private coords: any;
  private countryData: any;

  constructor(
    private _geonames: GeonamesService,
    private _location: LocationService,
    private _http:HttpClient, 
    private _exchangeService: ExchangeService) { }
  
  async getCoords(){
    await this._geonames.handleGeoEvents();
    const coords = await this._geonames.currentCoords;
    return coords;
  }

  async getCountry(lat, lon){
    console.log(lat, lon);
    let apiEndPoint = `http://api.geonames.org`;
 
    const countryData = await this._http.get(apiEndPoint + `/countrySubdivisionJSON?lat=${lat}&lng=${lon}&username=norman`).toPromise().catch(err => err);
    return countryData;
  }

  public getNews$(): Observable<News> {
    return this.news$
  }

  public fetchAndGetNews$(country) {
    this.page = 0; 
    //this.page = this.page + 1;     
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    //this.getCoords();
    //const country = this.getCountry(this.coords.lat, this.coords.lon);

    let apiEndpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&fq=glocations:("${country.countryName}")AND pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&sort=newest&api-key=${this.apiKey}`;

    console.log("apiEndpoint", apiEndpoint);

    return this._http.get<INewYorkTimesFullJSON>(apiEndpoint).pipe(
      map(res => new News(res)),
      tap(news => this._news.next(news)),
      switchMap(() => this.getNews$())
    )
  }


  public addMoreNews$() {
    this.page = this.page + 1;    
    let startWrapper = moment(this.startDate);
    let endWrapper = moment(this.endDate);

    let apiEndpoint = 
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${this.searchTerm}&sort=newest&fq=pub_date:[${startWrapper.format("YYYY-MM-DD")} TO ${endWrapper.format("YYYY-MM-DD")}]&page=${this.page}&api-key=${this.apiKey}`;

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

  public setNewsQuery(val1, val2, val3) {
    this.searchTerm = val1;
    this.startDate = val2;
    this.endDate = val3;
  }

  public setExchangeQuery(val){
    this._exchangeService.setExchangeQuery(val)
  }

}
