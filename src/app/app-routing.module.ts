import { CproExcelComponent } from './cpro-excel/cpro-excel.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        children: [
          {
            path: 'data-table',
            component: DataTableComponent,
          },
          {
            path: 'cpro-excel',
            component: CproExcelComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
