export interface IExchangeJSON {
    rates: {}
    start_at: string
    base: string    
    end_at: string    
  }

export interface IExchange {
    rawResponse: IExchangeJSON
}