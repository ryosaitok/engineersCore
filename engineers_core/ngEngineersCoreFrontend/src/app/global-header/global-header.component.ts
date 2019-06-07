import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {SigninService} from '../service/signin/signin.service';
import {UserService} from '../service/user/user.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faBars, faBookReader} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.css']
})
export class GlobalHeaderComponent implements OnInit {

  displayDropdownMenu = false;
  faBars = faBars;
  faBookReader = faBookReader;

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

  clickDropdownMenu(): void {
    this.displayDropdownMenu = this.displayDropdownMenu === false;
  }

  /**
   * 本のタイトルでLIKE検索し、本のIDで重複除いた結果のコメント一覧を取得する。
   */
  search(f: NgForm) {
    const query = f.value.query;
    this.router.navigate(['search'], {queryParams: {title: query}});
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
    this.router.navigate(['dashboard']);
  }
}
