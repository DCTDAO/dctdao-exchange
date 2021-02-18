import { Currency, GLIMMER, Token } from '@dctdao/sdk'

export function currencyId(currency: Currency): string {
  if (currency === GLIMMER) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
