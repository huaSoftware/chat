<!--
 * @Author: hua
 * @Date: 2019-02-13 16:35:24
 * @description: 搜索
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-28 15:48:52
 -->
<template>
<div class="search_content">
    <yd-search :result="result" fullpage v-model="value" :item-click="submitHandler" :on-submit="submitHandler"></yd-search>
    <article class="yd-list yd-list-theme4">
        <a href="javascript:;" class="yd-list-item" v-for="(item, index) in userList" :key="index">
            <div class="yd-list-img"><vImg :src="item.head_img"/></div>
            <div class="yd-list-mes">
                <div class="yd-list-title">
                    <span class="title-left">{{item.email}}</span>
                    <!-- <span class="title-right">下午4:26</span> -->
                </div>
                <div class="yd-list-other">
                    <div><span class="demo-list-price">{{item.nick_name}}</span></div>
                    <div @click="handleAddAddressBook(item)"><span>添加到通讯录</span></div>
                </div>
            </div>
        </a>
    </article>
</div>
</template>

<script type="text/babel">
    import {search} from '@/socketioApi/search'
    import {addressBookBeg} from '@/socketioApi/addressBook'
    import storage from "@/utils/localstorage"
    import vImg from '@/components/v-img/v-img'
    import { Loading, Toast } from 'vue-ydui/dist/lib.rem/dialog'
    export default {
        data() {
            return {
                value: '',
                result: [],
                userList: []
            }
        },
        components: {vImg},
        methods: {
            submitHandler(value) {
                search({keywords: value}).then(res=>{
                    this.userList = res.data.userList
                })
            },
            handleAddAddressBook(item){
                //发送好友申请
                Loading.open('发送中')
                addressBookBeg({be_focused_user_id: item.id}).then(res=>{
                    setTimeout(()=>{
                        Loading.close()
                        Toast({mes:res.msg, timeout: 3000,icon:"success"})
                    },1000)
                })
            }
        },
        watch: {
            value(newVal,oldVal){
                search({keywords: newVal}).then(res=>{
                    //console.log(res.data.userList)
                    let list = res.data.userList
                    list.forEach(element => {
                        this.result.push(element.email)
                    });
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.yd-list-theme4 .yd-list-item .yd-list-img {
    width: 1.2rem;
    padding: 0.6rem 0;
}

.yd-list-theme4 .yd-list-item .yd-list-title {
    line-height: 0.6rem;
}
</style>