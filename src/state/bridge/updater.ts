import { useBlockNumber } from '../application/hooks'
import { useActiveWeb3React } from '../../hooks'
import { getBridgeContract } from '../../utils'
import {useEffect} from 'react';
import { BigNumber } from '@ethersproject/bignumber'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { setFee } from './actions'
import { ethers } from "ethers";



export default function Updater(): null {

    const { chainId,library, account } = useActiveWeb3React()
    
    const latestBlockNumber = useBlockNumber()

    const dispatch = useDispatch<AppDispatch>()

    
      


    
    useEffect(() => {
        if (!chainId || !library || !account) return 
        const bridge = getBridgeContract(chainId, library, account)
        bridge._fee().then((fee:BigNumber) => {
            const feeBridge = ethers.utils.formatEther(fee)
            dispatch(setFee({feeBridge}))
        })
    
    },[chainId, dispatch, latestBlockNumber])
    

    return null;
}