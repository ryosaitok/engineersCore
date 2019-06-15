import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {AppComponent} from '../app.component';
import {SignupService} from '../service/signup/signup.service';
import {SigninService} from '../service/signin/signin.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  verifiedEmail: string;
  verified = false;
  verifySuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private signupService: SignupService,
    private signinService: SigninService,
  ) {
  }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken(): void {
    const token = this.route.snapshot.paramMap.get('token');
    // トークンでメールアドレスを認証する。
    this.signupService.verifyEmail(token).subscribe(res => {
      // トークンで有効なメールアドレス取得できた
      if (res.email !== null && res.email !== undefined) {
        this.verifiedEmail = res.email;
        this.verifySuccess = true;
        this.verified = true;
      }
    }, error => {
      // トークンでメールアドレスが取得できなかった場合は無効なトークン
      this.verified = true;
    });
    //
    // this.verifiedEmail = 'testZZZ@example.com';
    // this.verifySuccess = true;
    // this.verified = true;
  }

  // 新規ユーザー登録する
  // TODO:認証ユーザーとユーザーを同一トランザクションで扱えるようにする
  resetPassword(f: NgForm) {
    const password = f.value.password;
    this.signinService.getAuthUsersByEmail(this.verifiedEmail).subscribe(data => {
      if (data.count === 1) {
        const authUserId = data.results[0].id;
        this.signinService.updatePassword(authUserId, password).subscribe(res => {
          // パスワード変更に成功した場合は成功した画面を出す
        }, error => {
          // パスワード変更に失敗した場合は失敗メッセージ出す
        });
      }
    });
  }
}
