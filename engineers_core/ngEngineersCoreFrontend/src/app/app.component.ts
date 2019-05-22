import {Component} from '@angular/core';
import {AuthGuard} from './guard/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userId: number;
  accountName: string;
  userName: string;
  profileImageLink: string;

  appName = 'engineersCore';
  authErrorMessage = 'ログインする。';
  authMessage = 'ログイン中です。';

  constructor(public auth: AuthGuard) {
    // this.username = auth.getObservable();
  }
}
