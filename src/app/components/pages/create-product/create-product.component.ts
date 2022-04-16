import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { CreateService } from './services/create.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/services/error-handling/error-handling.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
  imageArray: Array<Object> = [];
  submitBlocked: boolean = false;

  departments = {
    electronics: "Electronics",
    vehicles: "Vehicles",
    fashion: "Fashion",
    tools: "Tools",
    furniture: "Furniture",
    books: "Books",
    hobbies: "Hobbies",
    misc: "Misc"
  };

  createForm = this.formBuilder.group({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    department: new FormControl("", [Validators.required]),
    condition: new FormControl("", [Validators.required]),
    delivery: new FormControl("", [Validators.required]),
    price: new FormControl(Number, [Validators.required, Validators.min(1)]),
    location: new FormControl("", [Validators.required, Validators.minLength(5)]),
    images: "",
    imageData: [],
    description: new FormControl("", [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private create: CreateService,
    private errorService: ErrorHandlingService
  ) { 
    this.titleService.setTitle("Create");
  };

  onSubmit(): void {
    this.submitBlocked = true;
    const errors = this.checkInput(this.createForm.value);

    if (errors.length > 0) {
      this.submitBlocked = false;
      return this.errorService.formErrors("create", errors);
    };

    Object.values(this.createForm.value).map

    this.createForm.value.name = this.createForm.value.name.trim();
    this.createForm.value.location = this.createForm.value.location.trim();
    this.createForm.value.description = this.createForm.value.description.trim();

    this.create.addItem(this.createForm.value).subscribe((status: boolean) => {
      if (status) {
        this.router.navigate(["/catalogue"]);
      };
      
      this.submitBlocked = false;
    });
  };

  private checkInput(input: any) {
    const errors = [];

    for (const [field, value] of Object.entries(input)) {
      if (field === "images" || field === "imageData") continue;
      if (Number(value) < 1 || value === "" || value === Number) {
        errors.push(field);
      };
    };

    return errors;
  };

  addToQueue = (event: Event) => {
    const target: EventTarget = event.target as EventTarget;
    const files = (target as HTMLInputElement).files;

    if (files!.length > 5) {
      this.handleFirstFive(files);
    } else {
      this.handleFirstFive(files);
    };
  };

  handleFirstFive(files: FileList | null): void{
    const images: Array<Blob> = files!.length > 5 ? Array.from(files!).slice(0, 5) : Array.from(files!);
    
    for (const image of images) {
      this.imageArray.push(image);
    };

    this.createForm.patchValue({
      imageData: this.imageArray
    });
  };
};