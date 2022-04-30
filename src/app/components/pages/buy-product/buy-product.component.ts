import { Component, OnInit } from '@angular/core';
import { BuyProductService } from '../../services/buy-product-service/buy-product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {
  product!: any;

  constructor(
    private buyProductService: BuyProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((item: any) => {
      this.buyProductService.getproduct(item.id)
        .then((data: any) => {
          console.log(data);
          this.product = {
            id: data.id,
            ...data.attributes
          };
        })
        .catch((err: any) => console.log(err));
    });
  }

}
