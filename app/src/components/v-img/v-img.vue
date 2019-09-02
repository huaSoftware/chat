<!--
 * @Author: hua
 * @Date: 2019-07-10 13:10:40
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-07-24 20:07:59
 -->
<template>
    <img  v-lazy="imgUrl" :key="imgUrl" />
</template>
<script>
export default {
    components: {
    },
    data() {
        return {
        };
    },
    props:{
        imgUrl: {
            type: String,
            default: require('@/assets/img/default.jpg')
        }
    },
    created() {
      
    },
    mounted() {
    
    },
    watch: {
    
    },
    methods: {
        init(){
        }
    }
};
</script>
<style lang="scss" scoped>
</style>