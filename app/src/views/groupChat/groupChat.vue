<!--
 * @Author: hua
 * @Date: 2019-02-01 17:12:59
 * @LastEditors: hua
 * @LastEditTime: 2019-06-03 14:31:51
 -->
<style>
.yd-checkbox-icon{
    vertical-align: middle!important;
    
}
.yd-checkbox-text{
    float:left;
    margin-right:0.2rem;
}
</style>
<template>
    <div class="content">
        <!-- 头部开始 -->
		<header  class="yd-navbar" style="background-color: rgb(255, 255, 255); height: 1rem; color: rgb(228, 228, 228);">
			<div class="yd-navbar-item"></div> 
			<div class="yd-navbar-center-box" style="height: 1rem;">
				<div class="yd-navbar-center">
					<span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;">发起群聊</span>
				</div>
			</div> 
            <div class="yd-navbar-item">
				 <yd-button @click.native="handleSubmit" size="small" type="primary" shape="angle">发起</yd-button>
			</div>
		</header>
		<!-- 头部结束 -->
        <!-- 搜索框开始 -->
        <div class="yd-search">
            <div class="yd-search-input">
                <form action="#" class="search-input">
                    <i class="search-icon"></i> 
                    <div class="yd-input">
                        <vEditDiv class='input' placeholder='搜 索' v-model="keywords"></vEditDiv>
                        <a href="javascript:;" tabindex="-1" class="yd-input-clear" style="display: none;"></a> 
                        <span class="yd-input-error" style="display: none;"></span> 
                        <span class="yd-input-warn" style="display: none;"></span> 
                        <span class="yd-input-success" style="display: none;"></span>
                    </div>
                </form> 
                <a href="javascript:;" class="cancel-text" style="display: none;">取消</a>
            </div>
        </div>
        <!-- 搜索框结束 -->
        <div class="address-book-list">  
            <dl v-for = "num in 26" :key="num">
                <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt>
                 <yd-checkbox-group v-model="checkedUsers"  color="#45BAF4">
                    <dd v-for="(item, index) in adderssBookList" :key="index" v-if="String.fromCharCode(64+num) == item.users.first_word"> <!-- 循环 -->
                        <a>
                            <img :src="item.users.head_img">
                            <yd-checkbox  :val="JSON.stringify(item.users)">{{item.users.nick_name}}</yd-checkbox>
                        </a>
                    </dd>
                 </yd-checkbox-group>
            </dl >
            <dl>
                <dt ref="#">#</dt>
                <yd-checkbox-group v-model="checkedUsers"  color="#45BAF4">
                    <dd  v-for="(item, index) in adderssBookList" :key="index" v-if="item.users.first_word == '#'"> <!-- 循环 -->
                        <a>
                            <img :src="item.users.head_img">
                            <yd-checkbox  :val="JSON.stringify(item.users)">{{item.users.nick_name}}</yd-checkbox>
                        </a>
                    </dd>
                </yd-checkbox-group>
            </dl >
        
        </div>
        <!-- 导航 -->
        <div id="pop-address-book-letter" class="clearfix">
            <ul>
                <li v-for="num in 26" :key="num" @click="handleScrollToRef(String.fromCharCode(num+64))">
                    <a  class="activeName">{{String.fromCharCode(num+64)}}</a>
                </li>
                <li >
                    <a  class="activeName">#</a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import storage from "@/utils/localstorage"
