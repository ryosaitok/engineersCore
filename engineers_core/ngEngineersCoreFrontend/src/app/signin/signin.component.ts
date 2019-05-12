import {Component, Injectable, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';
import {Router} from '@angular/router';
import {UserService} from '../service/user/user.service';
import {error} from 'util';

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
    const accountName = f.value.username;
    this.signInService.getAuthToken(f.value.username, f.value.password).subscribe(response => {
      const authToken = response.token;
      if (authToken === null) {
        error('ログイン失敗！');
      }
      this.appComponent.accountName = accountName;
      localStorage.setItem('authToken', authToken);
      // TODO:ryo.saito 一旦LocalStorageを活用するが、ユーザーのアクセスできない場所に持たせるように改修する。
      localStorage.setItem('accountName', accountName);
    });
  }

  // ユーザー情報更新
  reloadUser() {
    this.signInService.getLoginUser()
      .subscribe(response => {
        const user = response.data;
        // TODO:ryo.saito データベース(Model)の持っているUserと認証で使うUserを揃える必要あり。
        this.appComponent.accountName = user.username;
        return user;
      });
  }

  // ログアウトする（認証トークンをCookieから削除する）。
  signOut() {
    localStorage.removeItem('authToken');
    this.appComponent.accountName = null;
    this.router.navigate(['dashboard']);
  }

  // checkAuth() {
  //   this.isAuthError = localStorage.getItem('authToken') === null;
  // }
}
