import {NgControlName, ControlContainer } from '@angular/common';
import {Inject, Directive, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {FormActions} from './actions';
import {Subscription, Observable} from 'rxjs/Rx';
import {FieldChangedEvent, FieldModel} from './models';
import {fieldUpdates} from './reducers';

@Directive({
  selector: '[bindToStore][ngFormModel]',
})
export class BindToStore {
  directives: NgControlName[];

  @Input('bindToStore') formName: string;

  ngControlSubscriptions: {[controlName: string]: Subscription} = {};
  constructor(@Inject(ControlContainer) private controlContainer: any,
              private store: Store,
              private formActions: FormActions){
  }
  ngDoCheck() {
    this._syncControlSubscriptions();
  }
  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.controlContainer);
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
      let form = this.formName;
      let field = control.name;
      let subscription = control.control.valueChanges.subscribe(val => {
        this.store.dispatch(this.formActions.valueChanged(new FieldChangedEvent(form, field, val)));
      });

      let fieldModel: Observable<FieldModel>;

      fieldModel = this.store.let(fieldUpdates(form, field));
      fieldModel.subscribe(field => {console.log('field update: ', field, control); control.control.updateValue(field.value, {emitEvent: false }); });

      // console.log('Watching', control.name);
      this.ngControlSubscriptions[field] = subscription;
    });

    controlNamesToUnwatch.forEach(controlName => {
      this.ngControlSubscriptions[controlName].unsubscribe();
      delete this.ngControlSubscriptions[controlName];
      // console.log('Unwatched', controlName);
    });
  }


}
