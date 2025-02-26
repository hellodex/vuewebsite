import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'
import { useAppKitAccount, useAppKit, useDisconnect } from '@reown/appkit/vue'
import { useGlobalStore } from '@/stores/global'
import { customMessage } from '@/utils/message'

export function useConnectWallet() {
  const i18n = useI18n()
  const globalStore = useGlobalStore()
  const modal = useAppKit()
  const appkitAccount = useAppKitAccount()
  const { disconnect } = useDisconnect()

  const connectWallet = () => {
    modal.open()
  }

  const disconnectWallet = () => {
    ElMessageBox.confirm(i18n.t('disconnectConfirmText'), i18n.t('Tips'), {
      confirmButtonText: i18n.t('Confirm'),
      cancelButtonText: i18n.t('Cancel'),
      type: 'info'
    })
      .then(() => {
        customMessage({
          type: 'success',
          title: '账号退出成功'
        })
        disconnect()
      })
      .catch(() => {})
  }

  watch(
    [
      () => appkitAccount.value.address,
      () => appkitAccount.value.isConnected,
      () => appkitAccount.value.caipAddress
    ],
    () => {
      console.log('account updated:', appkitAccount.value.address)
      console.log('account updated:', appkitAccount.value.isConnected)
      console.log('account updated:', appkitAccount.value.caipAddress)
      globalStore.setWalletInfo({
        address: appkitAccount.value.address,
        isConnected: appkitAccount.value.isConnected,
        chainId:
          appkitAccount.value.caipAddress?.split(':')[0].toLocaleLowerCase() == 'solana'
            ? 501
            : appkitAccount.value.caipAddress?.split(':')[1],
        walletType:
          appkitAccount.value.caipAddress?.split(':')[0].toLocaleLowerCase() == 'solana'
            ? 'Solana'
            : 'Evm'
      })
    }
  )

  return {
    connectWallet,
    disconnectWallet
  }
}
