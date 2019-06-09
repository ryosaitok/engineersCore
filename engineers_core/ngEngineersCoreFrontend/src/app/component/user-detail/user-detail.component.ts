import {ActivatedRoute, Router} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../dto/user/user';
import {UserService} from '../../service/user/user.service';
import {BookCommentService} from '../../service/book-comment/book-comment.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {InterestedBookService} from '../../service/interested-book/interested-book.service';
import {CommentFavoriteService} from '../../service/comment-favorite/comment-favorite.service';
import {SigninService} from '../../service/signin/signin.service';
import {AppComponent} from '../../app.component';
import {AuthGuard} from '../../guard/auth.guard';
import {InterestedBook} from '../../dto/interested-book/interested-book';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  faHeart = faHeart;
  faCommentDots = faCommentDots;

  accountName = this.route.snapshot.paramMap.get('accountName');
  userId: number;
  @Input() user: User;
  bookComments: any[];
  bookCommentCount: number;
  interestedBooks: InterestedBook[];
  interestedBookCount: number;
  favoriteCommentCount: number;
  knowledgeScore: number;
  readBookSelected = 'selected';
  interestedBookSelected = '';
  favoriteCommentSelected = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private userService: UserService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
    private signinService: SigninService,
    private commentFavoriteService: CommentFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.getUser();
    this.getReadBookComments();
    this.getInterestedBookCount();
    this.getFavoriteCommentCount();
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      this.userService.getUser(response.account_name).subscribe(res => {
        const user = res;
        this.appComponent.userId = user.id;
        this.appComponent.accountName = user.account_name;
        this.appComponent.userName = user.user_name;
        this.appComponent.profileImageLink = user.profile_image_link;
        this.appComponent.isLoggedIn = true;
      });
    }, error => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.userName = null;
      this.appComponent.profileImageLink = null;
      this.appComponent.isLoggedIn = false;
    });
  }

  getUser(): void {
    this.userService.getUser(this.accountName).subscribe(response => {
      this.userId = response.id;
      this.user = new User(
        response.id,
        response.user_name,
        response.account_name,
        response.description,
        response.profile_image_link);
    });
  }

  getReadBookComments(): void {
    this.bookCommentService.getBookCommentsByAccountName(this.accountName).subscribe(data => {
      this.bookComments = data.results;
      this.bookCommentCount = data.count;
      this.knowledgeScore = 0;
      data.results.forEach(res => {
        this.knowledgeScore = this.knowledgeScore + res.book.offer_price;
      });
    });
    this.readBookSelected = 'selected';
    this.interestedBookSelected = '';
    this.favoriteCommentSelected = '';
  }

  getInterestedBooks(): void {
    this.interestedBookService.getInterestedBookByAccountName(this.accountName).subscribe(data => {
      this.interestedBookCount = data.count;
      if (this.interestedBookCount > 0) {
        this.interestedBooks = this.interestedBookService.convertInterestedBooks(data.results);
      }
    });
    this.readBookSelected = '';
    this.interestedBookSelected = 'selected';
    this.favoriteCommentSelected = '';
  }

  getFavoriteBookComments(): void {
    this.bookCommentService.getBookComments().subscribe(data => {
        this.bookComments = [];
        data.results.forEach(res => {
          // いいねしているコメントのみ表示する
          if (res.favorite_users.indexOf(this.userId) >= 0) {
            this.bookComments.push(res);
          }
        });
      }
    );
    this.readBookSelected = '';
    this.interestedBookSelected = '';
    this.favoriteCommentSelected = 'selected';
  }

// TODO: ryo.saito countのAPIに切り替える
  getInterestedBookCount(): void {
    this.interestedBookService.getInterestedBookByAccountName(this.accountName).subscribe(data => {
      this.interestedBookCount = data.count;
    });
  }

// TODO: ryo.saito countのAPIに切り替える
  getFavoriteCommentCount(): void {
    this.commentFavoriteService.getCommentFavoritesByAccountName(this.accountName).subscribe(data => {
      this.favoriteCommentCount = data.count;
    });
  }

  commentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.commentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.commentFavoriteService.registerCommentFavorite(loggedInUserId, commentId).subscribe(
          (res) => {
            this.bookComments[index].favorite_users.push(loggedInUserId);
          },
          (error) => {
            console.error('commentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('commentFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'commentId: ' + commentId);
      }
    });
  }

  notCommentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.commentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.commentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.bookComments[index].favorite_users.indexOf(loggedInUserId);
            this.bookComments[index].favorite_users.splice(userIdIndex, 1);
          },
          (error) => {
            console.log('notCommentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
      }
    });
  }
}
