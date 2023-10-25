import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsWithinDateRange(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isWithinDateRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const date = new Date(value);
          const currentYear = new Date().getFullYear(); 

          const minDate = new Date(currentYear, 0, 1);

          const maxDate = new Date(currentYear, 11, 31);

          return date >= minDate && date <= maxDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not within the allowable date range.`;
        },
      },
    });
  };
}
