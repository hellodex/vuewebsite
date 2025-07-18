<template>
  <Teleport to="body">
    <!-- 悬浮按钮 -->
    <div
      v-if="isLogin && !isExpanded"
      ref="floatingWindow"
      class="loop-floating-window"
      :class="{ 'is-hidden': isHidden }"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @mousedown="startFloatingDrag"
    >
      <div class="floating-content" @click="handleExpand">
        <div class="loop-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" stroke="#667eea" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="#764ba2" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="3" fill="#667eea"/>
          </svg>
        </div>
        <div v-if="!isHidden" class="loop-text">Loop Space</div>
      </div>
      <div class="control-btn" @click.stop="toggleHidden">
        <el-icon v-if="!isHidden"><Close /></el-icon>
        <el-icon v-else><Plus /></el-icon>
      </div>
    </div>
    
    <!-- 展开的iframe窗口 -->
    <div
      v-show="isLogin && isExpanded"
      ref="expandedWindow"
      class="loop-expanded-window"
      :style="{
        left: expandedPosition.x + 'px',
        top: expandedPosition.y + 'px',
        width: expandedSize.width + 'px',
        height: expandedSize.height + 'px',
        display: (isLogin && isExpanded) ? 'flex' : 'none'
      }"
    >
      <div class="window-header" @mousedown="startExpandedDrag">
        <div class="header-title">
          <div class="loop-icon-small">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4" stroke="#667eea" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="#764ba2" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="3" fill="#667eea"/>
            </svg>
          </div>
          <span>Loop Space</span>
        </div>
        <div class="header-controls">
          <el-icon class="control-icon" @click.stop="handleMinimize"><Minus /></el-icon>
          <el-icon class="control-icon close-icon" @click.stop="handleClose"><Close /></el-icon>
        </div>
      </div>
      <div class="window-content">
        <iframe 
          :src="iframeUrl" 
          frameborder="0"
          allow="camera; microphone; fullscreen"
          allowfullscreen
        ></iframe>
      </div>
      <!-- 调整大小的把手 -->
      <div class="resize-handle resize-handle-right" @mousedown.stop="startResize($event, 'right')"></div>
      <div class="resize-handle resize-handle-bottom" @mousedown.stop="startResize($event, 'bottom')"></div>
      <div class="resize-handle resize-handle-corner" @mousedown.stop="startResize($event, 'corner')"></div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { APIGetLoopAccessToken } from '@/api/login'
import { ElMessage } from 'element-plus'
import { Close, Plus, Minus } from '@element-plus/icons-vue'

const globalStore = useGlobalStore()

// 悬浮窗状态
const isHidden = ref(false)
const isExpanded = ref(false)
const position = ref({ x: window.innerWidth - 150, y: window.innerHeight - 200 })
const expandedPosition = ref({ x: window.innerWidth - 420, y: 100 })
const expandedSize = ref({ width: 375, height: 667 })

// 拖动相关
const dragData = ref({
  isDragging: false,
  startX: 0,
  startY: 0,
  startPosX: 0,
  startPosY: 0
})

// 调整大小相关
const resizeData = ref({
  isResizing: false,
  type: '' as 'right' | 'bottom' | 'corner' | '',
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0
})

// DOM引用
const floatingWindow = ref<HTMLElement>()
const expandedWindow = ref<HTMLElement>()

// Loop相关
const accessToken = ref('')
const iframeUrl = ref('https://loopai.fan/space/db72e90f-af4a-48c8-bcbc-c5d3d53db033')

// 判断是否登录
const isLogin = computed(() => !!globalStore.accountInfo)

// 获取Loop access token
const getLoopAccessToken = async () => {
  if (!globalStore.accountInfo) {
    accessToken.value = ''
    return
  }
  
  try {
    const res: any = await APIGetLoopAccessToken({})
    if (res && res.access_token) {
      accessToken.value = res.access_token
      updateIframeUrl()
    }
  } catch (error) {
    console.error('获取Loop access token失败:', error)
    ElMessage.error('获取群聊权限失败，请稍后重试')
  }
}

// 更新iframe URL
const updateIframeUrl = () => {
  if (accessToken.value) {
    iframeUrl.value = `https://loopai.fan/space/db72e90f-af4a-48c8-bcbc-c5d3d53db033?access_token=${accessToken.value}`
  }
}

