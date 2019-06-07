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
    private router: Router,
  ) {
  }

  ngOnInit() {}

  // ログインする
  // ・認証トークンを取得してLocalStorageにセット
  // ・ユーザー情報を取得してAppComponent(永続化できる場所)にセット
  signIn(f: NgForm) {
    const accountName = f.value.accountName;
    this.signInService.getAuthToken(accountName, f.value.password).subscribe(response => {
      localStorage.setItem('authToken', response.token);
      this.signInService.getAuthUser().subscribe(r => {
        this.userService.getUser(r.account_name).subscribe(res => {
          if (res.user_id !== null) {
            this.appComponent.userId = res.id;
            this.appComponent.userName = res.user_name;
            this.appComponent.accountName = res.account_name;
            this.appComponent.profileImageLink = res.profile_image_link;
            this.appComponent.isLoggedIn = true;
            const url = 'user/' + accountName;
            this.router.navigate([url]);
          }
        });
      });
    });
    this.router.navigate(['login']);
  }
}
