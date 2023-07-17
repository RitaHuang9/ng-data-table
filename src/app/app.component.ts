import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Product } from 'src/product';
import { ProductService } from 'src/productService';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NodeService } from 'src/nodeService';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as math from 'mathjs';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

interface header {
  colCode: string;
  colFormula: string;
  rowsFormula? : colRowFormula[];
}

interface colRowFormula {
  rowIdx: number;
  colFormula: string;
}

interface version {
  name: string;
  setting: header[];
}

interface col {
  index: number;
  field: string;
  header: string;
  default: boolean;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  @ViewChild('formulaInput') formulaInput!: ElementRef<HTMLInputElement>;
  @ViewChild('rowformulaInput') rowformulaInput!: ElementRef<HTMLInputElement>;

  title = 'data-table';

  products1!: Product[];

  products2!: Product[];

  statuses!: SelectItem[];

  files2!: TreeNode[];
  selectedFiles1!: TreeNode;

  value: string = '';
  values: any[] = [];

  calculateSum!: number;

  headers: header[] = [];
  versions: version[] = []
  allCols: col[] = [];
  cols: col[] = [];
  sortCols: col[] = [];
  field:string = '';
  header:string = '';

  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private nodeService: NodeService
  ) { }

  ngOnInit() {

    //設定所有欄位的field 與中文名稱
    this.allCols = [
      { index:0,  field: 'id', header: 'ID' , default: true },
      { index:1,  field: 'code', header: '產品名代號' , default: true },
      { index:2,  field: 'name', header: '產品名稱', default: true  },
      { index:3,  field: 'price', header: '價格' , default: true },
      { index:4,  field: 'quantity', header: '數量', default: true  },
      { index:5,  field: 'inventoryStatus', header: '發票', default: true  },
      { index:6,  field: 'category', header: '類別', default: true  },
      { index:7,  field: 'rating', header: '評分', default: true  }
    ];

    //預設全選
    this.cols =  this.allCols;

    this.versions = [
      {
        name: 'V.1',
        setting: [
          {
            colCode: 'price',
            colFormula: '',
          },
          {
            colCode: 'quantity',
            colFormula: 'floor( price * quantity )',
          },
          {
            colCode: 'rating',
            colFormula: '',
          },
        ]
      },
      {
        name: 'V.2',
        setting: [
          {
            colCode: 'price',
            colFormula: '',
          },
          {
            colCode: 'quantity',
            colFormula: '',
          },
          {
            colCode: 'rating',
            colFormula: 'floor(sqrt(round(price * quantity * 10) *2))',
          },
        ]
      }
    ];

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

    this.headers = this.versions[0].setting;
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
  nodeSelect(event: any, index: number) {
    if (event.node.leaf) {
      const addFormula = event.node.label;
      const value = this.values[index];
      const newValue =
        //找前面的值
        value.slice(0, Number(this.checkCaretPosition())) +
        addFormula +
        //找後面的值
        value.slice(Number(this.checkCaretPosition()));
      this.values[index] = newValue;
    }

  }

  nodeUnselect(event: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.label,
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

  // 取得公式
  getValue(idx: number) {
    this.headers[idx].colFormula = this.values[idx];
  }

  calc(prod: Product, colCode: string,rowIdx :number):any {

    let temp = this.headers.find((user) => user.colCode === colCode);

    let colFormula = "";

    if(temp)  {
      let tempRow = temp.rowsFormula?.find((y) => y.rowIdx === rowIdx);
      colFormula = tempRow ? tempRow.colFormula : temp.colFormula;
    }
    else
    {
      return "";
    }

    return colFormula ? math.evaluate(colFormula, prod) : this.getObjValueBykey(prod,colCode) ;

  }

  //動態取得物件Value by key
  getObjValueBykey(obj:any,key:string)
  {
    type ObjectKey = keyof typeof obj;

    const myVar = key as ObjectKey;

    return obj[myVar];
  }

  getColFormula(colCode: string) {
    let temp = this.headers.find((x) => x.colCode === colCode);
    return temp ? temp.colFormula : "";
  }

  setColFormula(colCode: string) {
    console.log(this.formulaInput.nativeElement.value);

    this.headers = this.headers.map((h) => {
      if (h.colCode === colCode) {
        return {
          ...h,
          colFormula: this.formulaInput.nativeElement.value,
        };
      }
      return h;
    });
  }

  getRowColFormula(colCode: string,rowIdx: number) {
    let temp = this.headers.find((x) => x.colCode === colCode);
    if(temp)  {
      let tempRow = temp.rowsFormula?.find((y) => y.rowIdx === rowIdx);
      return tempRow ? tempRow.colFormula : temp.colFormula;
    }
    else
    {
      return "";
    }
  }

  setRowColFormula(colCode: string,rowIdx: number) {
    console.log(this.rowformulaInput.nativeElement.value);
    console.log(colCode,rowIdx);
    this.headers = this.headers.map((h) => {
      if (h.colCode === colCode) {
        let tempRow = h.rowsFormula?.find((x) => x.rowIdx === rowIdx);
        console.log(tempRow);
        if(tempRow)
        {
          h.rowsFormula = h.rowsFormula?.map((r) => {
            if (r.rowIdx === rowIdx) {
              return {
                ...r,
                colFormula: this.rowformulaInput.nativeElement.value,
              };
            }
            console.log(r);
            return r;
          });
        }
        else
        {
          h.rowsFormula?.push({
            rowIdx:rowIdx,
            colFormula :this.rowformulaInput.nativeElement.value
          });

          if(h.rowsFormula){
            h.rowsFormula?.push({
              rowIdx:rowIdx,
              colFormula :this.rowformulaInput.nativeElement.value
            });
          }
          else{
            h.rowsFormula = [
              {
                rowIdx:rowIdx,
                colFormula: this.rowformulaInput.nativeElement.value,
              }
            ]
          }

          console.log(h);
        }
      }
      return h;
    });
  }


  getCols()
  {
    // 回傳cols排序
    return this.cols.sort(({index:a}, {index:b}) => a-b)
  }

  addCustCol()
  {
    const newCol :col ={
      index: this.allCols.length,
      field: `custCol_${this.allCols.length}`,
      header:this.header,
      default:false
    }

    this.allCols.push(newCol);

    const newHeader :header ={
      colCode:newCol.field,
      colFormula:''
    }

    this.headers.push(newHeader);
  }
}
