import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
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
  bothChecked: boolean = false;

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
    price: "Price",
    date: "Date"
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
    const { name, value, checked } = target as HTMLInputElement;

    console.log(name, value, checked, this.searchForm);
    
  };

  handleSubmit = () => {
    // const user = new Parse.User();
    // user.set("username", "test username");
    // user.set("email", "test asd@asd.asd");
    // user.set("password", "test password");
    // user.set("rememberMe", "test rememberMe");

    // user.signUp(null).then(
    //   function (user: any) {
    //     alert('User created successfully with email: ' + user.get("email"));
    //   },

    //   function (error: any) {
    //     alert("Error " + error.code + ": " + error.message);
    //   }
    // );
  };

  search() {
    const { search, products, users, sortCriteria, sortOrder } = this.searchForm.value;
    // console.log(this.searchForm.value);
    
    if (products || users) {
      this.catalogueService.search(this.searchForm.value).subscribe((data: any) => {
        this.results = data;
      });
    } else {
      throw new Error("You have to choose a search criteria.");
    };
  };

  private scrollToSearch() {
    this.viewportScroller.scrollToAnchor("search-section");
  };
};