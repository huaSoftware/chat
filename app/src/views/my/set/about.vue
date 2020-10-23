<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 关于页面
 * @LastEditors: hua
 * @LastEditTime: 2020-10-23 20:44:18
 -->
<template>
    <div class="about_our_wapper">
        <div class="about_our_article">
            <!-- 技术栈 -->
            <vTitle name="技术栈:"></vTitle>
            <ul style="width:100%;font-size:0px;background:#fff;">
                <li style="width:33.3%;display: inline-block;"><img style="width:100%" src="static/img/about/python.jpg"/></li>
                <li style="width:33.3%;display: inline-block;"><img style="width:100%" src="static/img/about/php.jpg"/></li>
                <li style="width:33.3%;display: inline-block;"><img style="width:100%" src="static/img/about/js.jpg"/></li>
            </ul>
            <CrossLine></CrossLine>
            <!-- 开源项目 -->
            <vTitle name="开源项目:"></vTitle>
            <ul style="width:100%;font-size:0.32rem;background:#fff;padding: 0px 0.24rem 0.18rem 0.24rem;">
                <li>
                    <span style="border-bottom:1px solid #00C2E6;color:#00C2E6" @click="handleOpen('https://gitee.com/huashiyuting/flask')">MVC分层flask</span>
                </li>
                <li>
                    <span style="border-bottom:1px solid #00C2E6;color:#00C2E6" @click="handleOpen('https://gitee.com/huashiyuting/tool_chicken')">工具鸡.apk</span>
                </li>   
                <li>
                    <span style="border-bottom:1px solid #00C2E6;color:#00C2E6" @click="handleOpen('http://212.64.83.121:89/upload/监听状态栏，需要的联系584425439.apk')">监听状态栏.apk</span>
                </li>   
            </ul>
            <CrossLine></CrossLine>
            <!-- 广告 -->
            <vTitle name="给自己留的广告位置:"></vTitle>
            <ul style="width:100%;font-size:0.32rem;background:#fff;padding: 0px 0.24rem 0.18rem 0.24rem;">
                <li>承接h5+app开发，php,python后端开发项目</li>
            </ul>
            <CrossLine></CrossLine>
            <!-- 联系方式 -->
            <vTitle name="联系方式:"></vTitle>
            <ul style="width:100%;font-size:0.32rem;background:#fff;padding: 0px 0.24rem 0.18rem 0.24rem;">
                <li>邮箱：584425439@qq.com</li>
                <li>QQ：584425439</li>
            </ul>
        </div>
    </div>
</template>
<script>
import vTitle from '@/components/v-title/v-title'
import CrossLine from '@/components/cross-line/cross-line'
export default {
    components: {vTitle, CrossLine},
    data() {
        return {
        }
    },
    methods: {
        handleOpen(name){
            plus.runtime.openURL(name)
        }
    }
}
</script>
<style scoped>
.about_our_wapper{
    /* padding: 0rem 0.3rem; */
    font-family: "Microsoft YaHei";
    font-size: medium;
    padding-top:0.05rem;
    font-size:0.3rem;
}
.about_our_article{
    color: rgb(143, 143, 148);
    padding-top: 0.25rem;
    line-height: 1.7em;
}
</style>
