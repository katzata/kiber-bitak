import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './components/shared/services/auth-guard/auth-guard.service';

import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AuthPageComponent } from './components/pages/auth-page/auth-page.component';
import { CatalogueComponent } from './components/pages/catalogue/catalogue.component';
import { CreateProductComponent } from './components/pages/create-product/create-product.component';
import { DetailsPageComponent } from './components/pages/product-details-page/product-details-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { EditProductComponent } from './components/pages/edit-product/edit-product.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { MailBoxComponent } from './components/pages/mail-box/mail-box.component';

const routes: Routes = [
  { path: "home", component: HomePageComponent, canActivate: [AuthGuardService] },
  { path: "register", component: AuthPageComponent, canActivate: [AuthGuardService] },
  { path: "login", component: AuthPageComponent, canActivate: [AuthGuardService] },
  { path: "catalogue", component: CatalogueComponent, canActivate: [AuthGuardService] },
  { path: "create", component: CreateProductComponent, canActivate: [AuthGuardService] },
  { path: "details/product/:id", component: DetailsPageComponent, canActivate: [AuthGuardService] },
  { path: "details/user/:id", component: ProfilePageComponent, canActivate: [AuthGuardService] },
  { path: "edit/product/:id", component: EditProductComponent, canActivate: [AuthGuardService] },
  { path: "edit/profile/:id", component: EditProfileComponent, canActivate: [AuthGuardService] },
  { path: "profile", component: ProfilePageComponent, canActivate: [AuthGuardService] },
  { path: "profile/mail/:id", component: MailBoxComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
