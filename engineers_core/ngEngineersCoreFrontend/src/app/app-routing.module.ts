import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {BooksComponent} from './books/books.component';
import {BookDetailComponent} from './book-detail/book-detail.component';
import {SigninComponent} from './signin/signin.component';
import {AuthGuard} from './guard/auth.guard';
import {BookCommentComponent} from './book-comment/book-comment.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './search/search.component';
import {FeatureBookComponent} from './feature-book/feature-book.component';
import {FeatureBookDetailComponent} from './feature-book-detail/feature-book-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:accountName', component: UserDetailComponent },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard]},
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'bookcomment/:id', component: BookCommentComponent },
  { path: 'search', component: SearchComponent },
  { path: 'feature/book', component: FeatureBookComponent },
  { path: 'feature/book/:categoryCd', component: FeatureBookDetailComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
