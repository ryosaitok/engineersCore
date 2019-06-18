import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {AuthService} from 'angularx-social-login';

import {SigninService} from '../../service/signin/signin.service';
import {SignupService} from '../../service/signup/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  sentMail = false;
  sentMailFailed = false;
  emailAddress: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appComponent: AppComponent,
    private signinService: SigninService,
    private signupService: SignupService,
  ) {
  }

  ngOnInit() {
  }

  sendEmailVerification(f: NgForm): void {
    const email = f.value.email;
    this.emailAddress = email;
    // メールを送信するAPI叩く
    this.signupService.emailVerificationSend(email).subscribe(res => {
      if (res.sent === true) {
        // メール送信処理に成功した場合はメール送信成功画面を表示
        this.sentMail = true;
      } else {
        this.sentMailFailed = true;
      }
    }, error => {
      // メール送信処理に失敗した場合はメール送信失敗画面を表示
      this.sentMailFailed = true;
    });
  }
}
