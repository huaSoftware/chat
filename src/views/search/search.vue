<template>
<div class="search_content">
    <yd-search :result="result" fullpage v-model="value2" :item-click="itemClickHandler" :on-submit="submitHandler"></yd-search>
    <article class="yd-list yd-list-theme4">
        <a href="javascript:;" class="yd-list-item" v-for="(item, index) in userList" :key="index">
            <div class="yd-list-img"><img :src="item.head_img"></div>
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
    import {search} from '@/api/search'
    import {addressBookAdd} from '@/api/addressBook'
    import storage from "@/utils/localstorage"
    import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
    export default {
        data() {
            return {
                value2: '',
                result: [],
                userList: []
            }
        },
        methods: {
           /*  getResult(val) {
                if (!val) return [];
                return [
                    'Apple', 'Banana', 'Orange', 'Durian', 'Lemon', 'Peach', 'Cherry', 'Berry',
                    'Core', 'Fig', 'Haw', 'Melon', 'Plum', 'Pear', 'Peanut', 'Other'
                ].filter(value => new RegExp(val, 'i').test(value));
            }, */
            itemClickHandler(item) {
                alert(1)
                //this.$dialog.toast({mes: `搜索：${item}`});
            },
            submitHandler(value) {
                search({keywords: value}).then(res=>{
                    this.userList = res.data.userList
                })
                //this.$dialog.toast({mes: `搜索：${value}`});
            },
            handleAddAddressBook(item){
                addressBookAdd({be_focused_user_id: item.id, focused_user_id: storage.get('user')['id']}).then(res=>{
                    Toast({mes: res.msg})
                })
            }
        },
        watch: {
            value2(val) {
                //this.result = this.getResult(val);
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