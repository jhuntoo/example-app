import {NgControlName, ControlContainer, Control, NG_VALIDATORS, NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/common';
import {Inject, Directive, Input, Optional, Self, ViewChildren, QueryList } from '@angular/core';
import {Store} from '@ngrx/store';
import {FormActions} from './actions';
import {Subscription, Observable} from 'rxjs/Rx';
import {FieldValueChangedEvent, FieldStatusChangedEvent, FormStatusChangedEvent, FieldModel} from './models';
import {fieldValueUpdates} from './reducers';

@Directive({
  selector: '[bindToStore][ngFormModel]',
})
export class BindToStore {
  // directives: NgControlName[];

  @Input('bindToStore') formName: string;

  ngControlSubscriptions: {[controlName: string]: Subscription} = {};
  constructor(@Inject(ControlContainer) private controlContainer: any,
              private store: Store,
              private formActions: FormActions
            ){

     console.log(this.controlContainer);

  }

  ngAfterViewInit() {
    this.dispatchFormStatus(this.controlContainer.form.status);
    this.controlContainer.form.statusChanges.subscribe(s => this.dispatchFormStatus(s));
    this._syncControlSubscriptions();
  }

  ngOnDestroy() {
    for (var controlName in this.ngControlSubscriptions) {
      this.ngControlSubscriptions[controlName].unsubscribe();
      delete this.ngControlSubscriptions[controlName];
    }
  }

  private _syncControlSubscriptions() {
      const controls = this.controlContainer.formDirective.directives;
      const newWatchedControls = controls.filter(control => !this.ngControlSubscriptions[control.name]);
      let controlNamesToUnwatch = [];
      for (var controlName in this.ngControlSubscriptions) {
        if (controls.filter(c => c.name === controlName).length === 0) {
          controlNamesToUnwatch.push(controlName);
        }
      }

    newWatchedControls.forEach(control => {
      // console.log('Watching', control);
      let form = this.formName;
      let field = control.name;
      let subscription = control.control.valueChanges.subscribe(val => {
        this.store.dispatch(this.formActions.fieldValueChanged(new FieldValueChangedEvent(form, field, val)));
      });

      let subscription = control.control.statusChanges.distinctUntilChanged().subscribe(status => {
        console.log('status', status);
        this.store.dispatch(this.formActions.fieldStatusChanged(new FieldStatusChangedEvent(form, field, status)));
      });


      let fieldModel: Observable<FieldModel>;

      fieldModel = this.store.let(fieldValueUpdates(form, field));
      fieldModel.subscribe(field => {
        control.control.updateValue(field.value, {emitEvent: false });
      });

      // console.log('Watching', control.name);
      this.ngControlSubscriptions[field] = subscription;
    });

    controlNamesToUnwatch.forEach(controlName => {
      this.ngControlSubscriptions[controlName].unsubscribe();
      delete this.ngControlSubscriptions[controlName];
    });
  }

  dispatchFormStatus(status: string) {
    this.store.dispatch(this.formActions.formStatusChanged(new FormStatusChangedEvent(this.formName, status)));
  }


}