import {addressBookGet} from '@/api/addressBook'
import {groupChatCreate} from '@/api/groupChat'
import vEditDiv from '@/components/v-edit-div/v-edit-div'
import {send} from '@/utils/socketio'
export default {
    components: {vEditDiv},
    data() {
        return {
            keywords: '',
            checkedUsers:[],
            reqData:{
                page_no: 1,
                per_page: 10000000
            },
            adderssBookList: [],
            defShow: false,
            defs: [
                {
                    label: '发起群聊',
                    callback: () => {
                        this.$dialog.toast({mes: '咔擦，此人太帅！'});
                    }
                },
                {
                    label: '添加朋友',
                    callback: () => {
                        this.$router.push({name:'search'})
                    }
                }
            ]
        }
    },
    methods: {
        init(){
            addressBookGet(this.reqData).then(res=>{
                this.adderssBookList = res.data.addressBookList
            })
        },
        handlePopAddressNookLetterResize(){
            let screenWidth = document.body.clientWidth
            document.getElementById('pop-address-book-letter').style.right = ((screenWidth-750)/2)+'px'
        },
        handleScrollToRef(value){
            document.getElementById('scrollView').scrollTop = this.$refs[value][0].offsetTop
        },
        handleScroll () {
        },
        handleJoinRoom(item){
            send('join',{
                name: item.users.nick_name,
                room_uuid:item.room_uuid,
                type:item.room.type
               
            })
        },
        handleSubmit(){
            let user = storage.get('user')
            let ids = []
            ids.push(user.id)
            this.checkedUsers.forEach((key, index)=>{
                console.log(JSON.parse(key))
                ids.push(JSON.parse(key)['id'])
            })
            groupChatCreate({ids:ids}).then(res=>{      
                const room_uuid = res.data.room_uuid
                send('join',{
                    type: 1,
                    room_uuid:room_uuid,
                })
            })
        }
    },
    created() {
        this.init()
    },
    mounted() {
        this.handlePopAddressNookLetterResize()
        document.getElementById('scrollView').addEventListener('scroll', this.handleScroll)
        window.onresize = () => {
            this.handlePopAddressNookLetterResize()
        }
    },
    watch:{
        'checkedUsers'(){
            this.keywords = ''
            //console.log(this.checkedUsers)
            this.checkedUsers.forEach((key, index)=>{
                this.keywords = this.keywords + '<img height="20" src="'+JSON.parse(key)['head_img']+'"/>'
            })
        },
        keywords(newValue, preValue){
            let rawArr = []
            let imgArr = newValue.match(/<img.+?>/ig)?newValue.match(/<img.+?>/ig):[]
            this.checkedUsers.forEach((key, index)=>{
                imgArr.forEach((imgKey, imgIndex)=>{
                    console.log(imgKey)
                    if(imgKey.indexOf(JSON.parse(key)['head_img']) !== -1){
                        rawArr.push(key)  
                    }
                })
            })
            this.checkedUsers = rawArr
        }
    }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.activeaddress-book {
    color:red!important;
}
dl {
    background-color: #fff;
}

.address-book-list {
    margin-bottom:0px;
}

.address-book-list dt {
    color: #666;
    height: 0.7rem;
    line-height: 0.7rem;
    text-indent: .2rem;
    background-color: #f7f7f7;
    position: relative;
    padding-left:10px;
}

.address-book-list dd{
    margin-top:10px;
    padding-bottom:10px;
    margin-left:10px;
}

.address-book-list dd.hot {
    padding-bottom: .25rem;
}

.address-book-list dd.hot a {
    height:27.5px;
    width: 33.3%;
    float: left;
    border-bottom: none;
    text-align: center;
    height: inherit;
    line-height: inherit;
}

.address-book-list dd a {
    display: block;
    height: 27.5px;
    line-height: 2.75rem;
    position: relative;
    line-height:  27.5px;
}

.address-book-list dd a img {
    float: left;
    /* margin: .25rem .5rem 0 0.25rem; */
    height: 27.5px;
    width:  27.5px;
    margin-right:5%;
}

.address-book-list dd.hot a span {
    display: block;
    padding-bottom: .25rem;
}

.address-book-list dd.hot a img {
    float: none;
    margin: .25rem auto 0;
}

.address-book-list dd.hot a {
    width: 33.3%;
    float: left;
    border-bottom: none;
    text-align: center;
    height: inherit;
    line-height: inherit;
}

/* 导航 */
#pop-address-book-letter {
    font-size: .6rem;
    position: fixed;
    right: 0;
    top:43%;
    width: 1rem;
    padding-top: 2.2rem;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    z-index: 10;
}

#pop-address-book-letter li a {
    display: block;
    /* height:0.9rem;
    line-height: 1.1rem; */
    text-align: center;
    color: #576b95;
    font-size:0.3rem;
}
.yd-navbar {
	height:1.4rem !important;
	padding-top:0.4rem !important;
}
.navbar_icon{
	color: rgb(92, 92, 92);
    font-size: 0.45rem;
	margin-left:0.3rem;
}
.yd-checkbox{
    float:right;
}
.input{
    height:100%;
    line-height:100%;
    padding:8px;
}
</style>