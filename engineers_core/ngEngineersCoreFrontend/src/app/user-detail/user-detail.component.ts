import {ActivatedRoute} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {User} from '../user';
import {UserService} from '../service/user/user.service';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {InterestedBookService} from '../service/interested-book/interested-book.service';
import {CommentFavoriteService} from '../service/comment-favorite/comment-favorite.service';
import {SigninService} from '../service/signin/signin.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  userId: number;
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
    private signinService: SigninService,
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
      this.userId = response.id;
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

  commentFavorite(commentId: number): void {
    console.log('commentFavorite。commentId ' + commentId);
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.length === 0) {
          this.commentFavoriteService.registerCommentFavorite(userId, commentId).subscribe(
            (res) => {
              console.log('registerCommentFavoriteしたよ。commentId: ' + commentId);
            },
            (error) => {
              console.error('commentFavoriteでerror: ' + error);
            }
          );
        } else {
          console.error('commentFavoriteが呼ばれるのおかしい。userId: ' + userId, 'commentId: ' + commentId);
        }
      });
    });
  }

  notCommentFavorite(commentId: number): void {
    console.log('notCommentFavorite。commentId ' + commentId);
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // データがある場合は削除する。
        if (data !== null && data !== undefined && data.length !== 0) {
          const favoriteId = data[0].id;
          this.commentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
            (res) => {
              console.log('deleteCommentFavoriteしたよ。commentId' + commentId);
            },
            (error) => {
              console.log('notCommentFavoriteでerror: ' + error);
            }
          );
        } else {
          console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
        }
      });
    });
  }
}
