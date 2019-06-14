import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AppRoutingModule} from './app-routing.module';
import {SocialLoginModule, AuthServiceConfig} from "angularx-social-login";
import {GoogleLoginProvider, FacebookLoginProvider} from "angularx-social-login";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {UsersComponent} from './component/users/users.component';
import {UserDetailComponent} from './component/user-detail/user-detail.component';
import {BookDetailComponent} from './component/book-detail/book-detail.component';
import {SigninComponent} from './component/signin/signin.component';
import {GlobalHeaderComponent} from './component/global-header/global-header.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './component/search/search.component';
import {ShelfComponent} from './component/shelf/shelf.component';
import {ShelfDetailComponent} from './component/shelf-detail/shelf-detail.component';
import {SignupComponent} from './component/signup/signup.component';
import {SigninService} from './service/signin/signin.service';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('423549286343-rtcdq6blghfv63o8tr2mhadrrp0655ee.apps.googleusercontent.com')
  },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider("Facebook-App-Id")
  // }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserDetailComponent,
    BookDetailComponent,
    SigninComponent,
    GlobalHeaderComponent,
    PageNotFoundComponent,
    SearchComponent,
    ShelfComponent,
    ShelfDetailComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    FormsModule,
    FontAwesomeModule,
    NgbButtonsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  exports: [],
  providers: [CookieService, SigninService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
