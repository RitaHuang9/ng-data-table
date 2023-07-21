import { CproExcelComponent } from './cpro-excel/cpro-excel.component';
import { CproExcelNewComponent } from './cpro-excel-new/cpro-excel-new.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'data-table', component: DataTableComponent },
  { path: 'cpro-excel', component: CproExcelComponent },
  { path: 'cpro-excel-new', component: CproExcelNewComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule],
})
export class AppRoutingModule {}
