import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges {

  @Input() bookComments: any[];
  bookCommentCount: number;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookCommentService: BookCommentService,
  ) {
  }

  ngOnInit(): void {
    this.searchBookCommentsByTitle();
  }

  ngOnChanges(changes: SimpleChanges): void {
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
}
