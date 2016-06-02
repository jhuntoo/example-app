import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import { Component } from '@angular/core';
import {SimpleFormComponent} from './component';

@Component({
  selector: 'simple-form-page',
  directives: [ SimpleFormComponent ],
  template: `
    <h1>Simple Form</h1>
    <simple-form [form]="form">
    </simple-form>
  `
})
export class SimpleFormPage {

}
