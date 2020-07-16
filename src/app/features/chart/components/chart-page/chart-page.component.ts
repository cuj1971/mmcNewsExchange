import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ExchangeService } from '../../../../shared/services/exchange/exchange.service';
import { Chart, ChartDataSets } from "chart.js";
import { UserService } from '../../../../shared/services/user/user.service';

@Component({
  selector: 'app-chart-page',
  templateUrl: './chart-page.component.html',
  styleUrls: ['./chart-page.component.scss']
})
export class ChartPageComponent {

  //public myrates$: Observable<Exchange>;
  public mybase$: Observable<any>
  public exchangeSummary = { rates: [], base: '', target: '', start_at: '', end_at: '' }; 

  chartData: ChartDataSets[] = [];
  chartLabels: any[] = [];
  @ViewChild('barChart') barChart;
  bars: any;
  colorArray: any;


  constructor(
    private _userService:UserService,
    private _router: Router,
    private _exchangeService: ExchangeService) { }

  // MAKE USER OF THE EXCHANGE SERVICE TO POPULATE CHART DATA
  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }

  createBarChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
          label: this.exchangeSummary.target,
          yAxisID: 'left-y-axis',
          data: this.chartData[0].data,
          backgroundColor: this.colorArray[1],
          borderColor: 'black',
          borderWidth: 3
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
            }
          ]
        }
      }
    });
  }

  searchRates() {

    let dataset1 = [];

    this._exchangeService
    .fetchAndGetRates()
    .subscribe(data => {
      let series1 = {data:[], label:""};
      this.chartData = [];
      this.chartLabels = [];
      this.exchangeSummary.start_at = data.getStart();
      this.exchangeSummary.end_at = data.getEnd();
      this.exchangeSummary.base = data.getBase();
      this.exchangeSummary.target = this._exchangeService.targetCurr;
      this.exchangeSummary.rates = data.getExchangeRates();

      for (let i = 0; i < this.exchangeSummary.rates.length; i++) {
        this.chartLabels.push(this.exchangeSummary.rates[i][0]);
        //dataset1.push(this.exchangeSummary.rates[i][1].USD);
        dataset1.push(this.exchangeSummary.rates[i][1][this.exchangeSummary.target]);
      }
      
      series1.data = dataset1;
      series1.label = this.exchangeSummary.target;
      
      this.chartData.push(series1);
     // create the chart now we have the data
      this.createBarChart();
      }, err => {
      console.error(err);        
    });    
  }

  logout(){
    this._userService.logout();
    this._router.navigate([`/login`]);
  }

  ionViewDidEnter() {
    this.generateColorArray(2);
    this.searchRates();
  }

}
