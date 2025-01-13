<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'smartmoneyInterface'
})
</script>

<template>
  <div :class="$style.frameParent">
    <div :class="$style.frameGroup">
      <div :class="$style.frameContainer">
        <div :class="$style.textWrapper">
          <div :class="$style.text">我的关注</div>
        </div>
        <div :class="$style.textContainer">
          <div :class="$style.text">推荐</div>
        </div>
        <div :class="$style.textContainer">
          <div :class="$style.text">KOL</div>
        </div>
      </div>
      <div :class="$style.label">选择语言</div>
    </div>
    <div :class="$style.frameDiv">
      <div :class="$style.frameParent1">
        <div :class="$style.image30Parent">
          <img :class="$style.image30Icon" alt="" src="@/assets/img/0xSun.png" />
          <div :class="$style.frameParent2">
            <div :class="$style.xsunParent">
              <div :class="$style.xsun">0xSun</div>
            </div>
            <div :class="$style.fbf89f02a8b5f62ae1dc85abca2a6fParent">
              <div :class="$style.xsun">0FBf89f02a8b5f62ae1dc85abca2a6f47288576731</div>
            </div>
          </div>
        </div>
        <div :class="$style.kol1000Wrapper">
          <div :class="$style.div">知名推特KOL，聪明钱，曾靠链上交易赚取月内1000万美金！</div>
        </div>
        <div :class="$style.frameParent3">
          <div :class="$style.frameParent4">
            <div :class="$style.wrapper">
              <div :class="$style.div">动态</div>
            </div>
            <div :class="$style.container">
              <div :class="$style.div">币种</div>
            </div>
            <div :class="$style.frame">
              <div :class="$style.div">合约地址</div>
            </div>
            <div :class="$style.wrapper1">
              <div :class="$style.div">金额</div>
            </div>
            <div :class="$style.wrapper1">
              <div :class="$style.div">利润</div>
            </div>
            <div :class="$style.wrapper3">
              <div :class="$style.div">时间</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">操作</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper5">
              <div :class="$style.div">加仓</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">BTC</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0FBf8...6731</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3621.6</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">-</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper10">
              <div :class="$style.div">卖出</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">SOL</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0Skf8...6343</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$5623</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3624.6</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper5">
              <div :class="$style.div">加仓</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">Doge</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0LPO0...69lo</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3621.6</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">-</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
        </div>
        <div :class="$style.frameChild" />
        <div :class="$style.frameItem" />
      </div>
      <div :class="$style.frameParent1">
        <div :class="$style.image30Parent">
          <img :class="$style.image30Icon" alt="" src="@/assets/img/0xSun.png" />
          <div :class="$style.frameParent2">
            <div :class="$style.xsunParent">
              <div :class="$style.xsun">0xSun</div>
            </div>
            <div :class="$style.fbf89f02a8b5f62ae1dc85abca2a6fParent">
              <div :class="$style.xsun">0FBf89f02a8b5f62ae1dc85abca2a6f47288576731</div>
            </div>
          </div>
        </div>
        <div :class="$style.kol1000Wrapper">
          <div :class="$style.div">知名推特KOL，聪明钱，曾靠链上交易赚取月内1000万美金！</div>
        </div>
        <div :class="$style.frameParent3">
          <div :class="$style.frameParent4">
            <div :class="$style.wrapper">
              <div :class="$style.div">动态</div>
            </div>
            <div :class="$style.container">
              <div :class="$style.div">币种</div>
            </div>
            <div :class="$style.frame">
              <div :class="$style.div">合约地址</div>
            </div>
            <div :class="$style.wrapper1">
              <div :class="$style.div">金额</div>
            </div>
            <div :class="$style.wrapper1">
              <div :class="$style.div">利润</div>
            </div>
            <div :class="$style.wrapper3">
              <div :class="$style.div">时间</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">操作</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper5">
              <div :class="$style.div">加仓</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">BTC</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0FBf8...6731</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3621.6</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">-</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper10">
              <div :class="$style.div">卖出</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">SOL</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0Skf8...6343</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$5623</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3624.6</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
          <div :class="$style.frameParent5">
            <div :class="$style.wrapper5">
              <div :class="$style.div">加仓</div>
            </div>
            <div :class="$style.frameWrapper">
              <div :class="$style.parent">
                <div :class="$style.xsun">Doge</div>
              </div>
            </div>
            <div :class="$style.fbf86731Wrapper">
              <div :class="$style.div">0LPO0...69lo</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">$3621.6</div>
            </div>
            <div :class="$style.wrapper6">
              <div :class="$style.div">-</div>
            </div>
            <div :class="$style.wrapper8">
              <div :class="$style.div">2024.04.27 15:33:56</div>
            </div>
            <div :class="$style.wrapper4">
              <div :class="$style.div">交易</div>
            </div>
          </div>
        </div>
        <div :class="$style.frameChild" />
        <div :class="$style.frameItem" />
      </div>
    </div>
  </div>
