import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-catalogue-result',
  templateUrl: './catalogue-result.component.html',
  styleUrls: ['./catalogue-result.component.css']
})
export class CatalogueResultComponent implements OnInit {

  @Input() res: any;
  constructor() {
    this.res.subscribe((data: any) => {
      console.log(data);
      
    })
  }

  ngOnInit(): void {
    console.log(this.res);
    
  }

}
