import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../user';
import { UserService } from '../service/user/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser(): void {
    const userAccountName = this.route.snapshot.paramMap.get('userAccountName');
    this.userService.getUser(userAccountName).subscribe(response => {
      this.user = new User(
        response.id,
        response.user_name,
        response.account_name,
        response.description,
        response.account_name);
    });
  }

  goBack(): void {
    this.location.back();
  }

}
