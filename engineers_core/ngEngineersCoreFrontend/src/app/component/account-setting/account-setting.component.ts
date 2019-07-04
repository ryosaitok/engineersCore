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
          this.url = '../../assets/image/profile/' + this.appComponent.profileImageLink;
        } else {
          this.url = '../../assets/image/profile/default_profile_image.png';
        }
        this.appComponent.description = res.description;
        this.appComponent.isLoggedIn = true;
      });
    }, error => {
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
      reader.onload = (e) => {
        this.url = e.target.result;
      };
    }
  }

  updateAccountSetting(form: NgForm) {
    const userName = form.value.userName;
    const accountName = form.value.accountName;
    const description = form.value.description;
    const now = new Date();
    const profileImageLink = accountName + now.getTime().toString();
    this.signinService.getAuthUser().subscribe(response => {
      this.userService.getUser(response.account_name).subscribe(res => {
        const userId = res.id;
        // this.accountSettingService.updateAuthUser(authUserId, accountName).subscribe(r => {
        const uploadData = new FormData();
        uploadData.append('myFile', this.selectedImage, this.selectedImage.name);
        this.accountSettingService.updateProfileImage(userId, uploadData).subscribe(resp => {
          console.log('JSON.stringify(resp):', JSON.stringify(resp));
        });
        this.accountSettingService.updateUser(userId, accountName, userName, description, profileImageLink)
          .subscribe(respon => {
            this.router.navigate(['user/' + accountName + '/']);
          });
        // });
      });
    });
  }
}
