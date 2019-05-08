import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SigninComponent } from './signin/signin.component';
import {AuthGuard} from './guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:userAccountName', component: UserDetailComponent },
  { path: 'books', component: BooksComponent, canActivate: [AuthGuard]},
  { path: 'book/:id', component: BookDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
