import { Component, OnInit, Input } from '@angular/core';
import { NewsService } from '../../../../shared/services/news/news.service';
import { Router } from '@angular/router';
import { INewYorkTimesResponseDoc } from '../../../../shared/interfaces/newyorktimes';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss']
})
export class NewsPageComponent implements OnInit {
  //myNews: any;
  newsSearchHits = { hits: 0, offset: 0, time: 0 };                                                                       // here
  articles: INewYorkTimesResponseDoc[] = []; 

  constructor(
    private _userService: UserService,
    private _newsService:NewsService, 
    private _router: Router) { }

  async readNews() {

    const coords = await this._newsService.getCoords();
    await this._newsService.getCountry(coords.latitude, coords.longitude);

     this._newsService
      .fetchAndGetNews$()
      .subscribe(data => {
        this.newsSearchHits = data.getResponse().meta;
        this.articles = data.getDocs();
      }, err => {
      console.error(err);        
    });
  }

  public setExchangeQuery(val) {
    this._newsService.setExchangeQuery(val)
    this._router.navigate([`tabs/search/news/chart`]);
  }
  
  async updateNews(e) {
   
    this._newsService
      .addMoreNews$()
      .subscribe(data => {
        this.newsSearchHits = data.getResponse().meta;
        this.articles = data.getDocs();
      }, err => {
      console.error(err);        
    });

    e.target.complete();
  }

  logout(){
    this._userService.logout();
    this._router.navigate([`/login`]);
  }

  ngOnInit(): void {
    this.readNews();
  }

}
