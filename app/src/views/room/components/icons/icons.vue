<!--
 * @Author: hua
 * @Date: 2019-07-18 08:54:06
 * @description: 表情页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:17:37
 -->

<template>
    <!-- 表情 -->
    <div class="icons_wrapper">
      <!--轮播-->
      <div class="swiper-container swiper-cont">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <vImg 
              @click.native="emitInsertIcon('static/icons/more/'+i+'.gif')"
              v-for="i in 32"
              :imgUrl="'static/icons/more/'+i+'.gif'"
              :key="i"
            />
          </div>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
</template>
<script>
import vImg from '@/components/v-img/v-img'
export default {
    components: {
        vImg
    },
    data(){
        return{

        }
    },
    created(){

    },
    methods:{
        emitInsertIcon(value){
            this.$emit("recInsertIcon", value)
        }
    }
}
</script>
<style lang="scss">
.icons_wrapper {
    height: 200px !important;
    width: 100%;
    max-width: 750px;
    min-width: 300px;
    border-top: 1px solid #e9e9e9;
    text-align: left;
    overflow-x: auto;
    background: #fff;
    flex-wrap: wrap;
    position:fixed;
    bottom:0rem;
}

.icons_wrapper img {
    margin: 2.25%;
    width: 8%;
}

.swiper-pagination {
    height: 21px;
    position: fixed;
}

</style>
