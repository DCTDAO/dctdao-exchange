
import React, { useContext, useCallback, useState } from 'react'
import {  currencyEquals, WRAPPED, Currency, Percent, BASE_CURRENCY } from '@dctdao/sdk'
import { RouteComponentProps } from 'react-router-dom'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { LinkStyledButton, TYPE } from '../../theme'
import { ArrowDown } from 'react-feather'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { calculateGasMargin, getBridgeContract } from '../../utils'
import {HANDLER_GENERIC_ADDRESS} from '../../constants'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { Text } from 'rebass'
import { CurrencyAmount, JSBI, Token, Trade } from '@dctdao/sdk'
import { ThemeContext } from 'styled-components'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useBridgeState, useDerivedBridgeInfo, useBridgeActionHandlers } from '../../state/bridge/hooks'
import { useIsExpertMode } from '../../state/user/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import AppBody from '../AppBody'
import { AddRemoveBridge } from '../../components/NavigationTabs'
import { BlueCard, GreyCard, LightCard } from '../../components/Card'
import Row, { RowBetween, RowFlat, AutoRow, RowFixed } from '../../components/Row'
import {NetworkCard, NETWORK_LABELS } from '../../components/Header'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { currencyId } from '../../utils/currencyId'
import Slider from '../../components/Slider'
import QuestionHelper from '../../components/QuestionHelper'
import useDebouncedChangeHandler from '../../utils/useDebouncedChangeHandler'
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper, Dots } from '../../components/swap/styleds'
import { AdvancedDetailsFooter } from '../../components/swap/AdvancedSwapDetailsDropdown'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import {RESOURCE_ID, BRIDGE_CHAINIDS} from '../../constants/index' 
import { ethers } from "ethers"
import ReactGA from 'react-ga'

