import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { catchError, finalize } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { NotifyMessageType } from 'src/app/core/classes/enams/core.enum';
import { NotifyService } from 'src/app/core/services/notify.service';
import { LoggedService } from '../logged.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private notifyService:NotifyService,
    private loggedService:LoggedService,
    private router: Router,
    private route: ActivatedRoute
     ) { }

  loginForm: FormGroup | any;
  public passwordState = false;
  showSpinnerBar = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
       'username': new FormControl('', Validators.required),
       'password': new FormControl('', [Validators.required, Validators.minLength(6)])
    })

    // this.route.queryParams
    // .subscribe((params:Params)=>{
    //      if(params['accessDenied']){
    //         this.notifyService.showNotification(
    //           'Sign in to proceed working with system',
    //           NotifyMessageType.warning
    //         )
    //      }
    // })
  }

  
  onSubmit(){
    this.showSpinnerBar = true;
      let userdata = this.loginForm.value;
      this.authService.getUserByEmail(userdata.username)
      .pipe(
        catchError((err:any)=>{
          this.notifyService.showNotification(
            'Something went wrong, try again later',
             NotifyMessageType.error
          )
          return EMPTY
        }),
        finalize(()=>{
          this.showSpinnerBar = false;
        })
      )
      .subscribe((data)=>{
          if(data){
              if(userdata.password === data.password){
                 this.loggedService.login()
                 window.localStorage.setItem("userdata", JSON.stringify(userdata))
                 this.router.navigate(['system'])
              }else{
                this.notifyService.showNotification(
                  'Password is not correct, Please make sure to enter your valid password',
                   NotifyMessageType.error
                   
                )
              }
          }else{
            this.notifyService.showNotification(
              'The user has not been found by this name',
               NotifyMessageType.error
            )
          }
      })

  }

}
