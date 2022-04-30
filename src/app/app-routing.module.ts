import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AuthPageComponent } from './components/pages/auth-page/auth-page.component';
import { CatalogueComponent } from './components/pages/catalogue/catalogue.component';
import { CreateProductComponent } from './components/pages/create-product/create-product.component';
import { DetailsPageComponent } from './components/pages/product-details-page/product-details-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { EditProductComponent } from './components/pages/edit-product/edit-product.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { ShoppingCartComponent } from './components/pages/shopping-cart/shopping-cart.component';
import { MailBoxComponent } from './components/pages/mail-box/mail-box.component';
import { BuyProductComponent } from './components/pages/buy-product/buy-product.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: "", component: HomePageComponent, canActivate: [AuthGuardService] },
  { path: "register", component: AuthPageComponent, canActivate: [AuthGuardService] },
  { path: "login", component: AuthPageComponent, canActivate: [AuthGuardService] },
  { path: "cart", component: ShoppingCartComponent, canActivate: [AuthGuardService] },
  { path: "catalogue", component: CatalogueComponent, canActivate: [AuthGuardService] },
  { path: "create", component: CreateProductComponent, canActivate: [AuthGuardService] },
  { path: "details/product/:id", component: DetailsPageComponent, canActivate: [AuthGuardService] },
  { path: "details/user/:id", component: ProfilePageComponent, canActivate: [AuthGuardService] },
  { path: "edit/product/:id", component: EditProductComponent, canActivate: [AuthGuardService] },
  { path: "buy/product/:id", component: BuyProductComponent, canActivate: [AuthGuardService] },
  { path: "edit/profile/:id", component: EditProfileComponent, canActivate: [AuthGuardService] },
  { path: "profile", component: ProfilePageComponent, canActivate: [AuthGuardService] },
  { path: "profile/mail/:id", component: MailBoxComponent, canActivate: [AuthGuardService] },
  { path: '**', component: NotFoundPageComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
