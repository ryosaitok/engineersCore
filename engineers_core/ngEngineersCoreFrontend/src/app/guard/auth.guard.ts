import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {SigninService} from '../service/signin/signin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private signinService: SigninService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    // ログインしていない場合Login画面に飛ばす
    // TODO: ログインor新規登録 モーダル画面を表示するようにする。
    this.signinService.getAuthUser().subscribe(
      (response) => {
    }, (error) => {
      this.router.navigate(['login']);
      return false;
    });
    return true;
  }
}
