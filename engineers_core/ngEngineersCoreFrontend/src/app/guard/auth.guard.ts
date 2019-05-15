import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';
import {SigninService} from '../service/signin/signin.service';
import {User} from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // private loginUsername: string;

  constructor(
    private signinService: SigninService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    await this.checkAsync();
    // ログインしていない場合Login画面に飛ばす
    this.signinService.getAuthUser().subscribe(response => {
      if (response.id === null) {
        this.router.navigate(['login']);
        return false;
      }
    });
    return true;
  }

  // ログイン状態を確認します。
  // ログイン状態ならログイン情報が取得でき、未ログインの場合は空のオブジェクトがセットされます。
  async checkAsync() {
    // TODO: user情報を取得するAPIで改めてユーザー情報を取得したい。
  }

  // ログイン情報をリアルタイムに通知します。
  // 未ログインであれば空のオブジェクトが、
  // ログイン済みであればログイン情報がストリームに流れます。
  // getObservable(): string {
    // return this.loginUsername;
  // }
}
