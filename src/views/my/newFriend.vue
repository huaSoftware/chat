<template>
<div class="newFriend_content">
    <vTitle name="新的朋友"></vTitle>
    <article class="yd-list yd-list-theme4">
        <a href="javascript:;" class="yd-list-item" v-for="(item, index) in newFriendList">
            <div class="yd-list-img"><img :src="item.head_img"></div>
            <div class="yd-list-mes">
                <div class="yd-list-title">
                    <span class="title-left">{{item.nick_name}}</span>
                    <span class="title-right">{{formatDate(item.updated_at)}}</span>
                </div>
                <div class="yd-list-other">
                    <div><span class="demo-list-price"></span></div>
                    <div> 
                        <yd-button v-if="item.status==0" size="small" type="primary" shape="circle" @click.native="newFriendAdd(item)">接受</yd-button>
                        <span v-else-if="item.status==1">已通过</span>
                        <span v-else-if="item.status==2">拒绝</span>
                    </div>
                </div>
            </div>
        </a>
    </article>
</div>
</template>

<script type="text/babel">
import vTitle from '@/components/v-title/v-title'
import {getAddressBookBeg, updateAddressBookBeg} from "@/utils/indexedDB"
import utils from '@/utils/utils'
import storage from "@/utils/localstorage"
import {addressBookAdd} from "@/api/addressBook"
export default {
    data() {
        return {
            newFriendList:[]
        }
    },
    components: {vTitle},
    created(){
        this.init()
    },
    methods: {
        init(){
            getAddressBookBeg().then(res=>{
                console.log(res)
                this.newFriendList = res
            })
        },
        newFriendAdd(item){
            let reqData = {
                focused_user_id:item.user_id, 
                be_focused_user_id: storage.get('user')['id']
            }
            addressBookAdd(reqData).then(res=>{
                this.$dialog.toast({mes: res.msg});
                updateAddressBookBeg(item.id, 1).then(res=>{
                    console.log(res)
                    this.newFriendList = res
                })
            })
        },
        formatDate(value){
            return utils.time.formatDate(value, 'MM-dd hh:mm')
        }
    },
    watch: {
        
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
.title-right{
	font-weight: normal;
	float:right;
	font-size:12px;
	width:30%;
	overflow: hidden;
	text-align: right;
}
.title-left{
	width:60%;
	overflow: hidden;
}
</style>