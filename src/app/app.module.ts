import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { MatCardModule } from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {MatSelectModule} from '@angular/material/select';
import { JwtInterceptor } from './security/jwt.interceptor';
import { AuthGuard } from './security/auth.guard';
import { AuthenticationService } from './security/authentication.service';
import { ErrorInterceptor } from './security/authentication.interceptor';
import { LoginComponent } from './login/login.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    AngularMultiSelectModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MatCardModule, MatButtonModule,
    ToastrModule.forRoot()
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, LoginComponent],
  providers: [
    AuthenticationService,
    AuthGuard,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  /* entryComponents: [JwtInterceptor], */
  bootstrap: [AppComponent]
})
export class AppModule {}
