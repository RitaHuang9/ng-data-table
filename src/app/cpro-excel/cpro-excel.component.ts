import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'src/customerservice';
import { Customer } from 'src/customer';
import { NodeService } from 'src/nodeService';
import { TreeNode } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { log } from 'mathjs';
import * as math from 'mathjs';

interface Version {
  name: string;
}
interface Project {
  name: string;
}
interface CproVersion {
  name: string;
}

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
  // 動態FC欄位
  fcCols!: string[];
  // 動態欄位
  dyncCols = new Map();
  // 動態公式欄位
  formulaCols = new Map();
  editFormula: string = '';

  // header 下拉
  versions: Version[] | undefined;
  selectedVersion: Version | undefined;
  projects: Project[] | undefined;
  selectedProject: Project | undefined;
  cproVersions: CproVersion[] | undefined;
  selectedCproVersion: CproVersion | undefined;

  constructor(
    private customerService: CustomerService,
    private nodeService: NodeService
  ) {}

  ngOnInit() {
    this.customerService.getCustomersMedium().then((data) => {
      this.customers = data;
      this.getDynaFCCol();
      this.getDynaCalcCol();
    });

    this.nodeService.getFiles().then((files) => {
      this.files2 = files;

      console.table(this.files2);
      let cols: any[] = [];
      this.dyncCols.forEach((x) => {
        cols.push(x);
      });
      console.table(cols);

      this.files2[0].children = cols;
    });

    this.versions = [
      { name: '202209' },
      { name: '202210' },
      { name: '202211' },
      { name: '202212' },
    ];
    this.projects = [
      { name: 'project1' },
      { name: 'project2' },
      { name: 'project3' },
      { name: 'project4' },
    ];
    this.cproVersions = [
      { name: 'CPRO  version1' },
      { name: 'CPRO  version2' },
      { name: 'CPRO  version3' },
      { name: 'CPRO  version4' },
    ];
  }

  // 取得動態的FC欄位
  getDynaFCCol() {
    //暫存動態FC欄位
    let tempKeys: string[] = [];
    //取得各筆Customer有幾筆FC欄位
    this.customers.forEach((x) => {
      const keys = x.FC ? Object.keys(x.FC) : [];
      //合併動態FC,並去除重覆項
      tempKeys = this.merge(tempKeys, keys);
    });
    this.fcCols = tempKeys;
  }

  // 取得動態需要設定公式的欄位
  getDynaCalcCol() {
    //取得各筆Customer有幾筆FC欄位
    this.customers.forEach((x) => {
      if (x.company) {
        this.dyncCols.set(x.company, {
          label: x.company,
          value: `[[${x.company}]]`,
          data: 'Work Folder',
          expandedIcon: '',
          collapsedIcon: '',
          leaf: true,
        });

        //不可編輯的rows才可以設定公式
        if (!x.editable) {
          this.formulaCols.set(x.company, '');
        }
      }
    });
    console.table(this.dyncCols);
    console.table(this.formulaCols);
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
      const addFormula = event.node.value ? event.node.value : event.node.label;
      const value = this.formulaInput.nativeElement.value;

      const newValue =
        //找caret前面的值
        value.slice(0, Number(this.checkCaretPosition())) +
        addFormula +
        //找後面的值
        value.slice(Number(this.checkCaretPosition()));

      this.formulaInput.nativeElement.value = newValue;
    }
  }

  merge(arr1: string[], arr2: string[]) {
    const newArr: string[] = [...arr1];
    for (let i = 0; i < arr2.length; i++) {
      const item = arr2[i];
      if (newArr.includes(item)) continue;
      newArr.push(item);
    }
    return newArr;
  }

  //get Object Value by property
  resolveField(data: any, field: any): any {
    type ObjectKey = keyof typeof data;

    const myVar = field as ObjectKey;
    return data[myVar];
  }

  //set Object Value by property
  assign<T extends object, K extends keyof T>(obj: T, key: K, val: any) {
    obj[key] = val.target.value; // okay
  }

  setEditFormula(key: string) {
    this.editFormula = key;
    console.log(this.editFormula);
  }

  getEditFormula() {
    if (this.editFormula) return this.formulaCols.get(this.editFormula);
    else return '';
  }

  saveFormula(event: any) {
    if (this.editFormula)
      this.formulaCols.set(this.editFormula, event.target.value);

    console.table(this.formulaCols);
  }

  //get Object Value by property
  calc(data: any, field: any, index: number): any {
    const regex = /\[\[(.*?)\]\]/g;
    let formula = this.formulaCols.get(data.company);


    if (formula.length >= 2) {
      // const mathRegex = formula.match(regex)
      // console.log(mathRegex);
      const regexFormulaName = formula.match(regex)[0].replace(regex, '$1');
      const matchRegex = formula.match(regex);

      matchRegex.forEach((item:any) => {
        const companyName = item.replace(regex, '$1');
        const result = this.customers.find(x => {
          return x.company === companyName;
        });
        // console.log(result);

        if(result){
          const val = this.resolveField(result.FC,field);
          if(val){

            formula = formula.replace(regex, val)
          }else{
            formula = formula.replace(regex, 0)
          }
          console.log(formula,val);
        }else{
          formula = formula.replace(regex, 0)
        }

      });

      //   if(item.company === regexFormulaName){
      //     const value = Object.values(item.FC)

      //     for (let key in value) {

      //       const regexKey = formula.replace(regex, key);

      //       console.log(value);

      //       console.log(math.evaluate(regexKey),regexKey);
      //       return math.evaluate(regexKey)
      //     }

      //     // console.log(regexKey);
      //   }
      // });

      return math.evaluate(formula)
    }else{
      return this.resolveField(data.FC,field)
    }
    // return this.formulaCols.get(data.company);
  }
  // [[POC completion 完工百分比]]
  // [[Contract Margin 工程毛利]]
  // [[Contract Revenue 工程成本]]
  // [[Contract Revenue 工程收入]]
  // [[Other Income 其他收益]]
  // [[Budget-to-date (Surpus)/Loss 收付權重價差]]
  // [[Under/(Over)billing 應收/(應付)建造合約款]]
  // [[Subtotal]]
  // [[Other 其他 single period adj]]
  // [[Other 其他]]
  // [[Provisional Items 保留項目 single period adj]]
  // [[Provisional Items 保留項目]]
  // [[Claims 求償金額 single period adj]]
  // [[Claims 求償金額]]
  // [[Advance Payment 預付款 single period adj]]
  // [[Advance Payment 預付款]]
  // [[CPF / Escalation 物調金額 single period adj]]
  // [[CPF / Escalation 物調金額]]
  // [[Variations 追加(減)金額 single period adj]]
  // [[Variations 追加(減)金額]]
  // [[Original Scope 估驗金額 FINAL]]
  // [[Original Scope 估驗金額 single period adj]]
  // [[Original Scope 估驗金額]]
  // [[Total contract cost(合約總成本)]]
  // [[Contract Value(合約總價)]]
  // [[Margin(總毛利)]]
}
