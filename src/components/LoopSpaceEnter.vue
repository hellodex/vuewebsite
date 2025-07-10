<template>
    <a :href="link" target="_blank" class="link">
        <span class="link">Loopspace</span>
    </a>
</template>

<script setup lang='ts'>
import { APIGetLoopAccessToken } from '@/api/login';
import { useGlobalStore } from '@/stores/global';
import { computed, ref, watch } from 'vue';
import { GetLoopAccessToken } from "@/api/login";

const loopspaceLink = import.meta.env.VITE_LOOPSPACE_LINK
const globalStore = useGlobalStore()
const accessKey = ref("")
const defaultAvatar = "https://firebasestorage.googleapis.com/v0/b/loop-prod/o/hq%2F8bc6c6da-76cc-4263-b7e8-e7bd61e09bfe.png?alt=media&token=e8b6d61e-3d2a-4501-836d-e91647b8e8f9"

const requestAcessTokenByAccountInfo = async () => {
    const accountInfo = globalStore.accountInfo
    if (!accountInfo) {
        accessKey.value = ""
        return
    }
    const uuid = accountInfo.uuid
    const avatar = accountInfo.avatar || defaultAvatar
    const nickname = accountInfo.nickname || ""
    if (uuid) {
        const a = await APIGetLoopAccessToken({});
        console.log("a", a)
        const res = await GetLoopAccessToken(uuid, nickname, avatar)
        accessKey.value = res
    }
}

const link = computed(() => {
    if (accessKey.value) {
        return `${loopspaceLink}?access_token=${accessKey.value}`
    }
    return loopspaceLink
})

watch(() => globalStore.accountInfo, (v, old) => {
    if (!v) {
        return
    }
    if (v.uuid != old?.uuid || !accessKey.value) {
        requestAcessTokenByAccountInfo()
    }
})

</script>

<style scoped lang='scss'></style>