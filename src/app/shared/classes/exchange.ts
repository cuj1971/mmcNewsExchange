import { IExchangeJSON } from '../interfaces/exchangeratesapi';

export class Exchange {
    public rawResponse: IExchangeJSON;
    
    constructor(data: IExchangeJSON) {
        this.rawResponse = data;
    }

    public getResponse(): IExchangeJSON {
        return this.rawResponse
      }

    public getBase(): string {
        return this.rawResponse.base;
    }

    public getStart(): string {
        return this.rawResponse.start_at;
    }

    public getEnd(): string {
        return this.rawResponse.end_at;
        ;
    }

    public getExchangeRatesOld() {
        const myObj = this.rawResponse.rates;
        for (const prop1 in myObj) {
            for (const prop2 in myObj[prop1]) {
                console.log(`${prop1}.${prop2} = ${myObj[prop1][prop2]}`); 
            }
        }
        return myObj;
    }

    public getExchangeRates() {
        const myObj = this.rawResponse;
        const rateCurrencyDates = Object.keys(myObj.rates);
        const rateCurrencyValues = Object.values(myObj.rates);
        let jsonData = [];

        if (rateCurrencyDates.length == 0){
            return;
        };
        
        for (let i = 0; i < rateCurrencyDates.length; i += 1) {
            jsonData.push([rateCurrencyDates[i], rateCurrencyValues[i]]);
        }

        jsonData.sort(function(a,b){
            let a1 = a[0];
            let a2 =  a1.split("-");
            let a3 = Number(a2[0]+a2[1]+a2[2]);

            let b1 = b[0];
            let b2 =  b1.split("-");
            let b3 = Number(b2[0]+b2[1]+b2[2]);
            return b3 - a3;
          });
  
        return jsonData;
    }

}
