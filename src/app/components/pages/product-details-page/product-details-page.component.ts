import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from './services/details.service';
import { Product } from "../../shared/models/Product.model";
import { AuthService } from '../../shared/services/auth/auth.service';
import { MessageService } from '../../shared/services/message/message.service';

@Component({
  selector: 'app-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css']
})
export class DetailsPageComponent implements OnInit {
  title: string = "Details";
  isLogged: boolean = this.authService.isLogged;
  isOwner: boolean = false;
  details: Product | null = null;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private authService: AuthService,
    private messageService: MessageService,
    private detailsService: DetailsService
  ) {
    this.titleService.setTitle("Details");
    
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.detailsService.getDetails(id).subscribe((data: Product) => {
        this.isOwner = this.authService.userData()!.id === data.seller.id;
        this.details = data;
      });
    });
  };

  ngOnInit(): void {
    // console.log(this.authService.isLogged);
  };

  contactSeller() {
    this.messageService.handleStatus(true);
  };
};
