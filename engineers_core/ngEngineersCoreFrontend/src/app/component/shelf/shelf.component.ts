import {Component, OnInit} from '@angular/core';
import {AuthGuard} from '../../guard/auth.guard';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfFavoriteService} from '../../service/shelf-favorite/shelf-favorite.service';
import {SigninService} from '../../service/signin/signin.service';
import {UserService} from '../../service/user/user.service';
import {Shelf} from '../../dto/shelf/shelf';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {

  shelves: Shelf[];
  shelfCount: number;
  sort: string;
  nextPageUrl: string;
  previousPageUrl: string;
  pageStart: number;
  nextPage: number;
  previousPage: number;
  newSelected: string;
  popularSelected: string;

  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private authGuard: AuthGuard,
    private router: Router,
    private route: ActivatedRoute,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfFavoriteService: ShelfFavoriteService,
    private signinService: SigninService,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.searchShelves(1, 'new');
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
   * 本棚を検索して検索結果を表示する。
   */
  searchShelves(page: number, sort: string) {
    this.nextPage = page + 1;
    this.previousPage = page - 1;
    this.setPageRange(page);

    if (sort === null) {
      sort = this.sort;
    } else {
      this.sort = sort;
    }
    if (sort === 'new') {
      this.newSelected = 'selected';
      this.popularSelected = '';
    } else if (sort === 'popular') {
      this.newSelected = '';
      this.popularSelected = 'selected';
    }
    const pageStr = page === null ? null : page.toString();

    this.shelfService.getShelvesPaging(sort, pageStr).subscribe(data => {
      if (data.count !== 0) {
        const shelves = data.results;
        this.shelves = this.shelfService.convertShelves(shelves, 5);
        this.shelfCount = data.count;
        this.nextPageUrl = data.next;
        this.previousPageUrl = data.previous;
      }
    });
    window.scrollTo(0, 0);
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
            this.shelves[index].favoriteUserIds.push(loggedInUserId);
            this.shelves[index].favoriteUserCount += 1;
          },
          (error) => {
            console.error('shelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('shelfFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'shelfId: ' + shelfId);
      }
    }, e => {
      console.error('見つからなかった？loggedInUserId: ' + loggedInUserId, 'shelfId: ' + shelfId);
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
            const userIdIndex = this.shelves[index].favoriteUserIds.indexOf(loggedInUserId);
            this.shelves[index].favoriteUserIds.splice(userIdIndex, 1);
            this.shelves[index].favoriteUserCount -= 1;
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

  private setPageRange(page: number): void {
    if (page === 1) {
      this.pageStart = 1;
    } else {
      this.pageStart = 20 * (page - 1) + 1;
    }
  }
}
