import { validateName, validateEmail, validatePhone, validateDate } from '../application/validator';

describe('Validación de Datos de Candidato (España)', () => {
  describe('Validación de Nombres', () => {
    const casosValidosNombres = [
      ['María José'],
      ['Ñúñez'],
      ['José Ángel'],
      ['Peña Rodríguez'],
      ['Ramón García'],
    ];

    const casosInvalidosNombres = [
      ['A', 'Nombre demasiado corto'],
      ['123', 'Contiene números'],
      ['María@José', 'Caracteres especiales'],
      ['', 'Nombre vacío'],
      ['A'.repeat(101), 'Excede longitud máxima'],
    ];

    test.each(casosValidosNombres)('debería aceptar el nombre: %s', (nombre) => {
      expect(() => validateName(nombre)).not.toThrow();
    });

    test.each(casosInvalidosNombres)('debería rechazar el nombre: %s (%s)', (nombre, razon) => {
      expect(() => validateName(nombre)).toThrow('Invalid name');
    });
  });

  describe('Validación de Email', () => {
    const casosValidosEmail = [
      ['usuario@empresa.es'],
      ['nombre.apellido@dominio.com.es'],
      ['user123@subdominio.es'],
      ['nombre+tag@dominio.es'],
    ];

    const casosInvalidosEmail = [
      ['@dominio.es', 'Sin nombre de usuario'],
      ['usuario@.es', 'Dominio incompleto'],
      ['usuario@dominio', 'Sin TLD'],
      ['usuario..nombre@dominio.es', 'Puntos consecutivos'],
    ];

    test.each(casosValidosEmail)('debería aceptar el email: %s', (email) => {
      expect(() => validateEmail(email)).not.toThrow();
    });

    test.each(casosInvalidosEmail)('debería rechazar el email: %s (%s)', (email, razon) => {
      expect(() => validateEmail(email)).toThrow('Invalid email');
    });
  });

  describe('Validación de Teléfono', () => {
    const casosValidosTelefono = [
      ['612345678', 'Móvil Vodafone'],
      ['722345678', 'Móvil Yoigo'],
      ['912345678', 'Fijo Madrid'],
    ];

    const casosInvalidosTelefono = [
      ['512345678', 'Prefijo inválido'],
      ['61234567', 'Número corto'],
      ['6123456789', 'Número largo'],
      ['61234567a', 'Contiene letras'],
    ];

    test.each(casosValidosTelefono)('debería aceptar el teléfono: %s (%s)', (telefono, tipo) => {
      expect(() => validatePhone(telefono)).not.toThrow();
    });

    test.each(casosInvalidosTelefono)('debería rechazar el teléfono: %s (%s)', (telefono, razon) => {
      expect(() => validatePhone(telefono)).toThrow('Invalid phone');
    });
  });

  describe('Validación de Fechas', () => {
    const casosValidosFecha = [
      ['2024-02-29', 'Año bisiesto'],
      ['2023-12-31', 'Último día del año'],
      ['2024-01-01', 'Primer día del año'],
      ['1990-01-01', 'Fecha antigua'],
    ];

    const casosInvalidosFecha = [
      ['2023-02-29', 'Día inválido en año no bisiesto'],
      ['2024-13-01', 'Mes inválido'],
      ['2024-00-01', 'Mes cero'],
      ['01/01/2024', 'Formato incorrecto'],
    ];

    test.each(casosValidosFecha)('debería aceptar la fecha: %s (%s)', (fecha, desc) => {
      expect(() => validateDate(fecha)).not.toThrow();
    });

    test.each(casosInvalidosFecha)('debería rechazar la fecha: %s (%s)', (fecha, razon) => {
      expect(() => validateDate(fecha)).toThrow('Invalid date');
    });
  });
});
