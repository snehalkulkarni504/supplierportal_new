import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { POsupplierComponent } from './modules/posupplier/posupplier.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [

    { path: '', component: LoginComponent },
    {
        path: 'module',
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    },
    
];
