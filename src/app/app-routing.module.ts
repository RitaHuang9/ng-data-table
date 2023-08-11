import { CproExcelComponent } from './cpro-excel/cpro-excel.component';
import { CproExcelNewComponent } from './cpro-excel-new/cpro-excel-new.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { MainComponent } from './main/main.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './post/index/index.component';
import { CreateComponent } from './post/create/create.component';
import { EditComponent } from './post/edit/edit.component';
import { ViewComponent } from './post/view/view.component';


const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'data-table', component: DataTableComponent },
  { path: 'cpro-excel', component: CproExcelComponent },
  { path: 'cpro-excel-new', component: CproExcelNewComponent },
  { path: 'form', component: FormComponent },
  { path: 'index', component: IndexComponent },
  { path: 'index/:postId/view', component: ViewComponent },
  { path: 'index/create', component: CreateComponent },
  { path: 'index/:postId/edit', component: EditComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule],
})
export class AppRoutingModule {}
