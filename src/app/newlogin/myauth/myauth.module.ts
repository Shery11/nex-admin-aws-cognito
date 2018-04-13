import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { MdInputModule, MdButtonModule, MdToolbarModule, MdCardModule, MdRadioModule, MdDialogModule, MdProgressSpinnerModule, MdChipsModule } from '@angular/material';
import { AwsService } from './aws.service';
import { MyauthComponent } from './myauth.component';
import { GoogleSigninComponent } from './google-signin-component';
//import { MyauthRoutingModule} from './myauth-routing.module'
import { NbCardHeaderComponent,NbCardBodyComponent,NbCardFooterComponent} from '@nebular/theme/components/card/card.component';
import { NbCardModule } from '@nebular/theme';
//import {OneColumnLayoutComponent} from '@nebular/theme/layouts/one'

import { ThemeModule } from '../../@theme/theme.module';
import { SignupComponent } from './signup/signup.component';


const MYAUTH_COMPONENT = [
  MyauthComponent,
];

@NgModule({
  declarations: [
    GoogleSigninComponent,
    ...MYAUTH_COMPONENT,
    SignupComponent,
  ],
  imports: [
    FormsModule,
    HttpModule,
   // MyauthRoutingModule,
    NbCardModule,
    //MdInputModule,MdButtonModule, MdToolbarModule, MdCardModule, MdRadioModule, MdDialogModule, MdProgressSpinnerModule, MdChipsModule
  ],
  providers: [
    AwsService
  ],
})
export class MyauthModule { }
