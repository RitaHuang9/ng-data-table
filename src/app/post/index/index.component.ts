import { Component } from '@angular/core';
import { Product } from 'src/app/post/post';
import { PostService } from 'src/app/post/post.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  products!: Product[];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getAll().subscribe((data: Product[]) => {
      this.products = data;
      console.table(this.products);
    });
  }

  deletePost(id: number) {
    this.postService.delete(id).subscribe((res) => {
      this.products = this.products.filter((item) => item.id !== id);
      console.log('Post deleted successfully!');
    });
  }
}
