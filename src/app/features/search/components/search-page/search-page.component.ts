import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { News } from '../../../../shared/classes/news';
import { NewsService } from '../../../../shared/services/news/news.service';
import { INewYorkTimesResponseMeta, INewYorkTimesResponseDoc } from '../../../../shared/interfaces/newyorktimes';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from 'src/app/shared/services/user/user.service';


@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})

export class SearchPageComponent implements OnInit {
  // ionic changes
  searchString: string;
  startDatePicker: string;
  endDatePicker: string;
  //
  //searchForm: FormGroup;
  page: number = 0;
  public mynews$: Observable<News>;
  public newsSearchHits$: Observable<INewYorkTimesResponseMeta>;
  public newsDocs$: Observable<INewYorkTimesResponseDoc[]>;
  newsSearchHits = { hits: 0, offset: 0, time: 0 };                                                                       // here
  articles: INewYorkTimesResponseDoc[] = []; 
  uid;
  user$: Observable<any>;
  userBase;
  userTarget;

  constructor(
    private _userService:UserService, 
    private _newsService: NewsService, 
    private _router:Router, 
    private _afAuth: AngularFireAuth) {
   }

  searchNews(local) {
    this._newsService.setNewsQuery(local, this.searchString, this.startDatePicker, this.endDatePicker);
    this._router.navigate([`tabs/search/news`]);
  }

  ngOnInit(): void {
    
  }

  logout(){
    this._userService.logout();
    this._router.navigate([`/login`]);
  }

}
