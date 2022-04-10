import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
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
// import { SectionResultsService } from './components/shared/section-results/services/section-results.service';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { GlobalErrorHandler } from './services/error-handling/GlobalErrorHandler';
import { ServerErrorInterceptor } from './services/error-handling/server-error.interceptor';
import { DetailsPageComponent } from './components/pages/product-details-page/product-details-page.component';
import { CatalogueButtonComponent } from './components/fragments/catalogue-button/catalogue-button.component';
import { CarouselComponent } from './components/fragments/carousel/carousel.component';
import { CatalogueResultComponent } from './components/fragments/catalogue-result/catalogue-result.component';
import { MessageModalComponent } from './components/fragments/message-modal/message-modal.component';
import { ErrorModalComponent } from './components/core/error-modal/error-modal.component';

import { EditProductComponent } from './components/pages/edit-product/edit-product.component';
import { EditProfileComponent } from './components/pages/edit-profile/edit-profile.component';
import { AuthGuardService } from './components/shared/services/auth-guard/auth-guard.service';
import { MailBoxComponent } from './components/pages/mail-box/mail-box.component';

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
    CarouselComponent,
    CatalogueResultComponent,
    MessageModalComponent,
    ErrorModalComponent,
    EditProductComponent,
    EditProfileComponent,
    MailBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  // providerite da se vidqt
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: AuthGuardService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
