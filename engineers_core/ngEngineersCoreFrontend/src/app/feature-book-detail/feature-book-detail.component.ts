import {Component, OnInit} from '@angular/core';
import {FeatureBookCategoryService} from '../service/feature-book-category/feature-book-category.service';
import {ActivatedRoute} from '@angular/router';
import {faBookOpen, faBookReader} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feature-book-detail',
  templateUrl: './feature-book-detail.component.html',
  styleUrls: ['./feature-book-detail.component.css']
})
export class FeatureBookDetailComponent implements OnInit {

  categoryCd = this.route.snapshot.paramMap.get('categoryCd');
  category: any;
  featureBookCount: number;
  faBookOpen = faBookOpen;
  faBookReader = faBookReader;

  constructor(
    private route: ActivatedRoute,
    private featureBookCategoryService: FeatureBookCategoryService,
  ) {
  }

  ngOnInit() {
    this.getFeatureBookCategory();
  }

  getFeatureBookCategory(): void {
    this.featureBookCategoryService.getBookFeatureCategoryByCd(this.categoryCd).subscribe(data => {
      if (data.results[0] !== undefined && data.results[0] !== null) {
        this.category = data.results[0];
        this.featureBookCount = Object.keys(data.results[0].books).length;
      }
    });
  }

}
