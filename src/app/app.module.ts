import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductService } from 'src/productService';

import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, } from 'primeng/api';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { NodeService } from 'src/nodeService';

import {TreeModule} from 'primeng/tree';
import { CproExcelComponent } from './cpro-excel/cpro-excel.component';
import { DataTableComponent } from './data-table/data-table.component';
import { CustomerService } from 'src/customerservice';
import { CustomerServiceNew } from 'src/customerservice-new';
import { MainComponent } from './main/main.component';
import { CproExcelNewComponent } from './cpro-excel-new/cpro-excel-new.component';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './post/index/index.component';
import { ViewComponent } from './post/view/view.component';
import { CreateComponent } from './post/create/create.component';
import { EditComponent } from './post/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    CproExcelComponent,
    DataTableComponent,
    MainComponent,
    CproExcelNewComponent,
    FormComponent,
    IndexComponent,
    ViewComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    CalendarModule,
    SliderModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    FormsModule,
    OverlayPanelModule,
    TreeModule,
    ReactiveFormsModule
  ],
  providers: [ProductService,
    MessageService,
    NodeService,
    CustomerService,
    CustomerServiceNew
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
