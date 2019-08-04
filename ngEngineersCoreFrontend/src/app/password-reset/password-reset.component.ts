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

  token = this.route.snapshot.paramMap.get('token');
  verifiedAuthUserId: number;
  verifiedEmail: string;
  verified = false;
  verifySuccess = false;
  updatedPassword = false;
  validationErrors: string[];
  updatePasswordFailed = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private signupService: SignupService,
    private signinService: SigninService,
  ) {
  }

  ngOnInit() {
    this.verifyPasswordReminderToken();
  }

  verifyPasswordReminderToken(): void {
    // トークンでメールアドレスを認証する。
    this.signinService.verifyPasswordReminder(this.token).subscribe(data => {
      // トークンで有効なメールアドレス取得できた
      if (data.count === 1) {
        this.verifiedEmail = data.results[0].email;
        this.verifiedAuthUserId = data.results[0].id;
        this.verifySuccess = true;
        this.verified = true;
      } else {
        this.verified = true;
      }
    }, error => {
      // トークンでメールアドレスが取得できなかった場合は無効なトークン
      this.verified = true;
    });
  }

  // 新規ユーザー登録する
  // TODO:認証ユーザーとユーザーを同一トランザクションで扱えるようにする
  resetPassword(f: NgForm) {
    const password = f.value.password;
    this.signinService.resetPassword(this.token, password).subscribe(res => {
      if (res.success) {
        // パスワード変更に成功した場合は成功した画面を出す
        this.verifySuccess = false;
        this.updatedPassword = true;
      } else {
        this.updatePasswordFailed = true;
      }
    }, error => {
      // パスワード変更に失敗した場合は失敗メッセージ出す
      this.updatePasswordFailed = true;
      this.validationErrors = error.error.reasons;
    });
  }
}
