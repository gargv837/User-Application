import { IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, {
    message: 'Phone number must contain 7-15 digits and may start with +',
  })
  phonenumber?: string;
}
