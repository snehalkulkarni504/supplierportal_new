import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { POsupplierComponent } from '../modules/posupplier/posupplier.component';
import { UsermasterComponent } from '../modules/master/usermaster/usermaster.component';
import { RoleMasterComponent } from '../modules/master/role-master/role-master.component';
import { PodetailsreportComponent } from '../modules/report/podetailsreport/podetailsreport.component';
import { ContentComponent } from '../content/content.component';
import { PoscheduleComponent } from '../modules/poschedule/poschedule.component';
import { SupplierMasterComponent } from '../modules/master/supplier-master/supplier-master.component';
import { pointernalComponent } from '../modules/pointernal/pointernal.component';
import { DocuploadComponent } from '../modules/docupload/docupload.component';


const routes: Routes = [
  {
    path: '', component: ContentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'supplier', component: POsupplierComponent },
      { path: 'user', component: UsermasterComponent },
      { path: 'suppliermaster', component: SupplierMasterComponent },
      { path: 'podetailsreport', component: PodetailsreportComponent },
      { path: 'role', component: RoleMasterComponent },
      { path: 'poschedule/:PONumber', component: PoscheduleComponent },
      { path: 'pointernal',component:pointernalComponent},
      { path: 'docupload', component:DocuploadComponent}
    ]
  } 

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
