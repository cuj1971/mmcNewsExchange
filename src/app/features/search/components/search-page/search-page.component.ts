import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { tap, first } from 'rxjs/operators';
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
  user$: Observable<any>;
  userBase;
  userTarget;

  constructor(
    private _userService:UserService, 
    private _newsService: NewsService, 
    private _router:Router, 
    private _afAuth: AngularFireAuth) {
   }

  searchNews() {
    this._newsService.setNewsQuery(this.searchString, this.startDatePicker, this.endDatePicker);
    this._router.navigate([`tabs/search/news`]);
  }

  ngOnInit(): void {
  
  }

 async getPrefs() {
    console.log('getPrefs()')
    //this.user$ = await this._userService.returnUser$();
    //console.log('this._userService.userProfile', this._userService.userProfile);
    //console.log('this._userService.test', this._userService.test)

       
    this._userService.returnUser$().subscribe(
      data => {
        if (!data) {
          console.log('no data');
          return;
        };
        console.log('data', data);
      }
    )
  
 
/*
    this.userBase = this.user$.pipe(
      tap(res => res.baseCurrency)
    )
    this.userTarget = this.user$.pipe(
      tap(res => res.targetCurrency)
    )
    */
  }

  logout(){
    this._userService.logout();
    this._router.navigate([`/login`]);
  }

}
