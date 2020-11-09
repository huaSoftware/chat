<!--
 * @Author: hua
 * @Date: 2020-09-30 20:46:21
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-09 21:32:26
-->
<template>
  <div class="container">
    <el-input v-model="searchForm.nameKeywords" @keyup.enter.native="findList()" placeholder="搜索好友"></el-input>
    <!-- table -->
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%;margin-top:20px;height:200px;overflow:auto;"
      border
    >
      <el-table-column prop="email" label="email" :align="'center'" />
      <el-table-column prop="nick_name" label="昵称" :align="'center'" />
      <el-table-column label="操作" :align="'center'">
        <template slot-scope="scope">
          <el-button type="text" @click="handleAddAddressBook(scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parseTime } from "@/utils/index";
import { MessageBox, Message } from "element-ui";
import {addressBookBeg} from '@/socketioApi/addressBook';
import {search} from '@/socketioApi/search';
import vImg from '@/components/v-img';

export default {
  name: "Menu",
  data() {
    return {
      loading: false,
      title: "新增",
      tableData:[],
      searchForm: {
        nameKeywords:"",
      },
    };
  },
  computed: {
  },
  components: {
  },
  created() {
  },
  methods: {
    findList() {
        this.loading = true;
        search({keywords: this.searchForm.nameKeywords}).then(res=>{
            this.tableData = res.data.userList;
            this.loading = false;
        })
    },
    handleAddAddressBook(item){
        //发送好友申请
        addressBookBeg({be_focused_user_id: item.id}).then(res=>{
            setTimeout(()=>{
                Message({
                    message:res.msg,
                    type: "success",
                    duration: 5 * 1000,
                });
            },1000)
        })
    },
    handleParseTime(time) {
      return parseTime(time);
    },
  },
};
</script>

<style lang="scss" scoped>
.container{
  padding: 0px;
}

</style>
