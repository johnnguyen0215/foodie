import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormInput } from '../../../shared/models';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

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


  register(event) {
    const {
      name,
      email,
      password
    } = event;

    this.apiService.signUp(name, email, password).subscribe(
      (data) => {
        this.router.navigate(['/home']);
      }
    );
  }
}
