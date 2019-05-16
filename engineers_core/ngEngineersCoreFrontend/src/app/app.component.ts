import {Component} from '@angular/core';
import {User} from './user';
import {AuthGuard} from './guard/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userId: string;
  accountName: string;
  profileImageLink: string;

  appName = 'engineersCore';
  authErrorMessage = 'ログインする。';
  authMessage = 'ログイン中です。';

  constructor(public auth: AuthGuard) {
    // this.username = auth.getObservable();
  }
}
