import{ INewYorkTimesFullJSON, INewYorkTimesResponse, INewYorkTimes, INewYorkTimesResponseMeta, INewYorkTimesResponseDoc} from '../interfaces/newyorktimes';
import * as moment from 'moment';

export class News {
        public rawResponse: INewYorkTimesFullJSON
   
        constructor(data: INewYorkTimesFullJSON) {
          this.rawResponse = data
        }
      
        public getResponse(): INewYorkTimesResponse {
          return this.rawResponse.response;
        }
      
        public getHits(): number {
          return this.rawResponse.response.meta.hits;
        }
      
        public getOffset(): number {
          return this.rawResponse.response.meta.offset
        }
      
        public getTime(): number {
          return this.rawResponse.response.meta.time
        }
              
        public getDocs(): INewYorkTimesResponseDoc[] {
          return this.rawResponse.response.docs.map(res => ({
              pub_date: res.pub_date,
              web_url: res.web_url,
              abstract: res.abstract,
              lead_paragraph: res.lead_paragraph,
              headline: {
                main: res.headline.main
              }
            }))
           // .slice(0, 10) // number of expected results 
        }
        
}