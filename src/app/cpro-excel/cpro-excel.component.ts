import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/customerservice';
import { Customer } from 'src/customer';
import { NodeService } from 'src/nodeService';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-cpro-excel',
  templateUrl: './cpro-excel.component.html',
  styleUrls: ['./cpro-excel.component.scss'],
})
export class CproExcelComponent implements OnInit {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  @ViewChild('formulaInput') formulaInput!: ElementRef<HTMLInputElement>;

  customers!: Customer[];
  balanceFrozen: boolean = false;




  // 公式選擇樹狀圖
  files2!: TreeNode[];
  selectedFiles1!: TreeNode;

  constructor(private customerService: CustomerService,
    private nodeService: NodeService) {}

  ngOnInit() {
    this.customerService.getCustomersMedium().then((data) => {
      this.customers = data;
    });

    this.nodeService.getFiles().then((files) => {
      this.files2 = files;
    });
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

  expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }


  // 取得input游標 caret 位置
  checkCaretPosition() {
    return this.formulaInput.nativeElement.selectionStart;
  }

  //點選公式 並加入至input
  nodeSelect(event: any) {

    if (event.node.leaf) {
      const addFormula = event.node.label;
      const value = this.formulaInput.nativeElement.value ;

      const newValue =
        //找caret前面的值
        value.slice(0, Number(this.checkCaretPosition())) +
        addFormula +
        //找後面的值
        value.slice(Number(this.checkCaretPosition()));

        this.formulaInput.nativeElement.value = newValue;

    }
  }
}

