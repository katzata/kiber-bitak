import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { CatalogueService } from './services/catalogue.service';
import { ViewportScroller } from '@angular/common';

interface SimpleObject {
  [key: string]: any
};

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css'],
})

export class CatalogueComponent implements OnInit {
  results: Array<SimpleObject> = [];

  @ViewChild("price") priceButton!: HTMLInputElement;
  @ViewChild("header") header!: ElementRef;

  departments: SimpleObject = {
    electronics: "Electronics",
    vehicles: "Vehicles",
    fashion: "Fashion",
    tools: "Tools",
    furniture: "Furniture",
    books: "Books",
    hobbies: "Hobbies",
    misc: "Misc"
  };

  searchOptions: Array<string> = [
    "name",
    "price",
  ];

  sortCriteria: Object = {
    name: "Name",
    price: "Price"
  };

  sortOptions: Array<string> = [
    "unsorted",
    "ascending",
    "descending"
  ];

  searchForm = this.formBuilder.group({
    search: new FormControl("", [Validators.minLength(3)]),
    products: new FormControl(true),
    users: new FormControl(false),
    sortCriteria: new FormControl("name"),
    sortOrder: new FormControl("unsorted")
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private authService: AuthService,
    private catalogueService: CatalogueService,
    private viewportScroller: ViewportScroller,
    ) {
      this.titleService.setTitle("Catalogue");
  };

  ngOnInit(): void {
    // this.getProducts();
  };

  getProducts(): any {
    // this.catalogueService.getItems()
    //   .subscribe((data: Products[]) => {
    //     console.log(data);
        
    //     if (this.ready) {
    //       this.reset();
    //     } else {
    //       this.resolve!(data);
    //       this.ready = true;
    //     }
    //   });
  };

  getByDepartment(department: string) {
    this.scrollToSearch();
    // console.log(department);
  };

  toggleSortCriterias(target: EventTarget) {
    const { checked } = target as HTMLInputElement;
    const [name, price] = Array.from(document.querySelectorAll(".sort-radio-buttons")) as HTMLInputElement[];
   
    price.disabled = checked;
    price.checked = false;

    if (!name.checked) name.checked = true;
  };

  search() {
    const { search, products, users, sortCriteria, sortOrder } = this.searchForm.value;
    
    if (products || users) {
      this.catalogueService.search(this.searchForm.value).subscribe((data: any) => {
        this.results = data;
      });
    } else {
      throw new Error("You have to choose a search criteria.");
    };
  };

  handleSort(target: EventTarget) {
    const { value } = target as HTMLInputElement;

    if (this.results.length > 0 && value !== "unsorted") {
      console.log(this.searchForm.value);
      
      // this.search();
    };
  };

  private scrollToSearch() {
    this.viewportScroller.scrollToAnchor("search-section");
  };
};