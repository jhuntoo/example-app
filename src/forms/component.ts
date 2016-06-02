import {
  Control, FormBuilder, ControlGroup, Validators, NgFormModel,
} from '@angular/common';
import {
  Component, OnInit, OnChanges, ChangeDetectionStrategy
} from '@angular/core';
import {BindToStore} from './lib/directives';

@Component({
  name: 'simple',
  directives: [NgFormModel, BindToStore],
  selector: 'simple-form',
  showErrorWhen: (c: Control) => c.dirty || c.touched,
  template: `
      <form  [ngFormModel]="loginForm" bindToStore="loginForm">
      <p>Username <input ngControl="userName"></p>
      <div ngControlGroup="passwordRetry">
        <p>Password <input type="password" ngControl="password"></p>
        <p>Confirm password <input type="password" ngControl="passwordConfirmation"></p>
      </div>
    </form>
    <h3>Form value:</h3>
    <pre>{{value}}</pre>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {

  loginForm: ControlGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = fb.group({
      userName: ["", Validators.required],
      passwordRetry: fb.group({
        password: ["", Validators.required],
        passwordConfirmation: ["", Validators.required]
      })
    });
  };

  get value(): string {
    return JSON.stringify(this.loginForm.value, null, 2);
  }
}
