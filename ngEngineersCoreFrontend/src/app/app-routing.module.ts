import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {UsersComponent} from './component/users/users.component';
import {UserDetailComponent} from './component/user-detail/user-detail.component';
import {BookDetailComponent} from './component/book-detail/book-detail.component';
import {SigninComponent} from './component/signin/signin.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {SearchComponent} from './component/search/search.component';
import {ShelfComponent} from './component/shelf/shelf.component';
import {ShelfDetailComponent} from './component/shelf-detail/shelf-detail.component';
import {SignupComponent} from './component/signup/signup.component';
import {VerifyEmailComponent} from './component/verify-email/verify-email.component';
import {PasswordReminderComponent} from './component/password-reminder/password-reminder.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';
import {ShelfRegisterComponent} from './component/shelf-register/shelf-register.component';
import {ShelfEditComponent} from './component/shelf-edit/shelf-edit.component';
import {AccountSettingComponent} from './component/account-setting/account-setting.component';

const routes: Routes = [
  {path: '', redirectTo: '/shelves', pathMatch: 'full'},
  {path: 'login', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signup/:token', component: VerifyEmailComponent},
  {path: 'password/reminder', component: PasswordReminderComponent},
  {path: 'password/reset/:token', component: PasswordResetComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user/:accountName', component: UserDetailComponent},
  {path: 'account/setting', component: AccountSettingComponent},
  {path: 'book/:id', component: BookDetailComponent},
  {path: 'search', component: SearchComponent},
  {path: 'shelves', component: ShelfComponent},
  {path: 'shelf/register', component: ShelfRegisterComponent},
  {path: 'shelf/:shelfId', component: ShelfDetailComponent},
  {path: 'shelf/edit/:shelfId', component: ShelfEditComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
