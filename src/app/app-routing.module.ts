import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  /* {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full"
  }, */
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: "", redirectTo: "dashboard", pathMatch: "full"},
      {path: "", loadChildren: "./layouts/admin-layout/admin-layout.module#AdminLayoutModule"}
    ]
  }, /* {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: './layouts/auth-layout/auth-layout.module#AuthLayoutModule'
      }
    ]
  }, */

  {path: "login", component: LoginComponent},
  {
    path: "**",
    redirectTo: "dashboard" //todo: not found component eklenecek
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
