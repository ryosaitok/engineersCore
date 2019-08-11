import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard';
import {NgForm} from '@angular/forms';

import {AppComponent} from '../../app.component';
import {AccountSettingService} from '../../service/account-setting/account-setting.service';
import {SigninService} from '../../service/signin/signin.service';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {

  url = '';
  selectedImage: File;
  isEditAccountName = false;
  accountNameChanged = false;
  pageFound = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private accountSettingService: AccountSettingService,
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
        this.appComponent.userId = res.id;
        this.appComponent.accountName = res.account_name;
        this.appComponent.userName = res.user_name;
        this.appComponent.profileImageLink = res.profile_image_link;
        if (res.profile_image_link !== null) {
          this.url = this.appComponent.profileImageUrl + res.profile_image_link;
        } else {
          this.url = '../../assets/image/profile/default_profile_image.png';
        }
        this.appComponent.description = res.description;
        this.appComponent.isLoggedIn = true;
      });
    }, error => {
      this.pageFound = false;
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.userName = null;
      this.appComponent.profileImageLink = null;
      this.appComponent.description = null;
      this.appComponent.isLoggedIn = false;
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // ファイルをURLとして読み込み
      this.selectedImage = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: Event) => {
        this.url = reader.result.toString();
      };
    }
  }

  updateAccountSetting(form: NgForm) {
    const userName = form.value.userName;
    const description = form.value.description;
    if (this.selectedImage !== undefined) {
      this.accountSettingService.uploadProfileImage(this.appComponent.userId, this.selectedImage).subscribe(res => {
        // TODO: プロフィール画像更新時に即時反映するようにする。
      }, err => {
        // error
      });
    }
    this.accountSettingService.updateUser(this.appComponent.accountName, userName, description).subscribe(response => {
      this.router.navigate(['user/' + this.appComponent.accountName + '/']);
    }, error => {
      // error
    });
  }

  updateAccountName(form: NgForm) {
    const accountName = form.value.accountName;
    this.accountSettingService.updateAuthUser(accountName).subscribe(res => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.userName = null;
      this.appComponent.profileImageLink = null;
      this.appComponent.description = null;
      this.appComponent.isLoggedIn = false;
      this.accountNameChanged = true;
    }, err => {
      // error
    });
  }

  editAccountName(isEdit: boolean): void {
    this.isEditAccountName = isEdit;
  }
}
