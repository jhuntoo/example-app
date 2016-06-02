import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {
  FieldValueChangedEvent, FieldStatusChangedEvent, FormStatusChangedEvent, FormLoadEvent,
  FormResetEvent
} from './models';

@Injectable()
export class FormActions {
  static FIELD_VALUE_CHANGED = 'FORMS/FIELD_VALUE_CHANGED';
  fieldValueChanged(event: FieldValueChangedEvent): Action {
    return {
      type: FormActions.FIELD_VALUE_CHANGED,
      payload: event
    };
  }

  static FIELD_STATUS_CHANGED = 'FORMS/FIELD_STATUS_CHANGED';
  fieldStatusChanged(event: FieldStatusChangedEvent): Action {
    return {
      type: FormActions.FIELD_STATUS_CHANGED,
      payload: event
    };
  }

  static FORM_STATUS_CHANGED = 'FORMS/FORM_STATUS_CHANGED';
  formStatusChanged(event: FormStatusChangedEvent): Action {
    return {
      type: FormActions.FORM_STATUS_CHANGED,
      payload: event
    };
  }

  static FORM_LOAD = 'FORMS/FORM_LOAD';
  formLoad(event: FormLoadEvent): Action {
    return {
      type: FormActions.FORM_LOAD,
      payload: event
    };
  }

  static FORM_RESET = 'FORMS/FORM_RESET';
  formReset(event: FormResetEvent): Action {
    return {
      type: FormActions.FORM_RESET,
      payload: event
    };
  }


}
