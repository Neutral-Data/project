import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { hasRoleAdminGuard } from './guards/has-role-admin.guard';
import { loginGuard } from './guards/login.guard';
import { ErrorComponent } from './pages/error/error.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DownloadComponent } from './pages/download/download.component';



const routes: Routes = [
  {path:'',redirectTo:'/home', pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'upload',component:UploadComponent, canActivate:[loginGuard]},
  {path:'download',component:DownloadComponent, canActivate:[loginGuard]},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'about-us',component:AboutusComponent},
  {path:'error',component:ErrorComponent},
  {path:'manage-users',component:DashboardComponent, canActivate:[loginGuard, hasRoleAdminGuard]},
  { path: '**', component:ErrorComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{ useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }