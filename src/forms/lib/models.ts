export class FieldModel<T> {
  value: T = {};
  initialValue: T = {};
  status: "";
  touched: boolean = false;

  public static loadFrom(value: any) {
    let field = new FieldModel();
    field.value = value;
    field.initialValue = value;
    return field;
  }
}


export class BaseFormModel {
  _asyncValidating: boolean = false;
  _valid: boolean = false;
  _initialized: boolean = false;
  _submitting: boolean = false;
  _submitFailed: boolean = false;
}

export class LoginFormModel {
  userName: FieldModel<string>;
  password: FieldModel<string>;
  passwordConfirmation: FieldModel<string>;
}

export class FieldTouchedEvent {
  form: string;
  field: string;
  value: any;
}

export class FieldValueChangedEvent {

  constructor(public form: string,
              public field: string,
              public value: any) {
  }
}

export class FieldStatusChangedEvent {

  constructor(public form: string,
              public field: string,
              public status: any) {
  }
}

export class FormStatusChangedEvent {

  constructor(public form: string,
              public status: any) {
  }
}

export class FormLoadEvent {

  constructor(public form: string,
              public fields: {[field:string]: any}) {
  }
}
export class FormResetEvent {
  constructor(public form: string) {
  }
}
