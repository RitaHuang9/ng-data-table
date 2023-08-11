import { Component } from '@angular/core';
import { PostService } from 'src/app/post/post.service';
import { Product } from 'src/app/post/post';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { log } from 'mathjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent {
  id!: number;
  form!: FormGroup;
  products!: Product[];

  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['postId'];

    this.postService.find(this.id).subscribe((data: Product[]) => {
      this.products = data;
      console.table(this.products);

    });

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      unitPrice: new FormControl('', Validators.required),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    const formVaule = {
      ...this.form.value,
      id: this.id,
    };
    this.postService.update(this.id, formVaule).subscribe((res) => {
      // console.log('Post updated successfully!',res);
      this.router.navigateByUrl('/index');
    });
  }
}
