import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Product } from 'src/product';
import { ProductService } from 'src/productService';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { NodeService } from 'src/nodeService';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import * as math from 'mathjs';
import * as FileSaver from 'file-saver';
import { MultiSelectChangeEvent } from 'primeng/multiselect';

interface header {
  colCode: string;
  colFormula: string;
  calculate: string;
  rowsFormula?: colRowFormula[];
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

//footer
interface City {
  name: string;
  code: string;
}


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
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
  printFormula: string = 'ddd';
  values: any[] = [];

  headers: header[] = [];
  versions: version[] = [];
  allCols: col[] = [];
  cols: col[] = [];
  sortCols: col[] = [];
  field: string = '';
  header: string = '';

  cities: City[];

  selectedCity!: City;
  calculateTotals: any[] = [];

  isHidden: boolean = false;

  exportColumns!: any[];


  clonedProducts: { [s: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private nodeService: NodeService
  ) {
    this.cities = [
      { name: '加總', code: 'sum' },
      { name: '平均', code: 'avage' },
      { name: '最大值', code: 'max' },
      { name: '最小值', code: 'min' },
    ];
  }

  ngOnInit() {
    //設定所有欄位的field 與中文名稱
    this.allCols = [
      { index: 0, field: 'id', header: 'ID', default: true },
      { index: 1, field: 'code', header: '產品名代號', default: true },
      { index: 2, field: 'name', header: '產品名稱', default: true },
      { index: 3, field: 'price', header: '價格', default: true },
      { index: 4, field: 'quantity', header: '數量', default: true },
      { index: 5, field: 'inventoryStatus', header: '發票', default: true },
      { index: 6, field: 'category', header: '類別', default: true },
      { index: 7, field: 'rating', header: '評分', default: true },
    ];

    //預設全選
    this.cols = this.allCols;

    // 各版本預設
    this.versions = [
      {
        name: 'V.1',
        setting: [
          {
            colCode: 'price',
            colFormula: '',
            calculate: 'RM',
          },
          {
            colCode: 'quantity',
            colFormula: 'floor( price * quantity )',
            calculate: '',
          },
          {
            colCode: 'rating',
            colFormula: '',
            calculate: '',
          },
        ],
      },
      {
        name: 'V.2',
        setting: [
          {
            colCode: 'price',
            colFormula: '',
            calculate: '',
          },
          {
            colCode: 'quantity',
            colFormula: '',
            calculate: '',
          },
          {
            colCode: 'rating',
            colFormula: 'floor(sqrt(round(price * quantity * 10) *2))',
            calculate: '',
          },
        ],
      },
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

    this.productService
      .getProductsSmall()
      .then((data) => (this.products1 = data))
      .then(() => {
        let ary = this.products1;
        let result = ary.map((a) => a.id);
        // console.table(ary);
        // console.log(result, this.selectedCity);
      });
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
  checkCaretPosition(rowIdx: number) {
    if(rowIdx >= 0){
      return this.rowformulaInput.nativeElement.selectionStart;
    }else{
      return this.formulaInput.nativeElement.selectionStart;
    }
  }

  //點選公式 並加入至input
  nodeSelect(event: any, index: number, colCode: string,rowIdx: number) {

    if (event.node.leaf) {
      const addFormula = event.node.label;
      const value = rowIdx >= 0 ? this.rowformulaInput.nativeElement.value : this.formulaInput.nativeElement.value ;

      const newValue =
        //找caret前面的值
        value.slice(0, Number(this.checkCaretPosition(rowIdx))) +
        addFormula +
        //找後面的值
        value.slice(Number(this.checkCaretPosition(rowIdx)));

        if(rowIdx >= 0){
          this.rowformulaInput.nativeElement.value = newValue;
          this.rowformulaInput.nativeElement.value = this.printFormula

        }else{
          this.formulaInput.nativeElement.value = newValue;
        }

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

  //計算公式
  calc(prod: Product, colCode: string, rowIdx: number): any {
    let temp = this.headers.find((user) => user.colCode === colCode);

    let colFormula = '';

    if (temp) {
      let tempRow = temp.rowsFormula?.find((y) => y.rowIdx === rowIdx);
      colFormula = tempRow ? tempRow.colFormula : temp.colFormula;
    } else {
      return '';
    }

    return colFormula
      ? math.evaluate(colFormula, prod)
      : this.getObjValueBykey(prod, colCode);
  }

  //動態取得物件Value by key
  getObjValueBykey(obj: any, key: string) {
    type ObjectKey = keyof typeof obj;

    const myVar = key as ObjectKey;

    return obj[myVar];
  }

  getColFormula(colCode: string) {
    let temp = this.headers.find((x) => x.colCode === colCode);
    return temp ? temp.colFormula : '';
  }

  // footer-加總 name:下拉選項 propertyName:column的名稱
  footerSum(propertyName: string) {
    let calcType = this.getColCalculate(propertyName);
    let dataList = this.products1.map((item: any) => item[propertyName]);

    if (typeof dataList[0] === 'number') {
      if (calcType === 'sum') {
        return math.sum(dataList);
      } else if (calcType === 'avage') {
        let average = math.mean(dataList);
        return average;
      } else if (calcType === 'max') {
        let max = math.max(dataList);
        return max;
      } else {
        let min = math.min(dataList);
        return min;
      }
    } else {
      return '';
    }
  }
  //判斷body資料型別 false->不會顯示footer下拉
  checkType(propertyName: string) {
    let dataList = this.products1.map((item: any) => item[propertyName]);
    return typeof dataList[0] === 'number';
  }

  getColCalculate(colCode: string) {
    let temp = this.headers.find((x) => x.colCode === colCode);
    let dataList = this.products1.map((item: any) => item[colCode]);

    return temp ? temp.calculate : '';
  }

  setColFormula(colCode: string) {
    console.log(this.formulaInput.nativeElement.value);

    let tempCol = this.headers.find((x) => x.colCode === colCode);
    console.log(tempCol);
    if (tempCol) {
      this.headers = this.headers.map((h) => {
        if (h.colCode === colCode) {
          return {
            ...h,
            colFormula: this.formulaInput.nativeElement.value,
          };
        }
        return h;
      });
    } else {
      this.headers.push({
        colCode: colCode,
        colFormula: this.formulaInput.nativeElement.value,
        calculate: '',
      });
    }
  }

  // footer 加總運算功能
  setColCalculate(event: any, colCode: string) {
    let tempCol = this.headers.find((x) => x.colCode === colCode);
    if (tempCol) {
      this.headers = this.headers.map((h) => {
        if (h.colCode === colCode) {
          return {
            ...h,
            calculate: event.value,
          };
        }
        return h;
      });
    } else {
      this.headers.push({
        colCode: colCode,
        colFormula: '',
        calculate: event.value,
      });
    }
  }

  getRowColFormula(colCode: string, rowIdx: number) {
    let temp = this.headers.find((x) => x.colCode === colCode);
    if (temp) {
      let tempRow = temp.rowsFormula?.find((y) => y.rowIdx === rowIdx);
      return tempRow ? tempRow.colFormula : temp.colFormula;
    } else {
      return '';
    }

  }

  setRowColFormula(colCode: string, rowIdx: number) {
    // console.log(this.rowformulaInput.nativeElement.value.length > 0);
    this.headers = this.headers.map((h) => {

      if (h.colCode === colCode) {
        let tempRow = h.rowsFormula?.find((x) => x.rowIdx === rowIdx);
        // console.log('tempRow',tempRow);
        if (tempRow) {
          h.rowsFormula = h.rowsFormula?.map((r) => {
            if (r.rowIdx === rowIdx) {
              return {
                ...r,
                colFormula: this.rowformulaInput.nativeElement.value,
              };
            }
            console.log('if (r.rowIdx === rowIdx)',r);
            return r;
          });
        } else {
          h.rowsFormula?.push({
            rowIdx: rowIdx,
            colFormula: this.rowformulaInput.nativeElement.value,
          });

          if (h.rowsFormula) {
            h.rowsFormula?.push({
              rowIdx: rowIdx,
              colFormula: this.rowformulaInput.nativeElement.value,
            });
          } else {
            h.rowsFormula = [
              {
                rowIdx: rowIdx,
                colFormula: this.rowformulaInput.nativeElement.value,
              },
            ];
          }

          console.log(h);
        }
      }

      return h;
    });
  }

  //若有加入公式 新增樣式
  outPutRowIdx(colCode: string,rowIdx: number,event:any){
    const targetElement = event.target as HTMLElement;
    targetElement.classList.add('input-formula');
    console.log(colCode,rowIdx,event,targetElement);
  }


  getCols() {
    // 回傳cols排序
    return this.cols.sort(({ index: a }, { index: b }) => a - b);
  }

  addCustCol() {
    const newCol: col = {
      index: this.allCols.length,
      field: `custCol_${this.allCols.length}`,
      header: this.header,
      default: false,
    };

    this.allCols.push(newCol);

    const newHeader: header = {
      colCode: newCol.field,
      colFormula: '',
      calculate: '',
    };

    this.headers.push(newHeader);
  }


  // 匯出excel
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.products1);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  // onRowEditInit(product: Product) {
  //   this.clonedProducts[product.id] = { ...product };
  // }
}
