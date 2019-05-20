import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {SigninService} from '../service/signin/signin.service';
import {CommentFavoriteService} from '../service/comment-favorite/comment-favorite.service';
import {UserService} from '../service/user/user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges {

  userId: number;
  @Input() bookComments: any[];
  bookCommentCount: number;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookCommentService: BookCommentService,
    private signinService: SigninService,
    private userService: UserService,
    private commentFavoriteService: CommentFavoriteService,
  ) {
  }

  ngOnInit(): void {
    this.getLoginUserId();
    this.searchBookCommentsByTitle();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getLoginUserId(): void {
    this.signinService.getAuthUser().subscribe(response => {
      this.userId = response.user_id;
    });
  }

  /**
   * 本のタイトルでLIKE検索し、本のIDで重複除いた結果のコメント一覧を取得する。
   */
  search(f: NgForm) {
    const query = f.value.query;
    this.router.navigate(['search/' + query + '/']);
  }

  /**
   * クエリパラメータに指定されたクエリで検索して検索結果を表示する
   */
  searchBookCommentsByTitle() {
    const title = this.route.snapshot.paramMap.get('title');
    this.bookCommentService.getBookCommentsByTitle(title).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data;
      this.bookCommentCount = Object.keys(data).length;
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
