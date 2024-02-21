export interface PaymentIntent {
  id: string
  amount: number
  amount_capturable: number
  amount_received: number
  client_secret: string | null
  created: number
  currency: string
}
