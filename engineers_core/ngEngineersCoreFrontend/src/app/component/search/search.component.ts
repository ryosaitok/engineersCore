import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faBook, faUser} from '@fortawesome/free-solid-svg-icons';

import {AuthGuard} from '../../guard/auth.guard';
import {AppComponent} from '../../app.component';
import {BookComment} from '../../dto/book-comment/book-comment';
import {Book} from '../../dto/book/book';
import {User} from '../../dto/user/user';
import {SigninService} from '../../service/signin/signin.service';
import {BookCommentService} from '../../service/book-comment/book-comment.service';
import {UserService} from '../../service/user/user.service';
import {BookService} from '../../service/book/book.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  userId: number;
  @Input() bookComments: BookComment[];
  @Input() books: Book[];
  @Input() users: User[];
  bookCount = 0;
  userCount = 0;
  query: string;
  sort: string;
  page: number;
  pageStart: number;
  mainPagePre: string;
  mainPageNext: string;
  isSearchByTitle: boolean;
  isSearchByAuthor: boolean;
  isSearchByUser: boolean;
  rankSelected: string;
  dateSelected: string;
  oldSelected: string;
  newSelected: string;

  popularBooks: Book[];
  newBooks: Book[];

  faBook = faBook;
  faUser = faUser;
  titleSelected = '';
  authorSelected = '';
  userSelected = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private bookService: BookService,
    private bookCommentService: BookCommentService,
    private signinService: SigninService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.focusToSearchForm();
    this.getPopularBooks();
    this.getNewBooks();
    this.getLoginUser();
    this.initQueryParameters();
    this.searchBooks(null, null, this.sort);
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

  // ----------------------------------------
  //                                     検索
  // ----------------------------------------
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
        this.setPageRange(Number(params.page));
      }
    });
  }

  /**
   * 本のタイトルでLIKE検索し、本のIDで重複除いた結果のコメント一覧を取得する。
   */
  search(f: NgForm) {
    this.query = f.value.query.trim();
    // 空文字の場合は検索しない。
    if (this.query === '') {
      return;
    }
    this.isSearchByTitle = true;
    this.searchBooks(this.page, null, this.sort);
  }

  focusToSearchForm(): void {
    document.getElementById('search-query').focus();
  }

  /**
   * 本を検索して検索結果を表示する。
   */
  searchBooks(page: number, varyingPage: number, sort: string) {
    if (this.query === null || this.query === undefined || this.query === '') {
      return;
    }
    if (page !== null) {
      if (varyingPage !== null) {
        page = Number(page) + Number(varyingPage);
      }
    }
    if (this.isSearchByTitle) {
      this.searchBooksByTitle(this.query, sort, page);
    } else if (this.isSearchByAuthor) {
      this.searchBooksByAuthorName(this.query, sort, page);
    }
  }

  /**
   * ユーザーを検索して検索結果を表示する。
   */
  searchUsers(page: number, varyingPage: number, sort: string) {
    if (this.query === null || this.query === undefined || this.query === '') {
      return;
    }
    if (page !== null) {
      if (varyingPage !== null) {
        page = Number(page) + Number(varyingPage);
      }
    }
    this.searchUsersByUser(this.query, sort, page);
  }

  /**
   * 本のタイトルで本を検索して検索結果を表示する
   */
  searchBooksByTitle(title: string, sort: string, page: number) {
    this.setPage(page);
    this.setSortForBooks(sort);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {title, page: this.page, sort: this.sort}});
    this.bookService.getBooksLikeTitle(title, this.sort, this.page.toString()).subscribe(data => {
      this.bookCount = data.count;
      if (data.count > 0) {
        this.books = this.bookService.convertBooks(data.results);
      } else {
        this.books = [];
      }
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      window.scrollTo(0, 0);
      this.addSelected(true, false, false);
    });
  }

  /**
   * 本の著者名で本を検索して検索結果を表示する
   */
  searchBooksByAuthorName(authorName: string, sort: string, page: number) {
    this.setPage(page);
    this.setSortForBooks(sort);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {author: authorName, page: this.page, sort: this.sort}});
    this.bookService.getBooksLikeAuthorName(authorName, this.sort, this.page.toString()).subscribe(data => {
      this.bookCount = data.count;
      if (data.count > 0) {
        this.books = this.bookService.convertBooks(data.results);
      } else {
        this.books = [];
      }
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      window.scrollTo(0, 0);
      this.addSelected(false, true, false);
    });
  }

  /**
   * ユーザー名orユーザーアカウント名で検索して検索結果を表示する
   */
  searchUsersByUser(user: string, sort: string, page: number) {
    console.log('searchUsersByUser. page: ' + page);
    this.setPage(page);
    this.handleSortForUsers(sort);
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {user, page: this.page, sort: this.sort}});
    this.userService.getUsersLikeName(user, this.sort, this.page.toString()).subscribe(data => {
      this.userCount = data.count;
      if (data.count > 0) {
        this.users = this.userService.convertUsers(data.results);
      } else {
        this.users = [];
      }
      this.mainPagePre = data.previous;
      this.mainPageNext = data.next;
      this.addSelected(false, false, true);
      window.scrollTo(0, 0);
    });
  }

  private setPage(page: number): void {
    if (page !== undefined && page !== null) {
      this.setPageRange(page);
      this.page = page;
    } else {
      this.setPageRange(1);
      this.page = 1;
    }
  }

  private setSortForBooks(sort: string): void {
    if (sort !== undefined && sort !== null) {
      this.sort = sort;
      if (sort === 'sale_rank') {
        this.rankSelected = 'selected';
        this.dateSelected = '';
      } else if (sort === 'sale_date') {
        this.rankSelected = '';
        this.dateSelected = 'selected';
      }
    } else {
      this.sort = '';
      this.rankSelected = 'selected';
      this.dateSelected = '';
    }
  }

  private handleSortForUsers(sort: string): void {
    if (sort !== undefined && sort !== null) {
      this.sort = sort;
      if (sort === 'old') {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {sort: 'old'}});
        this.oldSelected = 'selected';
        this.newSelected = '';
      } else if (sort === 'new') {
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {sort: 'new'}});
        this.oldSelected = '';
        this.newSelected = 'selected';
      }
    } else {
      this.sort = undefined;
      this.oldSelected = 'selected';
      this.newSelected = '';
    }
  }

  /**
   * 指定したクラスにselectedを指定し、その他の要素は空にする。
   */
  private addSelected(titleSelected: boolean, authorSelected: boolean, userSelected: boolean) {
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
    } else if (userSelected) {
      this.titleSelected = '';
      this.authorSelected = '';
      this.userSelected = 'selected';
      this.isSearchByTitle = false;
      this.isSearchByAuthor = false;
      this.isSearchByUser = true;
    }
  }

  private setPageRange(page: number): void {
    if (page === 1) {
      this.pageStart = 1;
    } else {
      this.pageStart = 20 * (page - 1) + 1;
    }
  }

  // ------------------------------------------
  //                          サイドバーおすすめ本
  // ------------------------------------------
  getPopularBooks(): void {
    this.popularBooks = [];
    this.bookService.getBooksPaging('popular', '1').subscribe(data => {
      if (data.count > 0) {
        this.bookService.convertBooks(data.results).forEach((book, index) => {
          // 画面表示に使うのは3つだけ
          if (index < 3) {
            this.popularBooks.push(book);
          }
        });
        console.log('JSON.stringify(this.popularBooks)' + JSON.stringify(this.popularBooks));
      }
    });
  }

  getNewBooks(): void {
    this.newBooks = [];
    this.bookService.getBooksPaging('sale_date', '1').subscribe(data => {
      if (data.count > 0) {
        this.bookService.convertBooks(data.results).forEach((book, index) => {
          // 画面表示に使うのは3つだけ
          if (index < 3) {
            this.newBooks.push(book);
          }
        });
        console.log('JSON.stringify(this.newBooks)' + JSON.stringify(this.newBooks));
      }
    });
  }
}
