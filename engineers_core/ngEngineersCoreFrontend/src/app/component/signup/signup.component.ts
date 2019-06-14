import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {AuthService} from 'angularx-social-login';

import {SigninService} from '../../service/signin/signin.service';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private appComponent: AppComponent,
    private signinService: SigninService,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  // 新規ユーザー登録する
  // TODO:認証ユーザーとユーザーを同一トランザクションで扱えるようにする
  signUp(f: NgForm) {
    const accountName = f.value.accountName;
    const username = f.value.username;
    const email = f.value.email;
    const password = f.value.password;
    this.signinService.registerUser(accountName, email, password).subscribe(res => {
      const authUserId = res.id;
      if (authUserId !== null) {
        this.userService.registerUser(authUserId, accountName, username, null, null).subscribe(r => {
          this.signinService.getAuthToken(username, password).subscribe(response => {
            localStorage.setItem('authToken', response.token);
            this.appComponent.userId = r.id;
            this.appComponent.accountName = accountName;
            this.appComponent.userName = username;
            this.appComponent.profileImageLink = null;
            this.appComponent.isLoggedIn = true;
            const url = 'user/' + accountName + '/';
            this.router.navigate([url]);
          });
        });
      }
    });
    this.router.navigate(['login']);
  }

  sendEmailVerification(f: NgForm): void {
    const email = f.value.email;
    // メールを送信するAPI叩く
    // メール送信処理に成功した場合はメール送信成功画面を表示
    // メール送信処理に失敗した場合はメール送信失敗画面を表示
  }

}
