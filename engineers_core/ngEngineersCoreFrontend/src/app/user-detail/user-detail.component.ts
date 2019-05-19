import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../service/user/user.service';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {InterestedBookService} from '../service/interested-book/interested-book.service';
import {CommentFavoriteService} from '../service/comment-favorite/comment-favorite.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;
  bookComments: any[];
  bookCommentCount: number;
  interestedBookCount: number;
  favoriteCommentCount: number;
  knowledgeScore: number;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
    private commentFavoriteService: CommentFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getUser();
    this.getBookComments();
    this.getInterestedBookCount();
    this.getFavoriteCommentCount();
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
      this.bookCommentCount = Object.keys(data).length;
    });
  }

  // TODO: ryo.saito countのAPIに切り替える
  getInterestedBookCount(): void {
    const accountName = this.route.snapshot.paramMap.get('accountName');
    this.interestedBookService.getInterestedBookByAccountName(accountName).subscribe(data => {
      this.interestedBookCount = Object.keys(data).length;
    });
  }

  // TODO: ryo.saito countのAPIに切り替える
  getFavoriteCommentCount(): void {
    const accountName = this.route.snapshot.paramMap.get('accountName');
    this.commentFavoriteService.getCommentFavoritesByAccountName(accountName).subscribe(data => {
      this.favoriteCommentCount = Object.keys(data).length;
    });
  }

}
