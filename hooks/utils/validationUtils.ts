/**
 * Validation utilities for entity operations
 */

/**
 * Validates that a value is not empty
 */
export function validateRequired(
  value: unknown,
  fieldName = 'Campo'
): string | undefined {
  if (value === null || value === undefined) {
    return `${fieldName} é obrigatório`;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} é obrigatório`;
  }

  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} não pode estar vazio`;
  }

  return undefined;
}

/**
 * Validates that a string has minimum length
 */
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName = 'Campo'
): string | undefined {
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return undefined;
}

/**
 * Validates that a string has maximum length
 */
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName = 'Campo'
): string | undefined {
  if (value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return undefined;
}

/**
 * Validates that a value is a valid number
 */
export function validateNumber(
  value: unknown,
  fieldName = 'Campo'
): string | undefined {
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} deve ser um número válido`;
  }
  return undefined;
}

/**
 * Validates that a number is within a range
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName = 'Campo'
): string | undefined {
  if (value < min || value > max) {
    return `${fieldName} deve estar entre ${min} e ${max}`;
  }
  return undefined;
}

/**
 * Validates that coordinates are valid [x, y, z]
 */
export function validateCoordinates(
  coords: unknown,
  fieldName = 'Coordenadas'
): string | undefined {
  if (!Array.isArray(coords)) {
    return `${fieldName} devem ser um array`;
  }

  if (coords.length !== 3) {
    return `${fieldName} devem ter 3 valores [x, y, z]`;
  }

  if (!coords.every((c) => typeof c === 'number' && !isNaN(c))) {
    return `${fieldName} devem conter apenas números válidos`;
  }

  return undefined;
}

/**
 * Validates that a vector is not zero
 */
export function validateNonZeroVector(
  vector: number[],
  fieldName = 'Vetor'
): string | undefined {
  if (vector.every((v) => v === 0)) {
    return `${fieldName} não pode ser nulo`;
  }
  return undefined;
}

/**
 * Validates an email address
 */
export function validateEmail(
  email: string,
  fieldName = 'Email'
): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return `${fieldName} inválido`;
  }
  return undefined;
}

/**
 * Validates a URL
 */
export function validateUrl(
  url: string,
  fieldName = 'URL'
): string | undefined {
  try {
    new URL(url);
    return undefined;
  } catch {
    return `${fieldName} inválida`;
  }
}

/**
 * Combines multiple validators
 */
export function combineValidators(
  ...validators: Array<(value: unknown) => string | undefined>
) {
  return (value: unknown): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
}

/**
 * Validates an object against a schema
 */
export function validateSchema<T extends Record<string, unknown>>(
  obj: T,
  schema: Record<keyof T, (value: unknown) => string | undefined>
): Record<string, string> | undefined {
  const errors: Record<string, string> = {};

  for (const [key, validator] of Object.entries(schema)) {
    const error = validator(obj[key as keyof T]);
    if (error) {
      errors[key] = error;
    }
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}
