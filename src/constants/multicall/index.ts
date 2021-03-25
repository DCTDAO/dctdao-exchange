import { ChainId } from '@dctdao/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.MOONBEAM_TEST]: '0x0290FB167208Af455bB137780163b7B7a9a10C16'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
