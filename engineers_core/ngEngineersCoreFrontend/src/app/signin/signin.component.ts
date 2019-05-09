import {Component, Injectable, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
@Injectable()
export class SigninComponent implements OnInit {

  isAuthError = false;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private appComponent: AppComponent,
    private signInService: SigninService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuth();
  }

  // ログインする（認証トークンを取得してLocalStorageにセットする）。
  signIn(f: NgForm) {
    const tokenUserStr = this.signInService.getAuthToken(f.value.username, f.value.password);
    console.log(tokenUserStr);
    const tokenUser = JSON.parse(tokenUserStr);
    if (tokenUser.token !== null && tokenUser.username !== null) {
      localStorage.setItem('authToken', tokenUser.token);
      // TODO:ryo.saito Requestの持っているユーザー情報でユーザー情報を取得してappComponentに持たせるようにする。
      this.appComponent.username = tokenUser.username;
      this.isAuthError = false;
    } else {
      this.isAuthError = true;
    }
  }

  // ユーザー情報更新
  reloadUser() {
    this.signInService.getLoginUser()
      .subscribe(response => {
        const user = response.data;
        // TODO:ryo.saito データベース(Model)の持っているUserと認証で使うUserを揃える必要あり。
        this.appComponent.username = user.username;
        return user;
      });
  }

  // ログアウトする（認証トークンをCookieから削除する）。
  signOut() {
    localStorage.removeItem('authToken');
    this.appComponent.username = null;
    this.router.navigate(['dashboard']);
  }

  checkAuth() {
    this.isAuthError = localStorage.getItem('authToken') === null;
  }
}
