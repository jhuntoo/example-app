import {
  Control, FormBuilder, ControlGroup, Validators, NgFormModel,
} from '@angular/common';
import {
  Component, OnInit, OnChanges, ChangeDetectionStrategy
} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable'
import {BindToStore} from './lib/directives';
import {getFormsState} from './lib/reducers';

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
    <h3>Angular Form value:</h3>
    <pre>{{value}}</pre>
    <h3>ngrx/forms value:</h3>
    <pre>{{formsState | async}}</pre>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleFormComponent {

  loginForm: ControlGroup;

  formsState: Observable<string>;

  constructor(private fb: FormBuilder, private store: Store) {
    this.loginForm = fb.group({
      userName: ["", Validators.required],
      passwordRetry: fb.group({
        password: ["", Validators.required],
        passwordConfirmation: ["", Validators.required]
      })
    });
    this.formsState = this.store.let(getFormsState()).map(s => JSON.stringify(s, null, 2));
  };

  get value(): string {
    return JSON.stringify(this.loginForm.value, null, 2);
  }
}
