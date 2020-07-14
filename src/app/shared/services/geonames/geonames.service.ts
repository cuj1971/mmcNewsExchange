import { Injectable } from '@angular/core';
import { LocationService } from '../location/location.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeonamesService {

  currentCoords: any;
  public country$: Observable<any>;
  public country: any;

  constructor(private _localisation: LocationService) {  }

  async handleGeoEvents() {
    await this._localisation.getCurrentPosition();
    this.currentCoords = this._localisation.data;
  }
}
