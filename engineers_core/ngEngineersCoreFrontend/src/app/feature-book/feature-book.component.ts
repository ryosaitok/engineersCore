import {Component, OnInit} from '@angular/core';
import {FeatureBookCategoryService} from '../service/feature-book-category/feature-book-category.service';

@Component({
  selector: 'app-feature-book',
  templateUrl: './feature-book.component.html',
  styleUrls: ['./feature-book.component.css']
})
export class FeatureBookComponent implements OnInit {

  featureBookCategories: any[];
  featureBookCategoryCount: number;

  constructor(
    private featureBookCategoryService: FeatureBookCategoryService,
  ) {
  }

  ngOnInit() {
    this.getFeatureBookCategories();
  }

  getFeatureBookCategories(): void {
    this.featureBookCategoryService.getBookFeatureCategories().subscribe(data => {
      this.featureBookCategories = data.results;
      this.featureBookCategoryCount = data.count;
    });
  }
}
