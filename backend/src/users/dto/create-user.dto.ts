import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number must contain 7-15 digits and may start with +',
  })
  phonenumber: string;
}
