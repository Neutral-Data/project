import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { hasRoleAdminGuard } from './guards/has-role-admin.guard';
import { loginGuard } from './guards/login.guard';
import { ErrorComponent } from './pages/error/error.component';



const routes: Routes = [
  {path:'',redirectTo:'/error', pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'about-us',component:AboutusComponent},
  {path:'error',component:ErrorComponent},
  {path:'manage-users',component:DashboardComponent, canActivate:[loginGuard, hasRoleAdminGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{ useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }