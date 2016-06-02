import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {FieldValueChangedEvent, FieldStatusChangedEvent} from './models';

@Injectable()
export class FormActions {
  static VALUE_CHANGED = 'FORMS/VALUE_CHANGED';
  valueChanged(event: FieldValueChangedEvent): Action {
    return {
      type: FormActions.VALUE_CHANGED,
      payload: event
    };
  }

  static STATUS_CHANGED = 'FORMS/STATUS_CHANGED';
  statusChanged(event: FieldStatusChangedEvent): Action {
    return {
      type: FormActions.STATUS_CHANGED,
      payload: event
    };
  }


}
