import {Component, Injectable, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';
import {Router} from '@angular/router';
import {UserService} from '../service/user/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
@Injectable()
export class SigninComponent implements OnInit {

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private appComponent: AppComponent,
    private signInService: SigninService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // this.checkAuth();
  }

  // ログインする
  // ・認証トークンを取得してLocalStorageにセット
  // ・ユーザー情報を取得してAppComponent(永続化できる場所)にセット
  signIn(f: NgForm) {
    const accountName = f.value.accountName;
    this.signInService.getAuthToken(accountName, f.value.password).subscribe(response => {
      localStorage.setItem('authToken', response.token);
      this.signInService.getAuthUser().subscribe(res => {
        if (res.user_id !== null) {
          this.appComponent.userId = res.user_id;
          this.appComponent.accountName = accountName;
          this.appComponent.profileImageLink = res.profile_image_link;
          const url = 'user/' + accountName;
          this.router.navigate([url]);
        }
      });
    });
    this.router.navigate(['login']);
  }

  // 新規ユーザー登録する
  // TODO:認証ユーザーとユーザーを同一トランザクションで扱えるようにする
  signUp(f: NgForm) {
    const accountName = f.value.accountName;
    const username = f.value.username;
    const email = f.value.email;
    const description = f.value.description;
    const imageLink = f.value.imageLink;
    const password = f.value.password;
    this.signInService.registerUser(accountName, email, password).subscribe(res => {
      const authUserId = res.id;
      if (authUserId !== null) {
        this.userService.registerUser(authUserId, accountName, username, description, imageLink).subscribe(data => {
          this.signInService.getAuthToken(f.value.username, f.value.password).subscribe(response => {
            localStorage.setItem('authToken', response.token);
            const url = 'user/' + accountName + '/';
            this.router.navigate([url]);
          });
        });
      }
    });
    this.router.navigate(['login']);
  }

  // ユーザー情報更新
  reloadUser() {
    this.signInService.getAuthUser()
      .subscribe(response => {
        const user = response;
        this.appComponent.userId = user.user_id;
        this.appComponent.accountName = user.account_name;
        this.appComponent.profileImageLink = user.profile_image_link;
      });
  }

  // ログアウトする（認証トークンをCookieから削除する）。
  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accountName');
    this.appComponent.userId = null;
    this.appComponent.accountName = null;
    this.appComponent.profileImageLink = null;
    this.router.navigate(['dashboard']);
  }

  // checkAuth() {
  //   this.isAuthError = localStorage.getItem('authToken') === null;
  // }
}
