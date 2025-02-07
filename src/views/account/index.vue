<template>
  <div class="account-main display-flex align-items-center justify-content-sp">
    <div class="account-left display-flex flex-direction-col">
      <RouterLink to="/Account/Property">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="icon-property" class="icon-user-item"></svg-icon>
          <i>我的资产</i>
        </span>
      </RouterLink>
      <RouterLink to="/Account/WalletConfig">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="icon-wallet" class="icon-user-item"></svg-icon>
          <i>钱包配置</i>
        </span>
      </RouterLink>
      <RouterLink to="/Account/Rebate">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="icon-rebate" class="icon-user-item"></svg-icon>
          <i>我的返佣</i>
        </span>
      </RouterLink>
      <RouterLink to="/Account/Secure">
        <span class="user-item display-flex align-items-center">
          <svg-icon name="icon-secure" class="icon-user-item"></svg-icon>
          <i>安全中心</i>
        </span>
      </RouterLink>
    </div>
    <div class="account-right">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()
</script>
<style scoped lang="scss">
.account-main {
  padding: 12px;
  .account-left {
    font-size: 12px;
    width: 200px;
    min-width: 200px;
    padding: 12px;
    border-radius: 12px;

    font-style: normal;
    background-color: rgba(23, 24, 27, 0.3);
    height: calc(-144px + 100vh);
    a {
      display: block;
      color: #5c6068;
      line-height: 32px;
      font-size: 14px;
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
  .account-right {
    width: calc(100vw - 200px);
    height: calc(-144px + 100vh);
    border-radius: 12px;

    font-style: normal;
    padding-left: 16px;
  }
}
</style>
