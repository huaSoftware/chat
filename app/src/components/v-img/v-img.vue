<template>
    <img :src="imgUrl" :onerror="defaultImgUrl"/>
</template>
<script>
export default {
    components: {
    },
    data() {
        return {
            defaultImgUrl: 'this.src="' + require('./img/default.jpg') + '"'
        };
    },
    props:{
        imgUrl: {
            type: String,
            default: './img/default.jpg'
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