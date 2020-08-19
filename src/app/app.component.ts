import {Component, OnInit} from '@angular/core';
import {AcService, ACSplitUnit} from "./ac.service";
import {Observable} from "rxjs";
import {map, flatMap} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ac-gui-app';
  acSplitUnits: Observable<ACSplitUnit[]>;

  constructor(private acControlService: AcService) {
  }

  ngOnInit() {
    this.acSplitUnits = this.acControlService.getACSplitUnits();
  }

  updateSettings(acSplitUnit: ACSplitUnit) {
    this.acControlService
      .setACSplitUnitSettings(acSplitUnit)
      .subscribe();
  }
}
