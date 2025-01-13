import { ElNotification } from 'element-plus'

export const notificationInfo = (params: any) => {
  ElNotification.closeAll()
  ElNotification.info({
    ...params,
    dangerouslyUseHTMLString: true,
    duration: 0
  })
}

export const notificationSuccessful = (params: any) => {
  ElNotification.closeAll()
  ElNotification.success({
    ...params,
    dangerouslyUseHTMLString: true,
    duration: 3000
  })
}

export const notificationFailed = (params: any) => {
  ElNotification.closeAll()
  ElNotification.error({
    ...params,
    duration: 3000
  })
}

export const notificationWarn = (params: any) => {
  ElNotification.closeAll()
  ElNotification.warning({
    ...params,
    duration: 3000
  })
}
