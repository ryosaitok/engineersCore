import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';
import {User} from '../../dto/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(response => {
      response.results.forEach(user => {
        this.users.push(new User(user.id, user.user_name, user.account_name, user.description, user.account_name));
      });
    });
  }

}