// 展开窗口
const handleExpand = async () => {
  // 第一次展开时获取access_token
  if (!accessToken.value && !iframeUrl.value.includes('access_token')) {
    await getLoopAccessToken()
  }
  isExpanded.value = true
}

// 关闭展开窗口
const handleClose = () => {
  // 询问用户是否确认关闭
  if (confirm('关闭后将退出Loop Space，确定要关闭吗？')) {
    isExpanded.value = false
    // 重置iframe URL，真正关闭时才释放资源
    iframeUrl.value = 'about:blank'
    accessToken.value = ''
  }
}

// 最小化（返回悬浮按钮状态）
const handleMinimize = () => {
  isExpanded.value = false
}

// 切换显示/隐藏
const toggleHidden = () => {
  isHidden.value = !isHidden.value
}

// 开始拖动悬浮窗
const startFloatingDrag = (e: MouseEvent) => {
  // 如果点击的是控制按钮或内容区，不触发拖动
  if ((e.target as HTMLElement).closest('.control-btn') || 
      (e.target as HTMLElement).closest('.floating-content')) {
    return
  }
  
  dragData.value = {
    isDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    startPosX: position.value.x,
    startPosY: position.value.y
  }
  
  document.addEventListener('mousemove', handleFloatingDrag)
  document.addEventListener('mouseup', stopDrag)
  document.body.style.cursor = 'move'
  e.preventDefault()
}

// 开始拖动展开窗口
const startExpandedDrag = (e: MouseEvent) => {
  // 如果点击的是控制按钮，不触发拖动
  if ((e.target as HTMLElement).closest('.header-controls')) {
    return
  }
  
  dragData.value = {
    isDragging: true,
    startX: e.clientX,
    startY: e.clientY,
    startPosX: expandedPosition.value.x,
    startPosY: expandedPosition.value.y
  }
  
  document.addEventListener('mousemove', handleExpandedDrag)
  document.addEventListener('mouseup', stopDrag)
  document.body.style.cursor = 'move'
  e.preventDefault()
}

