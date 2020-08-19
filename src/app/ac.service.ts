import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, from, throwError} from 'rxjs';
import {catchError, map, mergeMap, flatMap, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AcService {

  constructor(private http: HttpClient) {
  }

  getACSplitUnits(): Observable<ACSplitUnit[]> {
    return of([
      {
        name: "Salon",
        hostname: "192.168.2.208"
      }
    ])
     .pipe(
       //https://stackoverflow.com/questions/40788163/how-to-make-nested-observable-calls-in-angular2
       map(acSplitUnits =>
         acSplitUnits.map((acSplitUnit) => {
           settings:this.getACSplitUnitSettings(acSplitUnit).subscribe(() => {

           })
           return {
             ...acSplitUnit,

           }
         })
       )
     )
  }

  setACSplitUnitSettings(acSplitUnit: ACSplitUnit): Observable<void> {
    return this.http.post<void>(`http://${acSplitUnit.hostname}/aircon/set_control_info?pow=${acSplitUnit.settings.power ? '1' : '0'}&mode=3&stemp=${acSplitUnit.settings.temperature}&shum=0&f_rate=B&f_dir=3`, "");
  }

  getACSplitUnitSettings(acSplitUnit: ACSplitUnit): Observable<ACSplitUnitSettings> {
    return this.http.get<string>(`http://${acSplitUnit.hostname}/aircon/get_control_info`).pipe(map((result) => {
      let stringSettings = result.split(',');
      let parsedSettings: ACSplitUnitSettings = {};

      stringSettings.forEach((setting) => {
        let settingName = setting.split('=')[0];
        let settingValue = setting.split('=')[1];

        switch (settingName) {
          case 'pow':
            parsedSettings.power = (settingValue === '1');
            break;
          case 'stemp':
            parsedSettings.temperature = parseInt(settingValue);
            break;
          default:
            break;
        }

      })
      return parsedSettings;
    }));
  }
}

export class ACSplitUnit {
  name: string;
  hostname: string;
  settings?: ACSplitUnitSettings;
}

export class ACSplitUnitSettings {
  power?: boolean;
  temperature?: number;
}
