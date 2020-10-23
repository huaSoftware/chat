<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 消息提醒页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:44:27
 -->
<template>
    <yd-cell-item style="background: #fff;">
        <span slot="left" style="font-weight: bold">新消息提醒</span>
        <span slot="right">
            <yd-switch v-model="alert">
            </yd-switch>
        </span>
    </yd-cell-item>
</template>
<script>
    import storage from "@/utils/localstorage"
    export default {
    components: {},
    data() {
        return {
            alert:true
        }
    },
    watch:{
        alert:{
            handler(){
                storage.set('alert', this.alert)
            }
        }
    },
    methods: {
        init(){
            if(window.localStorage.getItem('alert') == undefined){
                this.alert = true
            }else{
                this.alert = storage.get('alert')
            }
        }
    },
    created() {
        this.init()
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
    @import '@/assets/scss/base.scss';
    @import '@/assets/scss/public.scss';

</style>