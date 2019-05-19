import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../service/user/user.service';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;
  bookComments: any[];
  bookCommentCount: number;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bookCommentService: BookCommentService,
  ) {}

  ngOnInit() {
    this.getUser();
    this.getBookComments();
  }

  getUser(): void {
    const userAccountName = this.route.snapshot.paramMap.get('accountName');
    this.userService.getUser(userAccountName).subscribe(response => {
      this.user = new User(
        response.id,
        response.user_name,
        response.account_name,
        response.description,
        response.profile_image_link);
    });
  }

  getBookComments(): void {
    const accountName = this.route.snapshot.paramMap.get('accountName');
    this.bookCommentService.getBookCommentsByAccountName(accountName).subscribe(data => {
        this.bookComments = data;
        this.bookCommentCount = 0;
        data.forEach(comment => {
          if (comment.id !== null && comment.id !== undefined) {
            this.bookCommentCount = this.bookCommentCount + 1;
          }
        });
      }
    );
  }

}
