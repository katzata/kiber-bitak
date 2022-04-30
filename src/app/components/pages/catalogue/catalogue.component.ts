import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { CatalogueService } from '../../services/catalogue-service/catalogue.service';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';
import { ViewportScroller } from '@angular/common';
import { Subject } from "rxjs";

interface T {
  [key: string]: any
};

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css'],
})

export class CatalogueComponent implements OnInit {
  results: Array<object[]> = [];

  @ViewChild("price") priceButton!: HTMLInputElement;
  @ViewChild("header") header!: ElementRef;

  departments: T = {
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
    "ascending",
    "descending"
  ];

  itemsPerPage: Array<string> = [ "10", "25", "50" ];
  paginationVisible: boolean = false;

  pages: T = {
    buttonArray: [],
    current: 0,
    total: 0
  };

  searchForm = this.formBuilder.group({
    search: new FormControl("", [Validators.minLength(3)]),
    products: new FormControl(true),
    users: new FormControl(false),
    sortCriteria: new FormControl("name"),
    sortOrder: new FormControl("ascending"),
    itemsPerPage: new FormControl("10"),
    page: new FormControl("0"),
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    // private authService: AuthService,
    private errorHandlingService: ErrorHandlingService,
    private catalogueService: CatalogueService,
    private viewportScroller: ViewportScroller,
    ) {
      this.titleService.setTitle("Catalogue");
      
      this.catalogueService.results.subscribe((response: any) => {
        let { sortCriteria, sortOrder, itemsPerPage } = this.searchForm.value;
        
        this.handlePagination(response.length, Number(itemsPerPage));
        this.sortResults(response, sortCriteria, sortOrder);
        
        this.results = this.formatResults(response, Number(itemsPerPage));
      });
  };

  ngOnInit(): void {
    // this.getProducts();
    window.onpopstate = function () {
      // alert("Back/Forward clicked!");
    }
  };

  getProducts(): any {
    // this.catalogueService.getItems()
    //   .subscribe((data: Products[]) => {
        
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
  };

  search() {
    let { search, products, users, sortCriteria, sortOrder, itemsPerPage } = this.searchForm.value;
    search = search.trim();

    if (search.length > 2 && products || users) {
      this.catalogueService.testSearch(this.searchForm.value);
    } else {
      const errors = [];
    
      if (!products && !users) {
        errors.push("You have to choose a search criteria.");
      };
    
      if (search.length < 3) {
        errors.push("The search query must be 3 characters at least.");
      };

      this.errorHandlingService.formErrors("serach", errors);
    };
  };
  // search() {
  //   let { search, products, users, sortCriteria, sortOrder, itemsPerPage } = this.searchForm.value;

  //   search = search.trim();
    
  //   if (search.length > 2 && products || users) {
  //     this.catalogueService.search(this.searchForm.value)
  //     .subscribe((data: any) => {
  //         this.handlePagination(data.length, Number(itemsPerPage));
  //         this.sortResults(data, sortCriteria, sortOrder);

  //         this.results = this.formatResults(data, Number(itemsPerPage));
  //       });
  //   } else {
  //     const errors = [];
      
  //     if (!products && !users) {
  //       errors.push("You have to choose a search criteria.");
  //     };
      
  //     if (search.length < 3) {
  //       errors.push("The search query must be 3 characters at least.");
  //     };

  //     this.errorHandlingService.formErrors("serach", errors);
  //   };
  // };

  handleSearchCriterias(target: EventTarget) {
    const query = this.searchForm.value.search.trim();
    const { checked } = target as HTMLInputElement;
    const [byName, byPrice] = Array.from(document.querySelectorAll(".sort-radio-buttons")) as HTMLInputElement[];

    byPrice.disabled = checked;
    byPrice.checked = false;
    
    if (!byName.checked) this.searchForm.patchValue({sortCriteria: "name"});

    if (query.length > 2 && this.results.length > 0) {
      this.search();
    };
  };

  handleSortCriterias() {
    const { search, products, users, sortCriteria, sortOrder, itemsPerPage } = this.searchForm.value;
    const results = this.results.flat();
    
    if (results.length > 1) {
      this.handlePagination(results.length, Number(itemsPerPage));
      this.sortResults(results, sortCriteria, sortOrder);
      this.results = this.formatResults(results, Number(itemsPerPage));
    };
  };

  changePage(page: number) {
    this.pages["current"] = page;
  };

  private scrollToSearch() {
    this.viewportScroller.scrollToAnchor("search-section");
  };

  formatResults(results: Array<object>, itemsPerPage: number) {
    const final: Array<Array<object>> = [[]];
    let index = 0;

    for (let i = 0; i < results.length; i++) {
      if (i === itemsPerPage) {
        final.push([]);
        index++;
      };

      final[index].push(results[i]);
    };
    
    return final;
  };

  sortResults(results: Array<object>, sortCriteria: string, sortOrder: string) {
    const collator = new Intl.Collator("en", {
      numeric: true,
      sensitivity: "base"
    });

    results.sort((a: any, b: any) => {
      let t1 = (a.name || a.username);
      let t2 = (b.name || b.username);

      if (sortCriteria === "price") {
        t1 = a.price;
        t2 = b.price;
      };

      return sortOrder === "ascending" ? collator.compare(t1, t2) : collator.compare(t2, t1);
    });
  };

  handlePagination(count: number, itemsPerPage: number) {
    const calc = Math.ceil(count / itemsPerPage);

    this.pages["buttonArray"] = [...Array(calc).keys()];
    this.pages["current"] = 0;
    this.pages["total"] = calc;
    this.paginationVisible = calc > 1 ? true : false;
  };
};