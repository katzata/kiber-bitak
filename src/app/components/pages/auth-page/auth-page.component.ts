import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { FormGroup, FormBuilder, FormControl, Validators, ValidationErrors } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.css"],
})
export class AuthPageComponent implements OnInit {
  action: string = this.formatPath(this.router.url, "action");
  title: string = this.formatPath(this.router.url, "title");
  currentPath: string = "";
  linkPath: string = this.formatPath(this.router.url, "link");
  isRegistering: boolean = this.router.url === "/register";
  submitBlocked: boolean = false;
  
  loginForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required)
  });

  registerForm = this.formBuilder.group({
    username: new FormControl("", {
      validators: [Validators.required, Validators.minLength(3)],
      updateOn: 'blur'
    }),
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur'
    }),
    password: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6)],
      updateOn: 'blur'
    }),
    repeatPassword: new FormControl("", {
      validators: [Validators.required, Validators.minLength(6), this.passwordValidator],
      updateOn: 'blur'
    }),
  });

  currentForm: any = this.isRegistering ? this.registerForm : this.loginForm;

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    ) {
    this.titleService.setTitle(this.title);
  };
  
  ngOnInit(): void {

  };

  async onSubmit() {
    const errors: Array<Array<string>> | null = this.currentForm.status !== "VALID" ? this.formatErrors(this.currentForm.controls) : null;
    if (errors) return;

    interface action {
      [key: string]: Function;
    };

    const actions: action = {
      login: async (data: any) => this.authService.login(data),
      register: async (data: any) => this.authService.register(data)
    };

    this.submitBlocked = true;

    // if (this.action === "register") {
    //   await this.authService.register(this.currentForm.value)
    //     .then((data: any) => {
    //       this.router.navigate(["/home"]);
    //     });
        
    //     this.submitBlocked = false;
    // } else {
    //   await this.authService.login(this.currentForm.value)
    //     .then((data: any) => {
    //       this.router.navigate(["/home"]);
    //       console.log(data);
    //     });
        
    //     this.submitBlocked = false;
    // };

    await actions[this.action](this.currentForm.value)
      .then((test: any) => {
        this.router.navigate(["/"]);
      });

    this.submitBlocked = false;
  };

  private formatPath(path: string, type: string) {
    if (type === "action") {
      return path.slice(1);
    };
    
    if (type === "title") {
      return path.charAt(1).toLocaleUpperCase() + path.slice(2);
    };

    return path === "/register" ? "/login" : "/register"
  };

  passwordValidator(fc: FormControl) {
    if (fc.value !== fc.parent?.value.password) {
      return ({ passwordMatch: true });
    } else {
      return (null);
    };
  };

  private formatErrors(controls: FormGroup) {
    return Object.entries(this.currentForm.controls)
      .filter((el: any) => el[1].errors !== null)
      .map((el: any) => [el[0], Object.keys(el[1].errors)[0]]);
  };

  get username() {
    return this.currentForm.controls["username"];
  };

  get email() {
    return this.currentForm.controls["email"];
  };

  get password() {
    return this.currentForm.controls["password"];
  };

  get repeatPassword() {
    return this.currentForm.controls["repeatPassword"];
  };
};
