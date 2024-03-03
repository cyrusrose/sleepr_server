import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import {
  PaymentsCreateChargeDto,
  NotificationsServiceClient,
  NOTIFICATIONS_SERVICE_NAME
} from '@app/common'
import { ClientGrpc } from '@nestjs/microservices'

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-10-16'
    }
  )

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc
  ) {}

  // onModuleInit() {
  //   this.notificationsService =
  //     this.client.getService<NotificationsServiceClient>(
  //       NOTIFICATIONS_SERVICE_NAME
  //     )
  // }

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    // const paymentMethod = await this.stripe.paymentMethods.create({
    //   type: 'card',
    //   card: {
    //     cvc: card.cvc,
    //     number: card.number,
    //     exp_month: card.expMonth,
    //     exp_year: card.expYear
    //   }
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

    if (!this.notificationsService) {
      this.notificationsService =
        this.client.getService<NotificationsServiceClient>(
          NOTIFICATIONS_SERVICE_NAME
        )
    }

    this.notificationsService
      .notifyEmail({
        email,
        text: `Your payment of $${amount} has completed successfully.`
      })
      .subscribe(() => {})

    return paymentIntent
  }
}
