import { Currency, BASE_CURRENCY, Token } from '@dctdao/sdk'

export function currencyId(currency: Currency): string {
  if (currency === BASE_CURRENCY[1287]) return 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
