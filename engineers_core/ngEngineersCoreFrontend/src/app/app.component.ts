import {Component} from '@angular/core';

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
  isLoggedIn: boolean;

  constructor() {
  }
}
