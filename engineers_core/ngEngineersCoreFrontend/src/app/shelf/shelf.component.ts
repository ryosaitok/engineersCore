import {Component, OnInit} from '@angular/core';
import {ShelfService} from '../service/shelf/shelf.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {AppComponent} from '../app.component';
import {AuthGuard} from '../guard/auth.guard';
import {ShelfFavoriteService} from '../service/shelf-favorite/shelf-favorite.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {

  shelfs: any[];
  shelfCount: number;

  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfFavoriteService: ShelfFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getFeatureBookCategories();
  }

  getFeatureBookCategories(): void {
    this.shelfService.getShelfs().subscribe(data => {
      this.shelfs = data.results;
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
            this.shelfs[index].favorite_users.push(loggedInUserId);
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
            const userIdIndex = this.shelfs[index].favorite_users.indexOf(loggedInUserId);
            this.shelfs[index].favorite_users.splice(userIdIndex, 1);
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
