import { validateName, validateEmail, validatePhone, validateDate } from '../application/validator';

describe('Validación de Formatos', () => {
  const validNames = ['Juan', 'María', 'José Luis'];
  const invalidNames = ['J', '123', 'Juan@'];

  const validEmails = ['test@example.com', 'usuario@dominio.es'];
  const invalidEmails = ['test@.com', 'usuario@dominio', 'usuario@.es'];

  const validPhones = ['612345678', '712345678', '912345678'];
  const invalidPhones = ['12345678', '812345678', '61234567a'];

  const validDates = ['2023-01-01', '1990-12-31'];
  const invalidDates = ['2023-13-01', '1990-02-30', '01-01-2023'];

  test.each(validNames)('Nombre válido: %s', (name) => {
    expect(() => validateName(name)).not.toThrow();
  });

  test.each(invalidNames)('Nombre inválido: %s', (name) => {
    expect(() => validateName(name)).toThrow('Invalid name');
  });

  test.each(validEmails)('Correo válido: %s', (email) => {
    expect(() => validateEmail(email)).not.toThrow();
  });

  test.each(invalidEmails)('Correo inválido: %s', (email) => {
    expect(() => validateEmail(email)).toThrow('Invalid email');
  });

  test.each(validPhones)('Teléfono válido: %s', (phone) => {
    expect(() => validatePhone(phone)).not.toThrow();
  });

  test.each(invalidPhones)('Teléfono inválido: %s', (phone) => {
    expect(() => validatePhone(phone)).toThrow('Invalid phone');
  });

  test.each(validDates)('Fecha válida: %s', (date) => {
    expect(() => validateDate(date)).not.toThrow();
  });

  test.each(invalidDates)('Fecha inválida: %s', (date) => {
    expect(() => validateDate(date)).toThrow('Invalid date');
  });
});
