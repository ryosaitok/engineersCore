import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {

  constructor(
    private appComponent: AppComponent,
    private signinService: SigninService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      const user = response;
      this.appComponent.userId = user.user_id;
      this.appComponent.accountName = user.account_name;
    }, error => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
    });
  }

}
