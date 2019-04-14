import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RegisterFormInput } from '../../shared/models';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder
  ) { }

  formInputs: Array<RegisterFormInput> = [
    {
      name: 'username',
      placeholder: 'Username',
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
      name: 'password',
      type: 'password',
      placeholder: 'Retype Password'
    },
  ];

  registrationForm = this.formBuilder.group(
    {
      name: [''],
      email: [''],
      username: [''],
      password: [''],
      retypePassword: [''],
    }
  );

  ngOnInit() {
  }
}
