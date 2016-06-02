import {Observable} from 'rxjs/Rx';
import {compose} from '@ngrx/core/compose';
import {Action} from '@ngrx/store';
import {FormActions} from './actions';
import {FieldChangedEvent, FieldModel} from './models';

export interface FormsState {
  forms: any;
};

export function formsReducer(state = {}, action: Action): any {
  switch (action.type) {
    case FormActions.VALUE_CHANGED:
      const event: FieldChangedEvent = action.payload;
      const previousState = state;
      const previousFormState = previousState[event.form] || {};
      const previousFieldState = previousFormState[event.field] || new FieldModel();
      return Object.assign({}, state, {
        [event.form]: Object.assign({}, previousFormState, {
          [event.field]: Object.assign({}, previousFieldState, {value: event.value})
        })
      });
      return state;
    }

}


export function getFormsState() {
  return (state$: Observable<FormsState>) => state$
    .filter(s => s.forms)
    .select(s => s.forms);
}

function getfieldUpdates(form: string, field: string) {
  return (state$: Observable<FormsState>) => state$
    .filter(s => s[form][field])
    .map(s => s[form][field])
    .distinctUntilChanged();
}

export function fieldUpdates(form: string, field: string) {
  return compose(getfieldUpdates(form, field), getFormsState());
}