</template>

<style module>
.text {
  width: 80px;
  position: relative;
  line-height: 150%;
  display: inline-block;
  height: 19px;
  flex-shrink: 0;
}

.textWrapper {
  border-bottom: 1px solid #111928;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 0px;
  color: #111928;
}

.textContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 0px;
}

.frameContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.label {
  align-self: stretch;
  width: 348px;
  position: relative;
  line-height: 150%;
  color: #111928;
  text-align: left;
  display: none;
  flex-shrink: 0;
}

.image30Icon {
  width: 40px;
  position: relative;
  border-radius: 200px;
  height: 40px;
  object-fit: cover;
}

.xsun {
  position: relative;
  line-height: 150%;
}

.interfaceEssentialstarIcon {
  width: 20px;
  position: relative;
  height: 20px;
}

.xsunParent {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.fileBlankCopyIcon {
  width: 16px;
  position: relative;
  height: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.fbf89f02a8b5f62ae1dc85abca2a6fParent {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.frameParent2 {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
}

.image30Parent {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  z-index: 0;
  font-size: 14px;
}

.kol1000Wrapper {
  align-self: stretch;
  border-radius: 8px;
  background-color: #f9fafb;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 8px;
  z-index: 1;
  text-align: left;
  color: #6b7280;
}

.div {
  flex: 1;
  position: relative;
  line-height: 150%;
}

.wrapper {
  width: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
}

.container {
  width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
}

.frame {
  width: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
}

.wrapper1 {
  width: 97px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: right;
}

.wrapper3 {
  width: 166px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: right;
}

.wrapper4 {
  width: 68px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: center;
}

.frameParent4 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 0px;
  text-align: left;
  color: #6b7280;
}

.wrapper5 {
  width: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: left;
  color: var(--up-color);
}

.icon {
  width: 16px;
  position: relative;
  height: 16px;
  object-fit: cover;
}

.parent {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
}

.frameWrapper {
  width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: center;
}

.fbf86731Wrapper {
  width: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: left;
}

.wrapper6 {
  width: 97px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
}

.wrapper8 {
  width: 166px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  box-sizing: border-box;
}

.frameParent5 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px 0px;
}

.wrapper10 {
  width: 72px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 4px 12px;
  box-sizing: border-box;
  text-align: left;
  color: var(--down-color);
}

.frameParent3 {
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  text-align: right;
}

.frameChild {
  width: 4px;
  position: absolute;
  margin: 0 !important;
  top: 119px;
  left: 773px;
  border-radius: 52px;
  background-color: #f3f4f6;
  height: 155px;
  z-index: 3;
}

.frameItem {
  width: 4px;

  position: absolute;
  margin: 0 !important;
  top: 139px;
  left: 773px;
  border-radius: 52px;
  background-color: #d1d5db;
  height: 33px;
  z-index: 4;
}

.frameGroup {
  position: relative;
  left: 33%;
  bottom: 25px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  width: 33%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.frameParent1 {
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;

  gap: 8px;
}

.frameDiv {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  font-size: 12px;
  color: #111928;
}

.frameParent {
  width: 100%;
  padding: 5%;
  position: relative;
  height: 100%;
  bottom: 0%;
  left: 0%;
  overflow: hidden;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}
</style>
