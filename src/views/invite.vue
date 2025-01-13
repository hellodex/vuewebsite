<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <WebInvite v-if="windowWidth >= 1144" />
  <H5Invite v-else />
</template>

<script setup lang="ts">
import H5Invite from '@/adapter/H5Invite.vue'
import WebInvite from '@/adapter/WebInvite.vue'
import { useWindowWidth } from '@/hooks/useWindowWidth'

const { windowWidth } = useWindowWidth()
</script>
