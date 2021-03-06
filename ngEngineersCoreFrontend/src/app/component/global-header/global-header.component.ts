import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {faBars, faBookReader, faSearch, faBell, faCrown} from '@fortawesome/free-solid-svg-icons';

import {SigninService} from '../../service/signin/signin.service';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {

  faBars = faBars;
  faBookReader = faBookReader;
  faSearch = faSearch;
  faBell = faBell;
  faCrown = faCrown;

  constructor(
    private router: Router,
    public appComponent: AppComponent,
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
        this.appComponent.userId = user.id;
        this.appComponent.accountName = user.account_name;
        this.appComponent.userName = user.user_name;
        this.appComponent.profileImageLink = user.profile_image_link;
        this.appComponent.isLoggedIn = true;
      });
    }, error => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.userName = null;
      this.appComponent.profileImageLink = null;
      this.appComponent.isLoggedIn = false;
    });
  }

  // ログアウトする（認証トークンをCookieから削除する）。
  signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('accountName');
    this.appComponent.userId = null;
    this.appComponent.accountName = null;
    this.appComponent.userName = null;
    this.appComponent.profileImageLink = null;
    this.appComponent.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
