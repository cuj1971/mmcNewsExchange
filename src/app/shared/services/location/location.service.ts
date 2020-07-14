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
  }

  watchPosition() {
    const wait = Geolocation.watchPosition({}, (position, err) => {
    })
  }
}
