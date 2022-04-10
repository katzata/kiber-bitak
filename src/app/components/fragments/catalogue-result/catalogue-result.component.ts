import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-catalogue-result',
  templateUrl: './catalogue-result.component.html',
  styleUrls: ['./catalogue-result.component.css']
})
export class CatalogueResultComponent implements OnInit {

  @Input() res: any;
  
  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    // console.log(this.res);
    // this.res.subscribe((params: any) => {
      
    //   // this.name = params['name'];
    // });
    
  }

}
