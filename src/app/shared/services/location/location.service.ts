import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  data: any;

  constructor() { }

  async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();

    const {
      latitude = null,
      longitude = null
    } = coordinates.coords;
    this.data = {latitude, longitude};
    console.log('this.data', this.data)
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    })
  }
}
