import { registerDecorator, ValidationOptions } from 'class-validator';

export const IsTVMAddress =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string) =>
    registerDecorator({
      name: 'isTVMAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: string): boolean =>
          typeof value === 'string' && /^(0|-1):[\da-fA-F]{64}$/.test(value),
        defaultMessage: (): string => 'recipient address ($value) is invalid',
      },
    });
