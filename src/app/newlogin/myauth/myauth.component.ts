import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AwsService } from '../myauth/aws.service';
import { Callback } from '../myauth/aws.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { NbCardModule } from '@nebular/theme';
import { NbCardHeaderComponent,NbCardBodyComponent,NbCardFooterComponent} from '@nebular/theme/components/card/card.component';
import { AccountService }  from '../../pages/account.service';


@Component({
  selector: 'ngx-myauth',
  templateUrl: './myauth.component.html',
  styleUrls: ['./myauth.component.scss']
})
export class MyauthComponent {
  title = 'Amazon Cognito Demo';
  token:any;
  provider:string;
  googleUser:any;
  user:any;
  googleConfirmed:string;
  disableInput:boolean;
  username:string;
  password:string;
  usernameErrMessage:string;
  passwordErrMessage:string;
  errorMessage:string;
  redError:string;
  loggedInCreds = {
    accessKey : "",
    secretKey : "",
    sessionToken : "",
    token: ""
  };
  success:string;

  testState:string;
  chosenProvider:string = "cup";

  constructor(public awsService:AwsService,
    private router: Router,private accountService: AccountService){
  }
  
  setToken(token){
    this.token=token;
    localStorage.setItem("token", token);
  }

  getToken(){
    return this.token;
  }

  clearFields(){
    this.username= null;
    this.password= null;
    this.disableInput=true;
    this.errorMessage = null;
    this.awsService.getgoogleData(this);
  }

  enableFields(){
    this.disableInput=false;
  }

  clearErrors(){
    this.usernameErrMessage = "";
    this.passwordErrMessage = "";
  }

  onLogin(){
    if (this.username != null && this.password != null && this.chosenProvider!= null){
      this.errorMessage = null;
    }
    if (this.username == null || this.password == null) {
      this.errorMessage = "All fields are required";
      return;
    }
    if(this.chosenProvider==null){
      this.errorMessage="Please select an Identity Provider";
      return;
    } else if(this.chosenProvider == "cup"){
        this.awsService.authenticateUserPool(this.username,this.password,this,this.router,this.accountService);        
        
      } else if(this.chosenProvider == "cip"){
        this.awsService.authenticateIdentityPool(this.username,this.password,this.awsService.region,this);
    };
    this.redError=null;
    this.success=null;
    this.loggedInCreds= {
      accessKey : "",
      secretKey : "",
      sessionToken : "",
      token: ""
    };
  }

  userDataFromGoogle(){
    let authData = this.awsService.getgoogleCreds(this);
    let authProfile = this.awsService.getgoogleProfile(this);
    let accessKey = authData.accessKey;
    let secretKey = authData.secretKey;
    let sessionToken = authData.sessionToken;
    let name = authProfile.ofa;
    let surname = authProfile.wea;
    let email = authProfile.U3;
    this.awsService.userInfoApiGoogle(accessKey,secretKey,sessionToken,name,surname,email,this.awsService.region,this);
    this.awsService.userInfoApiGoogle(accessKey,secretKey,sessionToken,name,surname,email,this.awsService.region,this);
  }

  userDataFromUserPools(){
    this.awsService.postInfoApiUserPools(this.token)
      .subscribe(user => {
        //this.user = user;
        //console.log(user);
        console.log("POST with JWT to API Gateway");
      },
      error =>  this.errorMessage = <any>error);
    this.awsService.getInfoApiUserPools(this.token)
      .subscribe(user => {
        this.user = user;
        console.log("GET with JWT to API Gateway");
      },
      error =>  this.errorMessage = <any>error);
  }

  testGoogle(){
    this.awsService.getgoogleData(this);
    this.redError=null;
    this.success=null;
    let provider="google";
    this.awsService.testAccess(this.loggedInCreds,provider,this.awsService.region,this);
  }

  testUserPools(){
    this.redError=null;
    this.success=null;
    let provider="cup";
    this.awsService.getInfoApiUserPools(this.loggedInCreds.token)
      .subscribe(user => {
        this.user = user;
        this.success="ACCESS GRANTED!";
        this.redError=null;
        console.log("Access to /cup API Resource with current credentials GRANTED");
      },
      error =>  this.redError = <any>error);
      if (this.redError){
        this.success=null;
      }
  }

  testIdentityPools(){
    this.redError=null;
    this.success=null;
    let provider="cip";
    this.awsService.testAccess(this.loggedInCreds,provider,this.awsService.region,this);
  }

  cognitoCallback(message:string, result:any) {
    if (message != null) { // error
      this.errorMessage = message;
    } else { // success
       this.setToken(result.getIdToken().getJwtToken());
       this.loggedInCreds.token=this.getToken();
       this.googleConfirmed = null;
       this.provider = "Cognito User Pools";
       this.userDataFromUserPools();
    }
  }

  cognitoCallbackWithCreds(message:string, result:any, creds:any, data:any) {
    if (message != null) { // error
      this.errorMessage = message;
    } else { // success
      this.loggedInCreds.accessKey=creds.accessKey;
      this.loggedInCreds.secretKey=creds.secretKey;
      this.loggedInCreds.sessionToken=creds.sessionToken;
      this.googleConfirmed = null;
      this.setToken(result);
      this.provider = "Cognito User and Identity Pools";
      this.user = data;
    }
  }

  googleCallback(creds: any, profile: any) {
    if(creds != null || profile != null){
      if(creds !=null){
        this.loggedInCreds.accessKey=creds.accessKey;
        this.loggedInCreds.secretKey=creds.secretKey;
        this.loggedInCreds.sessionToken=creds.sessionToken;
      }
      this.provider = "Google";
      this.googleConfirmed = "confirmed";
    } 
  }

  googleCallbackWithData(data: any){
    this.googleUser = data;
    this.googleConfirmed = "confirmed";
  }

  testCallback(result: any, err:any){
    if (result!=null){
      this.success="ACCESS GRANTED!";
      this.redError=null;
    }
    if (err!=null){
      this.redError="UNAUTHORIZED!";
      this.success=null;
    }
  }

}
