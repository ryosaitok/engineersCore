import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AppComponent} from '../../app.component';
import {SignupService} from '../../service/signup/signup.service';
import {UserService} from '../../service/user/user.service';
import {SigninService} from '../../service/signin/signin.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  verifiedEmail: string;
  verified = false;
  verifySuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appComponent: AppComponent,
    private signupService: SignupService,
    private signinService: SigninService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.verifyEmail();
  }

  verifyEmail(): void {
    const token = this.route.snapshot.paramMap.get('token');
    // トークンでメールアドレスを認証する。
    this.signupService.verifyEmail(token).subscribe(data => {
      // トークンで有効なメールアドレス取得できた
      if (data.count === 1) {
        this.verifiedEmail = data.results[0].email;
        this.verifySuccess = true;
        this.verified = true;
      }
    }, error => {
      // トークンでメールアドレスが取得できなかった場合は無効なトークン
      this.verified = true;
    });
  }

  // 新規ユーザー登録する
  // TODO:認証ユーザーとユーザーを同一トランザクションで扱えるようにする
  signUp(f: NgForm) {
    const accountName = f.value.accountName;
    const email = this.verifiedEmail;
    const password = f.value.password;
    this.signupService.registerUser(accountName, email, password).subscribe(res => {
      this.signinService.getAuthToken(accountName, password).subscribe(response => {
        localStorage.setItem('authToken', response.token);
        const url = 'user/' + accountName + '/';
        this.router.navigate([url]);
      });
    });
    this.router.navigate(['login']);
  }

  getRandomStr(): string {
    const LENGTH = 8;
    const SOURCE = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < LENGTH; i++) {
      result += SOURCE[Math.floor(Math.random() * SOURCE.length)];
    }
    return result;
  }
}