export default function Bridge({
  match: {
    params: { currencyIdA }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string }>) {

  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  if(!chainId) throw new Error("No ChainId")




  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  

  // birdge state 
  const currency = useCurrency(chainId, currencyIdA)
  const { typedValue, recipient, feeBridge, typedPer } = useBridgeState()
  const {onFieldInput, onPerInput, onSetRecipient, onSetcurrencyId} = useBridgeActionHandlers()
  const {currencyBalance, 
    parsedAmount, 
    parsePerAmount, 
    inputError, 
    sourceDestiChainId,
    max3DecimalsError,
    tokenAddress
  } = useDerivedBridgeInfo(currency ?? undefined)
  

  const formatedPer = parsePerAmount.equalTo('0')
  ? '0'
  : parsePerAmount.lessThan(new Percent('1', '100'))
  ? '<1'
  : parsePerAmount.toFixed(0)

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onPerInput(value.toString())
    },
    [onPerInput]
  )

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsePerAmount.toFixed(0)),
    liquidityPercentChangeCallback
  )

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalance)
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))



  const handleInputSelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      onSetcurrencyId(currencyA)
      history.push(`/bridge/${newCurrencyIdA}`)
    },
    [ history, currencyIdA]
  )

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  const [txHash, setTxHash] = useState<string>('')

  const [approval, approveCallback] = useApproveCallback(parsedAmount, HANDLER_GENERIC_ADDRESS[chainId])
  const addTransaction = useTransactionAdder()

  async function onBridge() {
    if (!chainId || !library || !account || !currency || !parsedAmount || !feeBridge) return
    const bridge = getBridgeContract(chainId, library, account)
    if (!tokenAddress) return
    
    const swapPercentage = typedPer === '' ? '0' : typedPer + '00'
    const targetAddress = recipient ?? account
    
    const value  = ethers.utils.parseEther(feeBridge).toHexString()
    const data = '0x' +
            ethers.utils.hexZeroPad(ethers.BigNumber.from(parsedAmount.raw.toString()).toHexString(), 32).substr(2) +    // Deposit Amount        (32 bytes)
            ethers.utils.hexZeroPad(ethers.BigNumber.from(swapPercentage).toHexString(),32).substr(2) + // adding swap percatge (percentage to be coverted to native token)
            ethers.utils.hexZeroPad(ethers.utils.hexlify((targetAddress.length - 2)/2), 32).substr(2) +    // len(recipientAddress) (32 bytes)
            targetAddress.substr(2);
    
    if(!sourceDestiChainId || BRIDGE_CHAINIDS[sourceDestiChainId[1]] === undefined) return
    const chain_resources = RESOURCE_ID[sourceDestiChainId[0]]
    if(!chain_resources) return
    const resource_ID =  chain_resources[tokenAddress] 
    console.log("Resource_ID ",resource_ID)
    
    const args = [
      BRIDGE_CHAINIDS[sourceDestiChainId[1]],
      resource_ID,
      data
    ]

    setAttemptingTxn(true)
    await bridge.estimateGas.deposit(...args, {value})
    .then(estimatedGasLimit => {
        return bridge.deposit(...args, {value, 
          gasLimit: calculateGasMargin(estimatedGasLimit)})
    }).then(response => {
      setAttemptingTxn(false)
      addTransaction(response, {
        summary:
          'Bridged ' +
          parsedAmount?.toSignificant(3) +
          ' ' +
          currency?.symbol +
          ' from ' +
          NETWORK_LABELS[sourceDestiChainId[0]] +
          ' to ' +
          NETWORK_LABELS[sourceDestiChainId[1]]
      })
      setTxHash(response.hash)
      ReactGA.event({
        category: 'Bridge',
        action: 'move',
        label: [NETWORK_LABELS[sourceDestiChainId[0]],  NETWORK_LABELS[sourceDestiChainId[1]], currency?.symbol].join('/')
      })
    })
    .catch(error => {
      setAttemptingTxn(false)
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
      }
    })

  }
  const isValid = !inputError
  return (
    <>
      <AppBody>
      <AddRemoveBridge/>
      <Wrapper>
      
            <LightCard padding="1px" borderRadius={'20px'}>
              <RowBetween padding="1rem">
                          <TYPE.subHeader fontWeight={500} fontSize={16}>
                            Source chain
                          </TYPE.subHeader>
                          <Text fontWeight={100}>
                          {chainId && sourceDestiChainId && 
                          NETWORK_LABELS[sourceDestiChainId[0]] && <NetworkCard>{NETWORK_LABELS[sourceDestiChainId[0]]}</NetworkCard>}
                          </Text>
              </RowBetween>
                
            </LightCard>
            <LightCard padding="1px" borderRadius={'20px'} margin="2px">
              <RowBetween padding="1rem">
                          <TYPE.subHeader fontWeight={500} fontSize={16}>
                            Destination chain
                          </TYPE.subHeader>
                          <Text fontWeight={100}>
                          {chainId && sourceDestiChainId && 
                          NETWORK_LABELS[sourceDestiChainId[1]] && <NetworkCard>{NETWORK_LABELS[sourceDestiChainId[1]]}</NetworkCard>}
                          </Text>
              </RowBetween>
            </LightCard>
            <CurrencyInputPanel
              value={typedValue}
              showMaxButton={!atMaxAmountInput}
              currency={currency}
              onUserInput={onFieldInput}
              onMax={() => {
                onFieldInput(maxAmountInput?.toExact() ?? '')}}
              onCurrencySelect={handleInputSelect}
              pattern="^(0x[a-fA-F0-9]{40})$"
              id="bridge-currency-input"
              error={max3DecimalsError}
              showCommonBases
            />

              <LightCard>
              <AutoColumn gap="20px">
                <RowBetween>
                  <Text fontWeight={500}>To Native</Text>
                  <QuestionHelper
                    text={'This percentage of your tokens will be automaticaly unwrapped or traded to the native token on the destination chain. Be careful, you can get front-run.'
                    }
                  />
                  
                </RowBetween>
                <Row style={{ alignItems: 'flex-end' }}>
                  <Text fontSize={58} fontWeight={400}>
                    {formatedPer}%
                  </Text>
                </Row>
                
                  <Slider value={innerLiquidityPercentage} onChange={setInnerLiquidityPercentage} />
              </AutoColumn>
            </LightCard>
            {recipient === null ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onSetRecipient('')}>
                    + Set different destination address
                  </LinkStyledButton>
            ) : null}
            {recipient !== null  ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onSetRecipient(null)}>
                    - Use same address
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onSetRecipient} />
              </>
            ) : null}


            {!account ? (
              <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
            ) : (
              <AutoColumn gap={'md'}>
                { isValid && (
                    <RowBetween>
                      {approval !== ApprovalState.APPROVED && (
                        <ButtonPrimary
                          onClick={approveCallback}
                          disabled={approval === ApprovalState.PENDING}
                          
                        >
                          {approval === ApprovalState.PENDING ? (
                            <Dots>Approving {currency?.symbol}</Dots>
                          ) : (
                            'Approve ' + currency?.symbol
                          )}
                        </ButtonPrimary>
                      )}
                    </RowBetween>
                  )}
                <ButtonError
                  onClick={() => {
                    onBridge()
                  }}
                  disabled={!isValid || approval !== ApprovalState.APPROVED }
                  error={!isValid && !!parsedAmount }
                >
                  <Text fontSize={20} fontWeight={500}>
                    {inputError ?? 'Deposit'}
                  </Text>
                </ButtonError>
              </AutoColumn>
            )}





            

        
        </Wrapper>
      </AppBody>

      <AdvancedDetailsFooter show={Boolean(feeBridge)}>
            <AutoColumn gap="md">
              <AutoColumn style={{ padding: '0 20px' }}>
                  <RowBetween>
                    <RowFixed>
                      <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                        Bridge Fee 
                      </TYPE.black>
                      <QuestionHelper text="Fee paid to the relayers for executing transactions on the destination chain." />
                    </RowFixed>
                    <RowFixed>
                      <TYPE.black color={theme.text1} fontSize={14}>
                        {feeBridge} {chainId && BASE_CURRENCY[chainId].symbol}
                      </TYPE.black>
                    </RowFixed>
                  </RowBetween>
              </AutoColumn>
            </AutoColumn>
        </AdvancedDetailsFooter>
    </>
  )
}
