import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(response => {
      response.forEach(user => {
        // 4個だけ画面に渡す
        if (this.users.length < 4) {
          this.users.push(new User(user.id, user.user_name, user.account_name, user.description, user.account_name));
        }
      });
    });
  }
}
