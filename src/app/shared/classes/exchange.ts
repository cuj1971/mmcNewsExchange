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
        console.log('in getBase:');
        console.log('base', this.rawResponse.base);
        return this.rawResponse.base;
    }

    public getStart(): string {
        console.log('in getStart:');
        console.log('start_at', this.rawResponse.start_at);
        return this.rawResponse.start_at;
    }

    public getEnd(): string {
        console.log('in getEnd:');
        console.log('end_at', this.rawResponse.end_at);
        return this.rawResponse.end_at;
        ;
    }

    public getExchangeRatesOld() {
        const myObj = this.rawResponse.rates;
        for (const prop1 in myObj) {
           // console.log(`${prop1}`);
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
/*
        for (const prop1 in myObj) {
           // console.log(`${prop1}`);
            for (const prop2 in myObj[prop1]) {
                console.log(`${prop1}.${prop2} = ${myObj[prop1][prop2]}`); 
            }
        }
        */
        console.log('jsonData[]: ', jsonData);
        return jsonData;
    }

}
