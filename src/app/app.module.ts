import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { HeaderComponent } from './components/core/header/header.component';
import { AuthPageComponent } from './components/pages/auth-page/auth-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { CatalogueComponent } from './components/pages/catalogue/catalogue.component';
import { SectionResultsComponent } from './components/shared/section-results/section-results.component';
import { CreateProductComponent } from './components/pages/create-product/create-product.component';
import { HoverDirective } from './components/shared/section-results/directives/hover.directive';
import { SectionResultsService } from './components/shared/section-results/services/section-results.service';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { AuthService } from './components/shared/services/auth.service';
import { DetailsPageComponent } from './components/pages/product-details-page/product-details-page.component';
import { CatalogueButtonComponent } from './components/fragments/catalogue-button/catalogue-button.component';
import { CarouselComponent } from './components/fragments/carousel/carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    AuthPageComponent,
    HomePageComponent,
    CatalogueComponent,
    SectionResultsComponent,
    CreateProductComponent,
    HoverDirective,
    ProfilePageComponent,
    DetailsPageComponent,
    CatalogueButtonComponent,
    CarouselComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [SectionResultsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
