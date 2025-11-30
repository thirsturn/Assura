import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetDashboardComponent } from './asset-dashboard/asset-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AssetDashboardComponent
  }
];

@NgModule({
  declarations: [
    // Remove AssetDashboardComponent from here
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AssetDashboardComponent  // Add it to imports instead
  ]
})
export class DashboardModule { }