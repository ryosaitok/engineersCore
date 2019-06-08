import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faBookOpen, faCommentDots, faHeart, faSearch, faUser} from '@fortawesome/free-solid-svg-icons';
import {SigninService} from '../service/signin/signin.service';
import {CommentFavoriteService} from '../service/comment-favorite/comment-favorite.service';
import {UserService} from '../service/user/user.service';
import {BookService} from '../service/book/book.service';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges {

  userId: number;
  @Input() bookComments: any[];
  @Input() books: any[];
  @Input() users: any[];
  bookCommentCount = 0;
  bookCount = 0;
  userCount = 0;
  query: string;
  sort: string;
  page: number;
  mainPagePre: string;
  mainPageNext: string;
  isSearchByTitle: boolean;
  isSearchByAuthor: boolean;
  isSearchByUser: boolean;

  faHeart = faHeart;
  faCommentDots = faCommentDots;
  faBookOpen = faBookOpen;
  faUser = faUser;
  faSearch = faSearch;
  titleSelected = '';
  authorSelected = '';
  userSelected = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appComponent: AppComponent,
    private bookService: BookService,
    private bookCommentService: BookCommentService,
    private signinService: SigninService,
    private userService: UserService,
    private commentFavoriteService: CommentFavoriteService,
  ) {
  }

  ngOnInit(): void {
    this.getLoginUser();
    this.initQueryParameters();
    this.searchBookComments(1, this.sort);
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
      if (params.sort !== null && params.sort !== undefined) {
        this.sort = params.sort;
      }
      if (params.page !== null && params.page !== undefined) {
        this.page = params.page;
      }
      console.log('query: ' + this.query + ', isSearchByTitle: ' + this.isSearchByTitle + ', isSearchByAuthor: '
        + this.isSearchByAuthor + ', isSearchByUser: ' + this.isSearchByUser);
    });
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
  searchBookComments(page: number, sort: string) {
    if (page !== undefined) {
      this.page = page;
    }
    if (sort !== undefined) {
      this.sort = sort;
    }
    this.query = this.query.trim();
    if (this.query === null || this.query === undefined || this.query === '') {
      return;
    }
    if (this.isSearchByTitle) {
      this.searchBookCommentsByTitle(this.query);
      this.searchBooksByTitle(this.query, this.sort, this.page.toString());
    } else if (this.isSearchByAuthor) {
      this.searchBookCommentsByAuthor(this.query);
      this.searchBooksByAuthorName(this.query, this.sort, this.page.toString());
    } else if (this.isSearchByUser) {
      this.searchBookCommentsByUser(this.query);
      this.searchUsers(this.query);
    }
  }

  /**
   * 本のタイトルでコメントを検索して検索結果を表示する
   */
  searchBookCommentsByTitle(title: string) {
    this.bookCommentService.getBookCommentsByTitle(title).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data.results;
      this.bookCommentCount = data.count;
      this.addSelected(true, false, false);
      console.log('searchBookCommentsByTitleの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * 本のタイトルで本を検索して検索結果を表示する
   */
  searchBooksByTitle(title: string, sort: string, page: string) {
    this.bookService.getBooksLikeTitle(title, sort, page).subscribe(data => {
      this.books = data.results;
      this.bookCount = data.count;
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      window.scrollTo(0, 0);
      this.addSelected(true, false, false);
      console.log('searchBooksByTitleの結果。this.books: ' + this.books + 'this.bookCount: ' + this.bookCount);
    });
  }

  /**
   * 著者名で検索して検索結果を表示する
   */
  searchBookCommentsByAuthor(authorName: string) {
    this.bookCommentService.getBookCommentsByAuthorName(authorName).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data.results;
      this.bookCommentCount = data.count;
      this.addSelected(false, true, false);
      console.log('searchBookCommentsByAuthorの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * 本の著者名で本を検索して検索結果を表示する
   */
  searchBooksByAuthorName(authorName: string, sort: string, page: string) {
    this.bookService.getBooksLikeAuthorName(authorName, sort, page).subscribe(data => {
      this.books = data.results;
      this.bookCount = data.count;
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      window.scrollTo(0, 0);
      this.addSelected(false, true, false);
      console.log('searchBooksByAuthorNameの結果。this.books: ' + this.books + 'this.bookCount: ' + this.bookCount);
    });
  }

  /**
   * ユーザー名orユーザーアカウント名で検索して検索結果を表示する
   */
  searchBookCommentsByUser(user: string) {
    this.bookCommentService.getBookCommentsByUser(user).subscribe(data => {
      // TODO:ryo.saito 1つの本につき1つのコメントが取得できればいいので、本の重複を除く。
      this.bookComments = data.results;
      this.bookCommentCount = data.count;
      this.addSelected(false, false, true);
      console.log('searchBookCommentsByUserの結果。this.bookComments: ' + this.bookComments + 'this.bookCommentCount: '
        + this.bookCommentCount);
    });
  }

  /**
   * ユーザー名orユーザーアカウント名で検索して検索結果を表示する
   */
  searchUsers(user: string) {
    this.userService.getUsersLikeName(user).subscribe(data => {
      this.users = data.results;
      this.userCount = data.count;
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      this.addSelected(false, false, true);
      window.scrollTo(0, 0);
      console.log('searchUsersの結果。this.users: ' + this.users + 'this.userCount: ' + this.userCount);
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
      this.isSearchByTitle = true;
      this.isSearchByAuthor = false;
      this.isSearchByUser = false;
    } else if (authorSelected) {
      this.titleSelected = '';
      this.authorSelected = 'selected';
      this.userSelected = '';
      this.isSearchByTitle = false;
      this.isSearchByAuthor = true;
      this.isSearchByUser = false;
    } else {
      this.titleSelected = '';
      this.authorSelected = '';
      this.userSelected = 'selected';
      this.isSearchByTitle = false;
      this.isSearchByAuthor = false;
      this.isSearchByUser = true;
    }
  }

  commentFavorite(commentId: number, index: number): void {
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
