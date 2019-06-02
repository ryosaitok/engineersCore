import {Component, OnInit} from '@angular/core';
import {faBookReader} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {ShelfService} from '../service/shelf/shelf.service';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrls: ['./shelf-detail.component.css']
})
export class ShelfDetailComponent implements OnInit {

  shelfCd = this.route.snapshot.paramMap.get('shelfCd');
  shelf: any;
  shelfCount: number;
  faBookReader = faBookReader;

  constructor(
    private route: ActivatedRoute,
    private shelfService: ShelfService,
  ) {
  }

  ngOnInit() {
    this.getShelf();
  }

  getShelf(): void {
    this.shelfService.getShelfsByShelfCd(this.shelfCd).subscribe(data => {
      if (data.results[0] !== undefined && data.results[0] !== null) {
        this.shelf = data.results[0];
        this.shelfCount = Object.keys(data.results[0].books).length;
      }
    });
  }
}
