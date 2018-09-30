import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RegisterFormInput } from '../../shared/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit {

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
    {
      name: 'school',
      type: 'text',
      placeholder: 'School',
    }
  ];

  constructor() { }

  ngOnInit() {
  }
}
