import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {BooksComponent} from './books/books.component';
import {SigninComponent} from './signin/signin.component';
import {GlobalHeaderComponent} from './global-header/global-header.component';
import {AuthGuard} from './guard/auth.guard';
import {BookCommentComponent} from './book-comment/book-comment.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './search/search.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import { FeatureBookComponent } from './feature-book/feature-book.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    UserDetailComponent,
    DashboardComponent,
    BookDetailComponent,
    BooksComponent,
    SigninComponent,
    GlobalHeaderComponent,
    BookCommentComponent,
    PageNotFoundComponent,
    SearchComponent,
    FeatureBookComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbButtonsModule,
    ModalModule.forRoot()
  ],
  exports: [],
  providers: [CookieService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
