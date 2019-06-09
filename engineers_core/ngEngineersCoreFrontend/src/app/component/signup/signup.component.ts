import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';

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

}
