import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageComponent } from './features/search/components/search-page/search-page.component';
import { NewsPageComponent } from './features/news/components/news-page/news-page.component';
import { ChartPageComponent } from './features/chart/components/chart-page/chart-page.component';

const routes: Routes = [
  {
    path: 'search',
    children: [
      {
        path: 'news',
        children: [
          {
            path: 'chart',
            component: ChartPageComponent
          },
          {
            path:'',
            component: NewsPageComponent
          }
        ]
      },
      {
        path: '',
        component: SearchPageComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: "search",
    pathMatch: 'full'
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
