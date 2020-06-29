import * as moment from 'moment';
export interface INewYorkTimesResponseDoc {
    pub_date: string
    web_url: string
    abstract: string
    lead_paragraph: string
    headline: {
      main: string
    }
  }
  
  export interface INewYorkTimesResponseMeta {
    hits: number
    offset: number
    time: number
  }
  
  export interface INewYorkTimesResponse {
    meta: {
      hits: number
      offset: number
      time: number
    }
    docs: INewYorkTimesResponseDoc[]    
  }
  
  export interface INewYorkTimesFullJSON {
      status: string
      copyright: string
      response: INewYorkTimesResponse
  }

  export interface INewYorkTimesFullJSONold {
    rawResponse: {
      status: string
      copyright: string
      response: INewYorkTimesResponse
    }
  }

  export interface INewYorkTimes {
    rawResponse: INewYorkTimesFullJSON
  }