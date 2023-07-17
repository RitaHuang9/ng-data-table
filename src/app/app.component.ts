import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/product';
import { ProductService } from 'src/productService';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NodeService } from 'src/nodeService';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as math from 'mathjs';

interface header {
  colCode: string;
  colName: string;
  colFormula: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  @ViewChild('formulaInput') formulaInput!: ElementRef<HTMLInputElement>;

  title = 'data-table';

  products1!: Product[];

  products2!: Product[];

  statuses!: SelectItem[];

  files2!: TreeNode[];
  selectedFiles1!: TreeNode;

  value: string = '';
  calculateSum!: number;

  headers: header[] = [
    {
      colCode: 'aaa',
      colName: '價錢',
      colFormula: '',
    },
    {
      colCode: 'bbb',
      colName: '數量',
      colFormula: '',
    },
    {
      colCode: 'ccc',
      colName: '評分',
      colFormula: '',
    },
  ];

  // 取得公式
  getValue(colName: string) {
    // for (let header of this.headers) {
    //   if (header.colName === colName) {
    //     header.colFormula = this.value;
    //     break;
    //   }
    // }
    // this.checkCaretPosition();
    this.overlayPanel.hide();
  }

  calc(prod: Product, index: number) {
    return math.evaluate(this.headers[index].colFormula, prod);
  }

  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private nodeService: NodeService
  ) {}

  ngOnInit() {
    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data));
    this.productService
      .getProductsSmall()
      .then((data) => (this.products2 = data));

    this.statuses = [
      { label: 'In Stock', value: 'INSTOCK' },
      { label: 'Low Stock', value: 'LOWSTOCK' },
      { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];

    this.nodeService.getFiles().then((files) => {
      this.files2 = files;
    });
  }

  onRowEditInit(product: Product) {
    this.clonedProducts[product.id] = { ...product };
  }

  onRowEditSave(product: Product) {
    if (product.price > 0) {
      delete this.clonedProducts[product.id];
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product is updated',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid Price',
      });
    }
  }

  onRowEditCancel(product: Product, index: number) {
    this.products2[index] = this.clonedProducts[product.id];
    // delete this.products2[product.id];
  }

  // 公式樹狀圖-全部展開
  expandAll() {
    this.files2.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }
  // 公式樹狀圖-全部收起
  collapseAll() {
    this.files2.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  // 取得input游標 caret 位置
  checkCaretPosition() {
    return this.formulaInput.nativeElement.selectionStart;
  }

  //點選公式 並加入至input
  nodeSelect(event: any,index: number) {
    if (event.node.leaf) {
      const addFormula = event.node.label;
      const value = this.headers[index].colFormula
      const newValue =
      //找前面的值
      value.slice(0, Number(this.checkCaretPosition())) +
        addFormula +
        //找後面的值
        value.slice(Number(this.checkCaretPosition()));
        this.headers[index].colFormula = newValue;
    }

  }

  nodeUnselect(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.label,
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
}
