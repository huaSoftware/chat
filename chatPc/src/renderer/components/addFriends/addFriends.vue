<!--
 * @Author: hua
 * @Date: 2020-09-30 20:46:21
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-10 21:28:02
-->
<template>
  <div class="container">
     <el-button @click="handleSubmit" size="mini" round icon="el-icon-circle-plus-outline">添加</el-button>
    <!-- table -->
    <el-table
      :data="adderssBookList"
      style="width: 100%;margin-top:10px;height:200px;overflow:auto;"
      border
      @selection-change="handleSelectionChange"
    >
        <el-table-column
        type="selection"
        width="55">
        </el-table-column>
      <el-table-column prop="users" label="昵称" :align="'center'" >
        <template slot-scope="scope">
            <div>{{scope.row.users.nick_name }}</div>
        </template>
      </el-table-column>
       <el-table-column prop="users" label="头像" :align="'center'" >
        <template slot-scope="scope">
             <vImg :img-url="scope.row.users.head_img" style="height:50px;width:50px"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { Message } from "element-ui";
import storage from "@/utils/localstorage"
import {addressBookGet} from '@/socketioApi/addressBook'
import {groupChatCreate,addGroupByUserId } from '@/socketioApi/userRoomRelation'
import vEditDiv from '@/components/v-edit-div/v-edit-div'
import {joinChatSend} from '@/socketIoApi/chat'
import vImg from '@/components/v-img'

export default {
  name: "AddFriends",
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
      localGroupRoomUuid:"",
      localRoomName:""
    };
  },
  props: {
    room_uuid: {
      type: String,
      default: ''
    },
    room_name: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
        "LOCAL",
        "GROUP"
    ])
  },
  components: {
      vImg
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    init(){
        if(this.room_uuid !== ''){
            console.log(this.localGroupRoomUuid)
            this.localGroupRoomUuid = this.room_uuid;
            this.localRoomName = this.room_name;
        }
        addressBookGet(this.reqData).then(res=>{
            console.log(res.data.addressBookList)
            this.adderssBookList = res.data.addressBookList
        })
    },
    handleSelectionChange(val) {
       this.checkedUsers = val;
    },
    handleSubmit(){
        let user = storage.get('user')
        let ids = []
        //ids.push(user.id)
        this.checkedUsers.forEach((key, index)=>{
            console.log(key)
            ids.push(key.users['id'])
        })
        if(this.localGroupRoomUuid){
            //增加用户
            addGroupByUserId({ids:ids,room_uuid:this.localGroupRoomUuid}).then(res=>{
                const name = res.data.name
                joinChatSend({
                    name:  this.localRoomName,
                    type: this.GROUP,
                    room_uuid:this.localGroupRoomUuid,
                    save_action:this.LOCAL
                })
                Message({
                    message:'添加成功',
                    type: "success",
                    duration: 5 * 1000,
                });
                this.$emit('handleCloseAddFriends', '')
            })
        }else{
            groupChatCreate({ids:ids}).then(res=>{      
                const room_uuid = res.data.room_uuid
                const name = res.data.name
                joinChatSend({
                    name: name,
                    type: this.GROUP,
                    room_uuid:room_uuid,
                    save_action:this.LOCAL
                })
                Message({
                    message:'创建成功',
                    type: "success",
                    duration: 5 * 1000,
                })
                this.$emit('handleCloseAddFriends', '')
            })
        }
    }
  },
};
</script>

<style lang="scss" scoped>
.container{
  padding: 0px;
}

</style>
