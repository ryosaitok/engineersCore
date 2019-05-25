import {Component, OnInit} from '@angular/core';
import {FeatureBookCategoryService} from '../service/feature-book-category/feature-book-category.service';

@Component({
  selector: 'app-feature-book',
  templateUrl: './feature-book.component.html',
  styleUrls: ['./feature-book.component.css']
})
export class FeatureBookComponent implements OnInit {

  // 2次元配列とする。
  // [[featureBookCategoryの1個目のfeatureBookの1個目, featureBookCategoryの1個目のfeatureBookの2個目, ...],
  //  [featureBookCategoryの2個目のfeatureBookの1個目, featureBookCategoryの2個目のfeatureBookの2個目, ...], ...
  // ]
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
    this.featureBookCategoryService.getBookFeatureCaetgories().subscribe(data => {
      this.featureBookCategories = data;
      this.featureBookCategoryCount = Object.keys(data).length;
    });
  }

}
