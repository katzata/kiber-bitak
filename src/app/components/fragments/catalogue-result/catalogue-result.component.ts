import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalogue-result',
  templateUrl: './catalogue-result.component.html',
  styleUrls: ['./catalogue-result.component.css']
})
export class CatalogueResultComponent {
  @Input() res: any;
};
