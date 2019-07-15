import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AppRoutingModule} from './app-routing.module';
import {AuthServiceConfig, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

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
import {VerifyEmailComponent} from './component/verify-email/verify-email.component';
import {PasswordReminderComponent} from './component/password-reminder/password-reminder.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {ShelfEditComponent} from './component/shelf-edit/shelf-edit.component';
import {ShelfRegisterComponent} from './component/shelf-register/shelf-register.component';
import {AccountSettingComponent} from './component/account-setting/account-setting.component';

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
    VerifyEmailComponent,
    PasswordReminderComponent,
    PasswordResetComponent,
    ShelfEditComponent,
    ShelfRegisterComponent,
    AccountSettingComponent,
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
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
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
