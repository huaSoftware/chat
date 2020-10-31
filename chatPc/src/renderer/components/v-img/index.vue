<!--
 * @Author: hua
 * @Date: 2019-12-06 16:33:01
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-12-06 16:41:59
 -->
<template>
    <img  v-lazy="imgUrl" :key="imgUrl" />
</template>
<script>
export default {
    name: 'Vimg',
    components: {
    },
    data() {
        return {
            defaultImgUrl: 'this.src="' + require('@/assets/img/default.png') + '"'
        };
    },
    props:{
        imgUrl: {
            type: String,
            default: require('@/assets/img/default.png')
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