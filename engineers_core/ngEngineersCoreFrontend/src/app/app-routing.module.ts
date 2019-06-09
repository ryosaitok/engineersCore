import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {SigninComponent} from './signin/signin.component';
import {BookCommentComponent} from './book-comment/book-comment.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './search/search.component';
import {ShelfComponent} from './shelf/shelf.component';
import {ShelfDetailComponent} from './shelf-detail/shelf-detail.component';
import {SignupComponent} from './signup/signup.component';

const routes: Routes = [
  {path: '', redirectTo: '/shelves', pathMatch: 'full'},
  {path: 'login', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user/:accountName', component: UserDetailComponent},
  {path: 'book/:id', component: BookDetailComponent},
  {path: 'bookcomment/:id', component: BookCommentComponent},
  {path: 'search', component: SearchComponent},
  {path: 'shelves', component: ShelfComponent},
  {path: 'shelf/:shelfCd', component: ShelfDetailComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
