import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto'
import { NOTIFICATIONS_SERVICE, PaymentsCreateChargeDto } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16'
    }
  )

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy
  ) {}

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card
    // })

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa', // for test
      amount: amount * 100,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      confirm: true,
      currency: 'usd'
    })

    this.notificationsService.emit('notify_email', { email })

    return paymentIntent
  }
}
