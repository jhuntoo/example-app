export class FieldModel<T> {
  value: T = {};
  touched: boolean = false;
}


export class BaseFormModel {
  asyncValidating: boolean = false;
  error: boolean = false;
  initialized: boolean = false;
  submitting: boolean = false;
  submitFailed: boolean = false;
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

export class FieldChangedEvent {

  constructor(public form: string,
              public field: string,
              public value: any) {
  }
}
