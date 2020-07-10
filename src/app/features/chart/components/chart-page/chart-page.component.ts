import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExchangeService } from '../../../../shared/services/exchange/exchange.service';
import { Exchange } from '../../../../shared/classes/exchange';
import { Chart, ChartOptions, ChartDataSets } from "chart.js";
import { ChartService } from 'src/app/shared/services/chart/chart.service';
import { UserService } from '../../../../shared/services/user/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.scss']
})
export class ChartPageComponent {

  public myrates$: Observable<Exchange>;
  public mybase$: Observable<any>
  public exchangeSummary = { rates: [], start_at: '', base: '', end_at: '' }; 

  // TO BE MOVED to CHART ServIce

  // chart.js
  chartData: ChartDataSets[] = [];
  chartLabels: any[] = [];
  @ViewChild('barChart') barChart;
  bars: any;
  colorArray: any;


  constructor(
    private _userService:UserService,
    private _router: Router,
    private _exchangeService: ExchangeService,
    private _chartService: ChartService) { }

  // MAKE USER OF THE EXCHANGE SERVICE TO POPULATE CHART DATA
  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
          label: 'CHF label',
          yAxisID: 'left-y-axis',
          data: this.chartData[0].data,
          backgroundColor: this.colorArray[0],
          borderColor: this.colorArray[0],
          borderWidth: 1
        },
        {
          label: 'GBP label',
          yAxisID: 'right-y-axis',
          data: this.chartData[1].data,
          backgroundColor: this.colorArray[1],
          borderColor: this.colorArray[1],
          borderWidth: 1
        }
      ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day'
              }
              //distribution: 'series'
            }
          ],
          yAxes: [
            {
              id: 'left-y-axis',
              position: 'left'
            },
            {
              id: 'right-y-axis',
              position: 'right'
            }
          ]
        }
      }
    });
  }

  searchRates() {
    console.log('searchRates()');
    this.myrates$ = this._exchangeService.fetchAndGetRates();
    let dataset1 = [];
    let dataset2 = [];

    this._exchangeService
    .fetchAndGetRates()
    .subscribe(data => {
      let series1 = {data:[], label:""};
      let series2 = {data:[], label:""};
      this.chartData = [];
      this.chartLabels = [];
      this.exchangeSummary.start_at = data.getStart();
      this.exchangeSummary.end_at = data.getEnd();
      this.exchangeSummary.base = data.getBase();
      this.exchangeSummary.rates = data.getExchangeRates();

      for (let i = 0; i < this.exchangeSummary.rates.length; i++) {
        this.chartLabels.push(this.exchangeSummary.rates[i][0]);
        dataset1.push(this.exchangeSummary.rates[i][1].CHF);
        console.log('dataset1', dataset1)
        dataset2.push(this.exchangeSummary.rates[i][1].GBP)
      }
      
      series1.data = dataset1;
      series1.label = "CHF";
      series2.data = dataset2;
      series2.label = "GBP";
      
      this.chartData.push(series1);
     // let series2 = {data: dataset2, label: "GBP"};
      this.chartData.push(series2);
     // this.articles = data.getDocs();
     console.log('this.chartLabels', this.chartLabels)
     console.log('this.chartData', this.chartData)
     // create the chart now we have the data
     this.createBarChart();
    }, err => {
    console.error(err);        
  });

    this.mybase$ = this.myrates$.pipe(
      map(res => ({
        base: res.getBase(),
        start_at: res.getStart(),
        end_at: res.getEnd(),
        rates: res.getExchangeRates()
      }))
    );
  }

  logout(){
    this._userService.logout();
    this._router.navigate([`/login`]);
  }

  // LATER MOVE ALL THIS CHART STUFF TO CHART SERVICE
  ionViewDidEnter() {
    //this.createLineChart();
    this.generateColorArray(2);
    this.searchRates();
  }

}
