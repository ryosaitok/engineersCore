import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {SigninComponent} from './signin/signin.component';
import {GlobalHeaderComponent} from './global-header/global-header.component';
import {BookCommentComponent} from './book-comment/book-comment.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './search/search.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {ShelfComponent} from './shelf/shelf.component';
import {ShelfDetailComponent} from './shelf-detail/shelf-detail.component';
import {SignupComponent} from './signup/signup.component';
import {SigninService} from './service/signin/signin.service';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserDetailComponent,
    BookDetailComponent,
    SigninComponent,
    GlobalHeaderComponent,
    BookCommentComponent,
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
    FormsModule,
    FontAwesomeModule,
    NgbButtonsModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [],
  providers: [CookieService, SigninService],
  bootstrap: [AppComponent]
})
export class AppModule { }
