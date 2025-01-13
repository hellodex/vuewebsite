<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'stakesInterface'
})
</script>

<template>
  <div :class="$style.frameParent">
    <div :class="$style.parent">
      <div :class="$style.text">质押代币获得平台收益分红</div>
      <div :class="$style.frameDiv">
        <div :class="$style.frameParent1">
          <div :class="$style.frameParent2">
            <div :class="$style.textWrapper">
              <div :class="$style.text1">质押</div>
            </div>
            <div :class="$style.textContainer">
              <div :class="$style.text1">赎回</div>
            </div>
          </div>
          <div :class="$style.label">选择语言</div>
        </div>
        <div :class="$style.helParent">
          <div :class="$style.hel">我的 $hel 余额</div>
          <div :class="$style.div2">23652</div>
        </div>
        <div :class="$style.frameParent3">
          <div :class="$style.group">
            <div :class="$style.hel">当前已质押</div>
            <div :class="$style.div2">3652</div>
          </div>
          <div :class="$style.aprParent">
            <div :class="$style.hel">APR</div>
            <div :class="$style.div2">23%</div>
          </div>
        </div>
        <div :class="$style.inputField">
          <div :class="$style.label1">钱包名称</div>
          <div :class="$style.input">
            <div :class="$style.content1">
              <div :class="$style.user" />
              <div :class="$style.div6">请输入质押数量</div>
              <div :class="$style.div7">最大</div>
            </div>
          </div>
          <div :class="$style.caption">我们不会分享你的详细资料。请参阅我们的隐私政策。</div>
        </div>
        <div :class="$style.button1">
          <div :class="$style.text">连接账户</div>
        </div>
        <div :class="$style.frameParent4">
          <div :class="$style.helGroup">
            <div :class="$style.hel1">总计质押 $Hel 数量</div>
            <div :class="$style.hel1">123,264,0</div>
          </div>
          <div :class="$style.helGroup">
            <div :class="$style.hel1">质押数量占总量比例</div>
            <div :class="$style.hel1">68%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.searchIcon {
  width: 18px;
  position: relative;
  height: 18px;
  overflow: hidden;
  flex-shrink: 0;
}

.div {
  align-self: stretch;
  flex: 1;
  position: relative;
  line-height: 125%;
  display: flex;
  align-items: center;
}

.content {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.autocompleteInput {
  width: 498px;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 16px;
}

.interfaceEssentialearthGloIcon {
  width: 24px;
  position: relative;
  height: 24px;
}

.interfaceEssentialearthGloWrapper {
  border-radius: 8px;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.moneyWalletsWrapper {
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.frameContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.moneyWalletsIcon1 {
  width: 20px;
  position: relative;
  height: 20px;
}

.text {
  position: relative;
  line-height: 150%;
}

.button {
  border-radius: 8px;
  background-color: #1f2a37;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  gap: 8px;
}

.frameGroup {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 32px;
  color: #fff;
}

.autocompleteInputParent {
  position: absolute;
  top: 0px;
  left: 0px;
  border-bottom: 1px solid #e5e7eb;
  box-sizing: border-box;
  width: 1248px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}

.text1 {
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
}

.textContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 0px;
  color: #6b7280;
}

.frameParent2 {
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
  text-align: left;
  display: none;
  flex-shrink: 0;
}

.frameParent1 {
  align-self: stretch;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #111928;
}

.hel {
  position: relative;
  line-height: 150%;
}

.div2 {
  position: relative;
  font-size: 18px;
  line-height: 150%;
  color: #111928;
}

.helParent {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
}

.group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 8px;
}

.aprParent {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
}

.frameParent3 {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.label1 {
  width: 364px;
  position: relative;
  font-size: 12px;
  line-height: 150%;
  display: none;
}

.user {
  width: 16px;
  position: relative;
  height: 16px;
  overflow: hidden;
  flex-shrink: 0;
  display: none;
}

.div6 {
  flex: 1;
  position: relative;
  line-height: 125%;
}

.div7 {
  position: relative;
  line-height: 125%;
  text-align: right;
}

.content1 {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.input {
  align-self: stretch;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
}

.caption {
  width: 364px;
  position: relative;
  line-height: 125%;
  display: none;
}

.inputField {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
}

.button1 {
  align-self: stretch;
  border-radius: 8px;
  background-color: #1f2a37;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  gap: 8px;
  color: #fff;
}

.hel1 {
  position: relative;
  line-height: 125%;
}

.helGroup {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.frameParent4 {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.frameDiv {
  width: 455px;
  border-radius: 8px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 24px;
  text-align: left;
  font-size: 14px;
  color: #6b7280;
}

.parent {
  position: relative;
  top: 20%;
  left: 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  font-size: 16px;
  color: #111928;
}

.frameParent {
  width: 100%;
  position: relative;
  top: 5%;
  left: 0%;
  height: 787px;
  overflow: hidden;
  text-align: left;
  font-size: 14px;
  color: #6b7280;
}
</style>
