import {Component} from '@angular/core';
import {User} from './user';
import {AuthGuard} from './guard/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appName = 'engineersCore';
  username: string;

  constructor(public auth: AuthGuard) {
    this.username = auth.getObservable();
  }
}
