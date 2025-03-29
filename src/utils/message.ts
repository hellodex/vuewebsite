import { ElMessage } from 'element-plus'

import SuccessImg from '@/assets/img/success-img.png'
import ErrorImg from '@/assets/img/error-img.png'
import InfoImg from '@/assets/img/info-img.png'

export const customMessage = (params: any) => {
  ElMessage({
    type: params.type,
    dangerouslyUseHTMLString: true,
    plain: true,
    duration: params.duration ?? 2000,
    customClass: params.customClass || 'message_custom_class',
    message: `<div class='display-flex flex-direction-col'>
                <div class='display-flex align-items-center'>
                  ${(() => {
                    if (params.type == 'success') {
                      return `<img src='${SuccessImg}'/>`
                    } else if (params.type == 'error') {
                      return `<img src='${ErrorImg}'/>`
                    } else {
                      return `<img src='${InfoImg}'/>`
                    }
                  })()}
                  <strong class='title'>${params.title}</strong>
                </div>
              </div>`,
    showClose: true
  })
}
