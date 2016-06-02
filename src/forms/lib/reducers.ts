import {Observable} from 'rxjs/Rx';
import {compose} from '@ngrx/core/compose';
import {Action} from '@ngrx/store';
import {FormActions} from './actions';
import {FieldValueChangedEvent, FieldStatusChangedEvent FieldModel} from './models';

export interface FormsState {
  forms: any;
};

export function formsReducer(state = {}, action: Action): any {
  switch (action.type) {
    case FormActions.VALUE_CHANGED:
      var event: FieldValueChangedEvent = action.payload;

      const fieldUpdateFn = (previousState: FieldModel) => Object.assign({}, previousState, {value: event.value, touched: true})
      return updateFieldInForm(state, action, fieldUpdateFn);

      // const previousState = state;
      // const previousFormState = previousState[event.form] || {};
      // const previousFieldState = previousFormState[event.field] || new FieldModel();
      // return Object.assign({}, state, {
      //   [event.form]: Object.assign({}, previousFormState, {
      //     [event.field]: Object.assign({}, previousFieldState, {value: event.value})
      //   })
      // });
      break;
    case FormActions.STATUS_CHANGED:
      var event: FieldStatusChangedEvent = action.payload;
      const fieldUpdateFn = (previousState: FieldModel) => Object.assign({}, previousState, {status: event.status})
      return updateFieldInForm(state, action, fieldUpdateFn);

      //
      //
      // const previousState = state;
      // const previousFormState = previousState[event.form] || {};
      // const previousFieldState = previousFormState[event.field] || new FieldModel();
      // return Object.assign({}, state, {
      //   [event.form]: Object.assign({}, previousFormState, {
      //     [event.field]: Object.assign({}, previousFieldState, {value: event.value})
      //   })
      // });
      break;
    default:
          return state;
    }

}
function updateFieldInForm(state, action: Action, fieldUpdateFn:(previousState: FieldModel) => FieldModel): FormsState {
  const event: FieldStatusChangedEvent = action.payload;
  const previousState = state;
  const previousFormState = previousState[event.form] || {};
  const previousFieldState = previousFormState[event.field] || new FieldModel();
  return Object.assign({}, state, {
    [event.form]: Object.assign({}, previousFormState, {
      [event.field]: fieldUpdateFn(previousFieldState)
    })
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
