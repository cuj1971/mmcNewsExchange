import { Component, OnInit, Input } from '@angular/core';
import { NewsService } from '../../../../shared/services/news/news.service';
import { Router } from '@angular/router';
import { INewYorkTimesResponseDoc } from '../../../../shared/interfaces/newyorktimes';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss']
})
export class NewsPageComponent implements OnInit {
  //myNews: any;
  newsSearchHits = { hits: 0, offset: 0, time: 0 };                                                                       // here
  articles: INewYorkTimesResponseDoc[] = []; 

  constructor(private _newsService:NewsService, private _router: Router) { }

  readNews() {
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
    this._router.navigate([`../search/news/chart`]);
  }
  
  loadMore() {
    // update observable after making new api call
    this._newsService.addMoreNews$()
    // trigger complete() event to stop infini scroll animation and display new items
  }

  ngOnInit(): void {
    this.readNews();
  }

}
