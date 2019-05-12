import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {

  accountName: string;

  constructor(
    private appComponent: AppComponent,
    private signinService: SigninService,
  ) { }

  ngOnInit() {
    this.getLoginUserAccountName();
  }

  getLoginUserAccountName(): void {
    // TODO: ryo.saito ログイン中ユーザーを取得できるようにする
    // this.signinService.getLoginUser().subscribe(response => {
    //   this.appComponent.loginUserId = response.id;
    //   this.appComponent.accountName = response.username;
    // });
    const accountName = this.signinService.getLoginUserAccountNameDeprecated();
    this.accountName = accountName;
    console.log(accountName);
  }

}
