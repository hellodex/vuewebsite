<template>
  <div class="monitor-main display-flex justify-content-sp">
    <div class="monitor-left display-flex flex-direction-col">
      <RouterLink to="/Monitor/ObserveGroup">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="observe-group" class="icon-user-item"></svg-icon>
          <i>钱包列表</i>
        </span>
      </RouterLink>
      <RouterLink to="/Monitor/Strategy">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="icon-strategy" class="icon-user-item"></svg-icon>
          <i>监控配置</i>
        </span>
      </RouterLink>
    </div>
    <div class="monitor-right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()
</script>
<style scoped lang="scss">
.monitor-main {
  padding: 12px;

  .monitor-left {
    font-size: 12px;
    width: 200px;
    min-width: 200px;
    padding: 12px;
    border-radius: 12px;

    font-style: normal;
    background-color: rgba(23, 24, 27, 0.3);
    height: calc(-120px + 100vh);

    a {
      display: block;
      color: #5c6068;
      line-height: 32px;
      font-size: 15px;
      margin-bottom: 12px;
      padding: 6px 12px;
      border-radius: 12px;
      font-style: normal;

      .user-item {
        i {
          font-style: normal;
        }

        .icon-user-item {
          width: 20px;
          height: 21px;
          margin-right: 8px;
          color: #5c6068;
        }
      }
    }

    a:hover {
      background: rgba(58, 60, 64, 0.4);
    }

    .router-link-active.router-link-exact-active {
      background: rgba(58, 60, 64, 0.4);
      color: #f5f5f5;

      .user-item {
        .icon-user-item {
          color: #f5f5f5;
        }
      }
    }
  }

  .monitor-right {
    width: calc(100vw - 200px);
    height: calc(-144px + 100vh);
    border-radius: 12px;

    font-style: normal;
    padding-left: 16px;
  }
}
</style>
