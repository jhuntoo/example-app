import {Observable} from 'rxjs/Rx';
import {compose} from '@ngrx/core/compose';
import {Action} from '@ngrx/store';
import {FormActions} from './actions';
import {
  FieldValueChangedEvent, FieldStatusChangedEvent FieldModel, FormStatusChangedEvent,
  BaseFormModel, FormLoadEvent, FormResetEvent
} from './models';

export interface FormsState {
  forms: any;
};

export function formsReducer(state = {}, action: Action): any {
  switch (action.type) {
    case FormActions.FIELD_VALUE_CHANGED:
      var event: FieldValueChangedEvent = action.payload;
      const fieldUpdateFn = (previousState: FieldModel) => Object.assign({}, previousState, {value: event.value, touched: true});
      return updateFieldInForm(state, action, fieldUpdateFn);
      break;
    case FormActions.FIELD_STATUS_CHANGED:
      var event: FieldStatusChangedEvent = action.payload;
      const fieldUpdateFn = (previousState: FieldModel) => Object.assign({}, previousState, {status: event.status, valid: event.status === 'VALID'});
      return updateFieldInForm(state, action, fieldUpdateFn);
      break;
    case FormActions.FORM_STATUS_CHANGED:
      var event: FormStatusChangedEvent = action.payload;
      const updateFormFn = (previousFormState: BaseFormModel) => Object.assign({}, previousFormState, { _status: event.status, _valid: event.status === 'VALID' });
      return updatePropertyInForm(state, action, updateFormFn);
      break;
    case FormActions.FORM_LOAD:
      var event: FormLoadEvent = action.payload;
      let fields = {};
      for (var field in event.fields) {
         fields[field] = FieldModel.loadFrom(event.fields[field]);
      }
      const updateFormFn = (previousFormState: BaseFormModel) => Object.assign({}, previousFormState, fields);
      return updatePropertyInForm(state, action, updateFormFn);
      break;
    case FormActions.FORM_RESET:
      var event: FormResetEvent = action.payload;
      let resetFields = {};
      for (var field in state[event.form]) {
        if (field.substr(0,1) !== '_') {
          let existingField = state[event.form][field];
          resetFields[field] = FieldModel.loadFrom(existingField.initialValue);
        }
      }
      const updateFormFn = (previousFormState: BaseFormModel) => Object.assign({}, previousFormState, resetFields);
      return updatePropertyInForm(state, action, updateFormFn);
      break;
    default:
          return state;
    }

}
function updateFieldInForm(state, action: Action, fieldUpdateFn:(previousState: FieldModel) => FieldModel): FormsState {
  const event: FieldStatusChangedEvent = action.payload;
  const previousState = state;
  const previousFormState = previousState[event.form] || new BaseFormModel();
  const previousFieldState = previousFormState[event.field] || new FieldModel();
  return Object.assign({}, state, {
    [event.form]: Object.assign({}, previousFormState, {
      [event.field]: fieldUpdateFn(previousFieldState)
    })
  });
}

function updatePropertyInForm(state, action: Action, fieldUpdateFn:(previousState: BaseFormModel) => BaseFormModel): FormsState {
  const event: FormStatusChangedEvent = action.payload;
  const previousState = state;
  const previousFormState = previousState[event.form] || new BaseFormModel();
  return Object.assign({}, state, {
    [event.form]: fieldUpdateFn(previousFormState)
  });
}



export function getFormsState() {
  return (state$: Observable<FormsState>) => state$
    .filter(s => s.forms)
    .select(s => s.forms);
}

function getfieldUpdates(form: string, field: string) {
  return (state$: Observable<FormsState>) => state$
    .filter(s => s[form] && s[form][field])
    .map(s => s[form][field])
    .distinctUntilChanged()
    .share();
}

export function getFieldValueUpdates(form: string, field: string) {
  return (state$: Observable<FormsState>) => state$
    .let(getfieldUpdates(form, field))
    .map(field => field.value)
    .distinctUntilChanged();
}

export function getFieldStatusUpdates(form: string, field: string) {
  return (state$: Observable<FormsState>) => state$
    .let(getfieldUpdates(form, field))
    .map(field => field.status)
    .distinctUntilChanged();
}


export function fieldValueUpdates(form: string, field: string) {
  return compose(getfieldUpdates(form, field), getFormsState());
}

export function fieldStatusUpdates(form: string, field: string) {
  return compose(getFieldStatusUpdates(form, field), getFormsState());
}
