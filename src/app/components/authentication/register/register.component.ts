import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormInput } from '../../../shared/models';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiError } from '../../../shared/models';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastrService: ToastrService,
  ) {
      this.toastrService.toastrConfig.tapToDismiss = true;
      this.toastrService.toastrConfig.disableTimeOut = true;
   }

  formInputs: Array<FormInput> = [
    {
      name: 'name',
      placeholder: 'Name (First, Last)',
      type: 'text',
    },
    {
      name: 'email',
      placeholder: 'Email',
      type: 'text',
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
    },
    {
      name: 'retypePassword',
      type: 'password',
      placeholder: 'Retype Password'
    },
  ];

  ngOnInit() {
  }


  register(event: any) {
    const {
      name,
      email,
      password
    } = event;

    this.toastrService.clear();

    this.apiService.signUp(name, email, password).subscribe(
      () => {
        this.router.navigate(['/home']);
      },
      (apiError: ApiError) => {
        this.toastrService.error(apiError.error);
      }
    );
  }
}
