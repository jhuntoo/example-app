import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {FieldChangedEvent} from './models';

@Injectable()
export class FormActions {
  static VALUE_CHANGED = 'FORMS/VALUE_CHANGED';
  valueChanged(event: FieldChangedEvent): Action {
    return {
      type: FormActions.VALUE_CHANGED,
      payload: event
    };
  }


}
