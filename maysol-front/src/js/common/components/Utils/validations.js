export const isEmpty = value => value === undefined || value === null || value === '';
function join(rules) {
  return (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0];
}

export function email(value) {
  // Let's not start a debate on email regex! This one is quite standard
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Correo electrónico invalido';
  }

  return null;
}

export function notNull(value) {
  if (value === null || value === undefined) {
    return 'Requerido';
  }

  return null;
}

export function phone(value) {
  // Let's not start a debate on phone regex! This one is the best I can find, the best way to
  // do it correctly is utilizing a third party verification, but for our use case, it is
  // just overkill
  if (!isEmpty(value) && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-,\s/0-9]*$/g.test(value)) {
    return 'Número telefónico inválido';
  }

  return null;
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Requerido';
  }

  return null;
}

export function minLength(min: number) {
  return (value) => {
    if (!isEmpty(value) && value.length < min) {
      return `Debe tener al menos ${min} caracteres`;
    }

    return null;
  };
}

export function maxLength(max: number) {
  return (value) => {
    if (!isEmpty(value) && value.length > max) {
      return `Debe tener no mas de ${max} caracteres`;
    }

    return null;
  };
}
export function numberPositive() {
    return (value) => {
      if (!isEmpty(value) && value >= 0) {
        return `Debe de ser un número positivo`;
      }

      return null;
    };
  }
export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return 'Debe ser un número entero';
  }

  return null;
}

export function oneOf(enumeration) {
  return (value) => {
    if (!enumeration.indexOf(value)) {
      return `Debe ser uno de los siguientes: ${enumeration.join(', ')}`;
    }

    return null;
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'No coinciden';
      }
    }

    return null;
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      // concat enables both functions and arrays of functions
      const rule = join([].concat(rules[key]));
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

export function dpi(value) {
  if (!isEmpty(value) && !/^([0-9]{13}|[0-9]{4}\s[0-9]{5}\s[0-9]{4})$/g.test(value)) {
    return 'DPI inválido';
  }

  return null;
}

export function moneda(value) {
  if (!isEmpty(value) && !/^[0-9]+\.?[0-9]{0,2}$/g.test(value)) {
    return 'Número inválido';
  }
  return null;
}
//valida que la cantidad sea un multiplo de 100
export function monto(value) {
  if (!isEmpty(value) && (value % 100) ){
    return "El monto debe ser un múltiplo de 100"
  }
}

export const validations = {
  required,
  email,
  phone,
  integer,
  minLength,
  maxLength,
  oneOf,
  match,
  createValidator,
  notNull,
  dpi,
  moneda,
  monto,
  numberPositive,
};
