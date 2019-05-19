import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';
import {UserService} from '../service/user/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private appComponent: AppComponent,
    private signinService: SigninService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      this.userService.getUser(response.account_name).subscribe(res => {
        const user = res;
        this.appComponent.userId = user.user_id;
        this.appComponent.accountName = user.account_name;
        this.appComponent.profileImageLink = user.profile_image_link;
      });
    }, error => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.profileImageLink = null;
    });
  }

}
