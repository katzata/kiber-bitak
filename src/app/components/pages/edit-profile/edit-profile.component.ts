import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  submitBlocked: boolean = false;

  editForm = this.formBuilder.group({
    username: new FormControl("", {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur'
    }),
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur'
    }),
    newPassword: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur'
    }),
    repeatNewPassword: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur'
    }),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.userData();

    if (user) {
      this.editForm.patchValue({
        username: user.username,
        email: user.email
      });
    };
  };

  onSubmit() {
    const id = this.authService.userData()!.id;
    this.authService.update(id, this.editForm.value).subscribe(data => {
      // console.log("yay", data); ba4ka
      
    })
  };
};
