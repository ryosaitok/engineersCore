import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {AppComponent} from '../../app.component';
import {AuthService} from 'angularx-social-login';
import {SigninService} from '../../service/signin/signin.service';

@Component({
  selector: 'app-password-reminder',
  templateUrl: './password-reminder.component.html',
  styleUrls: ['./password-reminder.component.css']
})
export class PasswordReminderComponent implements OnInit {

  sentMail = false;
  sentMailFailed = false;
  emailAddress: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appComponent: AppComponent,
    private signinService: SigninService,
  ) {
  }

  ngOnInit() {
  }

  sendPasswordReminder(f: NgForm): void {
    this.emailAddress = f.value.email;
    this.sentMailFailed = false;
    this.sentMail = false;
    // メールを送信するAPI叩く
    this.signinService.passwordReminderSend(this.emailAddress).subscribe(res => {
      if (res.success) {
        // メール送信処理に成功した場合は送信完了画面を表示
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
