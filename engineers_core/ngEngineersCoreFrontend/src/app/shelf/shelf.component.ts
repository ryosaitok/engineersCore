import {Component, OnInit} from '@angular/core';
import {ShelfService} from '../service/shelf/shelf.service';

@Component({
  selector: 'app-shelf',
  templateUrl: './shelf.component.html',
  styleUrls: ['./shelf.component.css']
})
export class ShelfComponent implements OnInit {

  shelfs: any[];
  shelfCount: number;

  constructor(
    private shelfService: ShelfService,
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

}
