<!--
 * @Author: hua
 * @Date: 2019-02-01 17:12:59
 * @LastEditors: hua
 * @LastEditTime: 2019-06-03 14:31:51
 -->

<template>
    <div class="content">
        <!-- 列表 -->
        <div class="address-book-list">
            
            <dl v-for = "num in 26" :key="num">
                <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt>
                <dd @click="handleJoinRoom(item)" v-for="(item, index) in adderssBookList" :key="index" v-if="String.fromCharCode(64+num) == item.users.first_word"> <!-- 循环 -->
                    <a>
                    <img :src="item.users.head_img">{{item.users.nick_name}}
                    </a>
                </dd>
            </dl >
            <dl>
                <dt ref="#">#</dt>
                <dd @click="handleJoinRoom(item)" v-for="(item, index) in adderssBookList" :key="index" v-if="item.users.first_word == '#'"> <!-- 循环 -->
                    <a>
                    <img :src="item.users.head_img">{{item.users.nick_name}}
                    </a>
                </dd>
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
import {addressBookGet} from '@/api/addressBook'
export default {
    components: {},
    data() {
        return {
            reqData:{
                page_no: 1,
                per_page: 10000000
            },
            adderssBookList: []
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
            window.roomSocket.emit('join',{
                name: item.users.nick_name,
                unread_number: 0,
                be_unread_number: 0,
                last_msg: '',
                room_uuid:item.room_uuid,
                be_focused_user_id: item.be_focused_user_id,
                focused_user_id: item.focused_user_id,
                is_alert: 0
            })
            this.$router.push({
                name: 'room',
                query:{
                    room_uuid: item.room_uuid,
                    name: item.users.nick_name
                }
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

</style>