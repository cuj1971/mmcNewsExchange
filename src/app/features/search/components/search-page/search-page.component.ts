import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { News } from '../../../../shared/classes/news';
import { NewsService } from '../../../../shared/services/news/news.service';
import { INewYorkTimesResponseMeta, INewYorkTimesResponseDoc } from '../../../../shared/interfaces/newyorktimes';
import { AngularFireAuth } from '@angular/fire/auth';


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

  constructor(private _newsService: NewsService, private _router:Router, private _afs: AngularFireAuth) {

   }

  searchNews() {
    //await this._newsService.fetchAndGetNews$(this.searchString, this.startDatePicker, this.endDatePicker)
    //this._newsService.load(this.searchString, this.startDatePicker, this.endDatePicker);
    this._newsService.setNewsQuery(this.searchString, this.startDatePicker, this.endDatePicker);
    this._router.navigate([`../search/news`]);
  }

  ngOnInit(): void {
    /*
    this.searchForm = this._fb.group({
      primarySearch: ['Trump', Validators.required],
      startDatePicker: ['01/01/2020', Validators.required],
      endDatePicker: ['31/12/2020', Validators.required]
    })
    */
  }

  Logout(){
    this._afs.signOut();
    this._router.navigate([`/home`]);
  }

}
