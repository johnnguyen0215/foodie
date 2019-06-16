import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormInput } from '../../../shared/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  formInputs: Array<FormInput> = [
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
  ];

  ngOnInit () {}

  login(event) {
    const {
      email,
      password
    } = event;

    this.apiService.login(email, password).subscribe(
      (data) => {
        this.router.navigate(['/home']);
      }
    );
  }
}
