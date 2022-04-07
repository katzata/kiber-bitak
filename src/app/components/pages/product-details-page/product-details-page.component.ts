import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from './services/details.service';
import { Product } from "../../shared/models/Product.model";

@Component({
  selector: 'app-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css']
})
export class DetailsPageComponent implements OnInit {
  title: string = "Details";
  details: Product | null = null;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private detailsService: DetailsService
  ) {
    this.titleService.setTitle("Details");
    
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.detailsService.getDetails(id).subscribe((data: Product) => {
        // console.log(data);

        this.details = data;
      });
    });
  };

  ngOnInit(): void {
    
  };
};
