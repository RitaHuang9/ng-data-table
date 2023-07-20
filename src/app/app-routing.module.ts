import { CproExcelComponent } from './cpro-excel/cpro-excel.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { AppComponent } from './app.component';




@NgModule({
  imports: [RouterModule.forRoot([
    {
      path: '',
      component: AppComponent,
      children: [
        {
          path: 'data-table',
          component:DataTableComponent
        },
        {
          path: 'cpro-excel',
          component:CproExcelComponent
        },
      ],
    },
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
