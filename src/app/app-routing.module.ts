import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageComponent } from './features/search/components/search-page/search-page.component';
import { NewsPageComponent } from './features/news/components/news-page/news-page.component';
import { ChartPageComponent } from './features/chart/components/chart-page/chart-page.component';
import { RegisterComponent } from './features/register/register.component';
import { LoginComponent } from './features/login/login.component';
import { UserComponent } from './features/user/user.component';
import { ProfileComponent } from './features/profile/profile.component';
import { TabsComponent } from './shared/components/tabs/tabs.component';

const routes: Routes = [
{
  path: "tabs",
  component: TabsComponent,
  children: [ 
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
      path: 'login',
      children: [
        {
          path: 'register',
          component: RegisterComponent
        },
        {
          path: 'profile',
          component: ProfileComponent
        },
        {
          path: '',
          component: LoginComponent
        }
      ]    
    },
    {
      path: '',
      redirectTo: "login",
      pathMatch: 'full'
    }
  ],
},
{
  path: '',
  redirectTo: 'tabs/login',
  pathMatch: 'full'
},
{
  path: '**',
  redirectTo: 'tabs/login'
}
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
