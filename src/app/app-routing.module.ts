import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AuthPageComponent } from './components/pages/auth-page/auth-page.component';
import { CatalogueComponent } from './components/pages/catalogue/catalogue.component';
import { CreateProductComponent } from './components/pages/create-product/create-product.component';
import { DetailsPageComponent } from './components/pages/details-page/details-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';

const routes: Routes = [
  { path: "home", component: HomePageComponent },
  { path: "register", component: AuthPageComponent },
  { path: "login", component: AuthPageComponent },
  { path: "catalogue", component: CatalogueComponent },
  { path: "create", component: CreateProductComponent },
  { path: "details/:model/:id", component: DetailsPageComponent },
  { path: "profile", component: ProfilePageComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
