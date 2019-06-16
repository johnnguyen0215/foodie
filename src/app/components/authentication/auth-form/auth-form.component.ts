import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormInput } from 'src/app/shared/models';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthFormComponent implements OnInit {
  @Output() formEmitter = new EventEmitter();
  @Input() formInputs: Array<FormInput> = [];
  authForm: FormGroup = null;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    const authFormGroup = this.formInputs.reduce((acc, formInput) => {
      return {
        ...acc,
        [formInput.name]: [''],
      };
    }, {});

    this.authForm = this.formBuilder.group(authFormGroup);
  }

  submitForm() {
    this.formEmitter.next(this.authForm.value);
  }
}
