import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faCommentDots, faHeart, faSearch} from '@fortawesome/free-solid-svg-icons';
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
  bookCommentCount = 0;
  query: string;
  isSearchByTitle: boolean;
  isSearchByAuthor: boolean;
  isSearchByUser: boolean;

  faHeart = faHeart;
  faCommentDots = faCommentDots;
  faSearch = faSearch;
  titleSelected = '';
  authorSelected = '';
  userSelected = '';

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
    this.initQueryParameters();
    this.searchBookComments();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  initQueryParameters(): void {
    this.route.queryParams.subscribe(params => {
      if (params.title !== null && params.title !== undefined) {
        this.isSearchByTitle = true;
        this.query = params.title;
        this.addSelected(true, false, false);
      } else if (params.author !== null && params.author !== undefined) {
        this.isSearchByAuthor = true;
        this.query = params.author;
        this.addSelected(false, true, false);
      } else if (params.user !== null && params.user !== undefined) {
        this.isSearchByUser = true;
        this.query = params.user;
        this.addSelected(false, false, true);
      }
      console.log('query: ' + this.query + ', isSearchByTitle: ' + this.isSearchByTitle + ', isSearchByAuthor: '
        + this.isSearchByAuthor + ', isSearchByUser: ' + this.isSearchByUser);
    });
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
    const query = f.value.query.trim();
    this.router.navigate(['search'], {queryParams: {title: query}});
  }

  /**
   * 検索して検索結果を表示する。
   */
  searchBookComments() {
    this.query = this.query.trim();
    if (this.query === null || this.query === undefined || this.query === '') {
      return;
    }
    if (this.isSearchByTitle) {
      this.searchBookCommentsByTitle(this.query);
    } else if (this.isSearchByAuthor) {
      this.searchBookCommentsByAuthor(this.query);
    } else if (this.isSearchByUser) {
      this.searchBookCommentsByUser(this.query);
    }
  }

  /**
   * 本のタイトルで検索して検索結果を表示する
   */
  searchBookCommentsByTitle(title: string) {
    this.bookCommentService.getBookCommentsByTitle(title).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data;
      this.bookCommentCount = Object.keys(data).length;
      this.addSelected(true, false, false);
      console.log('searchBookCommentsByTitleの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * 著者名で検索して検索結果を表示する
   */
  searchBookCommentsByAuthor(authorName: string) {
    this.bookCommentService.getBookCommentsByAuthorName(authorName).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data;
      this.bookCommentCount = Object.keys(data).length;
      this.addSelected(false, true, false);
      console.log('searchBookCommentsByAuthorの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * ユーザー名orユーザーアカウント名で検索して検索結果を表示する
   */
  searchBookCommentsByUser(user: string) {
    this.bookCommentService.getBookCommentsByUser(user).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data;
      this.bookCommentCount = Object.keys(data).length;
      this.addSelected(false, false, true);
      console.log('searchBookCommentsByUserの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * 指定したクラスにselectedを指定し、その他の要素は空にする。
   */
  addSelected(titleSelected: boolean, authorSelected: boolean, userSelected: boolean) {
    if (titleSelected) {
      this.titleSelected = 'selected';
      this.authorSelected = '';
      this.userSelected = '';
    } else if (authorSelected) {
      this.titleSelected = '';
      this.authorSelected = 'selected';
      this.userSelected = '';
    } else {
      this.titleSelected = '';
      this.authorSelected = '';
      this.userSelected = 'selected';
    }
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
