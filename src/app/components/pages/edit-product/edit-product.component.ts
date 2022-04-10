import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { EditService } from './services/edit.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  imageArray: Array<Object> = [];
  submitBlocked: boolean = false;
  id!: string;

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

  editForm = this.formBuilder.group({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    department: new FormControl("", [Validators.required]),
    condition: new FormControl("", [Validators.required]),
    delivery: new FormControl("", [Validators.required]),
    price: new FormControl("", [Validators.required, Validators.min(1)]),
    quantity: new FormControl("", [Validators.required, Validators.min(1)]),
    location: new FormControl("", [Validators.required, Validators.minLength(5)]),
    images: "",
    imageData: [],
    description: new FormControl("", [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private editService: EditService
  ) {
    this.titleService.setTitle("Edit");
  };

  ngOnInit(): void {
    this.id = this.router.url.split("/")[3]
    
    this.editService.getData(this.id).subscribe((data: any) => {
      for (const [fieldName, value] of Object.entries(data.attributes)) {
        if (fieldName === "images") continue;

        if (this.editForm.controls.hasOwnProperty(fieldName)) {
          const field = Object.fromEntries([[fieldName, value]]);
          this.editForm.patchValue(field);
        };
      };
    });
  };

  onSubmit(): void {
    this.submitBlocked = true;
    this.editService.updateProduct(this.id, this.editForm.value)
      .subscribe((status: boolean) => {
      if (status) {
        this.router.navigate(["/catalogue"]);
      };

      this.submitBlocked = false;
    });
  };

  deleteItem(e: Event) {
    e.preventDefault();

    this.editService.deleteProduct(this.id, this.editForm.value)
      .subscribe((status: boolean) => {
      if (status) {
        this.router.navigate(["/catalogue"]);
      };

      this.submitBlocked = false;
    });
  }

  addToQueue = (event: Event) => {
    const target: EventTarget = event.target as EventTarget;
    const files = (target as HTMLInputElement).files;

    if (files!.length > 5) {
      this.handleFirstFive(files);
    } else {
      this.handleFirstFive(files);
    };
  };

  handleFirstFive(files: FileList | null): void {
    const images: Array<Blob> = files!.length > 5 ? Array.from(files!).slice(0, 5) : Array.from(files!);

    for (const image of images) {
      this.imageArray.push(image);
    };

    this.editForm.patchValue({
      imageData: this.imageArray
    });
  };
}
