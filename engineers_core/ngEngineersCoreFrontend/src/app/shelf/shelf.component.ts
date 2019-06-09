import {Component, Input, OnInit} from '@angular/core';
import {AuthGuard} from '../guard/auth.guard';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../app.component';
import {ShelfService} from '../service/shelf/shelf.service';
import {ShelfFavoriteService} from '../service/shelf-favorite/shelf-favorite.service';
import {SigninService} from '../service/signin/signin.service';
import {UserService} from '../service/user/user.service';
import {Shelf} from '../shelf';
import {User} from '../user';
import {Book} from '../book';
import {AmazonBook} from "../amazon-book";
import {Author} from "../author";

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {

  @Input() shelfs: Shelf[];
  shelfCount: number;

  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfFavoriteService: ShelfFavoriteService,
    private signinService: SigninService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.getShelfs();
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

  getShelfs(): void {
    this.shelfService.getShelfs().subscribe(data => {
      const shelfs = data.results;
      this.shelfs = [];
      shelfs.forEach(shelf => {
        const user = shelf.user;
        const userForShelf = new User(user.id, user.user_name, user.account_name, user.description, user.profile_image_link);
        const booksForShelf = [];
        shelf.books.forEach((book, index) => {
          if (index < 5) {
            const amazonBook = book.amazon_book[0];
            const amazonBookForShelf = new AmazonBook(amazonBook.id, amazonBook.book, amazonBook.data_asin, amazonBook.sales_rank);
            const authorsForShelf = [];
            book.authors.forEach(author => authorsForShelf.push(new Author(author.id, author.author_name)));
            booksForShelf.push(new Book(book.id, book.title, book.book_status, book.sale_date, book.pages_count,
              book.offer_price, amazonBookForShelf, authorsForShelf));
          }
        });
        this.shelfs.push(
          new Shelf(shelf.id, userForShelf, booksForShelf, shelf.shelf_cd, shelf.shelf_name, shelf.display_order,
            shelf.shelf_status, shelf.description, shelf.favorite_users, shelf.comment_users)
        );
      });
      this.shelfCount = data.count;
    });
  }

  shelfFavorite(shelfId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfFavoriteService.registerShelfFavorite(loggedInUserId, shelfId).subscribe(
          (res) => {
            // this.shelfs[index].favorite_users.push(loggedInUserId);
          },
          (error) => {
            console.error('shelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('shelfFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'shelfId: ' + shelfId);
      }
    });
  }

  undoShelfFavorite(shelfId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfFavoriteService.deleteShelfFavorite(favoriteId).subscribe(
          (res) => {
            // const userIdIndex = this.shelfs[index].favorite_users.indexOf(loggedInUserId);
            // this.shelfs[index].favorite_users.splice(userIdIndex, 1);
          },
          (error) => {
            console.log('undoShelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。shelfId ' + shelfId);
      }
    });
  }
}
