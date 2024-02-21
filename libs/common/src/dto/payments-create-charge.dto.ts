import { IsEmail } from 'class-validator'
import { CreateChargeDto } from './create-charge.dto'

export class PaymentsCreateChargeDto extends CreateChargeDto {
  @IsEmail()
  email: string
}
