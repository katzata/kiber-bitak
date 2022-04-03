import { Component, OnInit } from '@angular/core';
import { CreateService } from './services/create.service';
import { FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  imageArray: Array<Object> = [];

  createForm = this.formBuilder.group({
    department: new FormControl("", [Validators.required]),
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    condition: new FormControl("", [Validators.required]),
    price: new FormControl("", [Validators.required, Validators.min(0)]),
    quantity: new FormControl("", [Validators.required, Validators.min(1)]),
    location: new FormControl("", [Validators.required, Validators.minLength(5)]),
    images: "",
    imageData: [],
    description: new FormControl(""),
    moreInfo: new FormControl(""),
    owner: new FormControl("", [Validators.required, Validators.minLength(3)] )
  });

  constructor(
    private formBuilder: FormBuilder,
    private create: CreateService
    ) { }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    this.create.addItem(this.createForm.value).subscribe((data: any) => {
      console.log("yay", data);
    });
    // console.warn('Your order has been submitted', this.createForm.value);
    this.createForm.reset();
  }

  // selectFiles(event: Event): void {
  //   let element: HTMLElement = document.querySelector("#filesLabel") as HTMLElement;
  //   console.log(element);
    
  //   element.click();
  // };

  addToQueue = (event: Event) => {
    const target: EventTarget = event.target as EventTarget;
    const files = (target as HTMLInputElement).files;

    if (files!.length > 5) {
      this.handleFirstFive(files);
    } else {
      this.handleFirstFive(files);
    }
  };

  handleFirstFive(files: FileList | null): void{
    const images: Array<Blob> = files!.length > 5 ? Array.from(files!).slice(0, 5) : Array.from(files!);
    
    for (let i = 0; i < 5; i++) {
      // console.log(images[i]);
      this.imageArray.push(images[i]);
    };

    this.createForm.patchValue({
      imageData: this.imageArray
    });
    // for (const image of images) {
    //   const reader = new FileReader();
      
    //   reader.onload = (load: any) => {
    //     const test: File = image as File;

    //     const file: Object = {
    //       name: test.name,
    //       data: load.target.result
    //     }

    //     this.imageArray.push(file);

    //     this.createForm.patchValue({
    //       imageData: this.imageArray
    //     });
    //   };

    //   reader.readAsDataURL(image);
    // };
  };
};