import { ChainId } from '@dctdao/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.MOONBEAM_TEST]: '0x67B5656d60a809915323Bf2C40A8bEF15A152e3e'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