// 处理悬浮窗拖动
const handleFloatingDrag = (e: MouseEvent) => {
  if (!dragData.value.isDragging) return
  
  const deltaX = e.clientX - dragData.value.startX
  const deltaY = e.clientY - dragData.value.startY
  
  const newX = dragData.value.startPosX + deltaX
  const newY = dragData.value.startPosY + deltaY
  
  // 限制在视窗内
  const maxX = window.innerWidth - (floatingWindow.value?.offsetWidth || 150)
  const maxY = window.innerHeight - (floatingWindow.value?.offsetHeight || 80)
  
  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

// 处理展开窗口拖动
const handleExpandedDrag = (e: MouseEvent) => {
  if (!dragData.value.isDragging) return
  
  const deltaX = e.clientX - dragData.value.startX
  const deltaY = e.clientY - dragData.value.startY
  
  const newX = dragData.value.startPosX + deltaX
  const newY = dragData.value.startPosY + deltaY
  
  // 限制在视窗内
  const maxX = window.innerWidth - expandedSize.value.width
  const maxY = window.innerHeight - expandedSize.value.height
  
  expandedPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

// 停止拖动
const stopDrag = () => {
  dragData.value.isDragging = false
  document.removeEventListener('mousemove', handleFloatingDrag)
  document.removeEventListener('mousemove', handleExpandedDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.body.style.cursor = ''
}

// 开始调整大小
const startResize = (e: MouseEvent, type: 'right' | 'bottom' | 'corner') => {
  resizeData.value = {
    isResizing: true,
    type: type,
    startX: e.clientX,
    startY: e.clientY,
    startWidth: expandedSize.value.width,
    startHeight: expandedSize.value.height
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
  e.stopPropagation()
}

// 处理调整大小
const handleResize = (e: MouseEvent) => {
  if (!resizeData.value.isResizing) return
  
  const deltaX = e.clientX - resizeData.value.startX
  const deltaY = e.clientY - resizeData.value.startY
  
  if (resizeData.value.type === 'right' || resizeData.value.type === 'corner') {
    const newWidth = resizeData.value.startWidth + deltaX
    expandedSize.value.width = Math.max(300, Math.min(newWidth, window.innerWidth - expandedPosition.value.x))
  }
  
  if (resizeData.value.type === 'bottom' || resizeData.value.type === 'corner') {
    const newHeight = resizeData.value.startHeight + deltaY
    expandedSize.value.height = Math.max(400, Math.min(newHeight, window.innerHeight - expandedPosition.value.y))
  }
}

// 停止调整大小
const stopResize = () => {
  resizeData.value.isResizing = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

// 监听用户登录状态变化
watch(() => globalStore.accountInfo, () => {
  if (globalStore.accountInfo) {
    getLoopAccessToken()
  } else {
    accessToken.value = ''
  }
})

// 监听窗口大小变化
const handleWindowResize = () => {
  // 调整悬浮窗位置
  const maxX = window.innerWidth - (floatingWindow.value?.offsetWidth || 150)
  const maxY = window.innerHeight - (floatingWindow.value?.offsetHeight || 80)
  
  if (position.value.x > maxX) position.value.x = maxX
  if (position.value.y > maxY) position.value.y = maxY
  
  // 调整展开窗口位置和大小
  const maxExpandedX = window.innerWidth - expandedSize.value.width
  const maxExpandedY = window.innerHeight - expandedSize.value.height
  
  if (expandedPosition.value.x > maxExpandedX) expandedPosition.value.x = maxExpandedX
  if (expandedPosition.value.y > maxExpandedY) expandedPosition.value.y = maxExpandedY
  
  // 调整窗口大小
  if (expandedSize.value.width > window.innerWidth - expandedPosition.value.x) {
    expandedSize.value.width = window.innerWidth - expandedPosition.value.x
  }
  if (expandedSize.value.height > window.innerHeight - expandedPosition.value.y) {
    expandedSize.value.height = window.innerHeight - expandedPosition.value.y
  }
}

onMounted(() => {
  if (globalStore.accountInfo) {
    getLoopAccessToken()
  }
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
  // 清理所有可能的事件监听
  document.removeEventListener('mousemove', handleFloatingDrag)
  document.removeEventListener('mousemove', handleExpandedDrag)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped lang="scss">
// 悬浮按钮样式
.loop-floating-window {
  position: fixed;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  padding: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  user-select: none;
  cursor: move;
  
  &:hover {
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.2);
  }
  
  &.is-hidden {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 8px;
    
    .floating-content {
      justify-content: center;
      
      .loop-icon {
        margin-right: 0;
      }
    }
  }
  
  .floating-content {
    display: flex;
    align-items: center;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    
    .loop-icon {
      width: 30px;
      height: 30px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .loop-text {
      white-space: nowrap;
    }
  }
  
  .control-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: #ff6b6b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #ff5252;
      transform: scale(1.1);
    }
    
    .el-icon {
      color: white;
      font-size: 12px;
    }
  }
}

// 展开窗口样式
.loop-expanded-window {
  position: fixed;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 10001;
  overflow: hidden;
  min-width: 300px;
  min-height: 400px;
  
  .window-header {
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: white;
    flex-shrink: 0;
    cursor: move;
    user-select: none;
    
    .header-title {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      
      .loop-icon-small {
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    
    .header-controls {
      display: flex;
      gap: 15px;
      
      .control-icon {
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.1);
        }
        
        &.close-icon:hover {
          color: #ff6b6b;
        }
      }
    }
  }
  
  .window-content {
    flex: 1;
    overflow: hidden;
    background: #f5f5f5;
    
    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
  
  // 调整大小的把手
  .resize-handle {
    position: absolute;
    user-select: none;
    
    &.resize-handle-right {
      right: 0;
      top: 50px; // 避开header
      bottom: 0;
      width: 8px;
      cursor: ew-resize;
      
      &:hover {
        background: rgba(102, 126, 234, 0.1);
      }
    }
    
    &.resize-handle-bottom {
      left: 0;
      right: 0;
      bottom: 0;
      height: 8px;
      cursor: ns-resize;
      
      &:hover {
        background: rgba(102, 126, 234, 0.1);
      }
    }
    
    &.resize-handle-corner {
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      cursor: nwse-resize;
      background: transparent;
      
      &::after {
        content: '';
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 5px;
        height: 5px;
        border-right: 2px solid #667eea;
        border-bottom: 2px solid #667eea;
      }
      
      &:hover::after {
        border-color: #764ba2;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .loop-floating-window {
    &:not(.is-hidden) {
      .loop-text {
        display: none;
      }
      
      .loop-icon {
        margin-right: 0;
      }
    }
  }
  
  .loop-expanded-window {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
}
</style>