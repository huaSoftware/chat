<!--
 * @Author: hua
 * @Date: 2019-06-10 16:27:01
 * @description: 
 * @LastEditors  : hua
 * @LastEditTime : 2020-01-02 20:56:15
 -->
<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" />
 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" :panelGroupData="panelGroupData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartDataList"  :name="name"/>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import {index} from '@/api/user'

let lineChartData = {
  weekUsersData: [120, 82, 91, 154, 162, 140, 145],
  weekRoomData: [180, 160, 151, 106, 145, 150, 130],
  weekAdminData: [120, 90, 100, 138, 142, 130, 130]
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      panelGroupData:{
        adminCount:0,
        roomCount:0,
        usersCount:0
      },
      lineChartDataList: lineChartData.weekUsersData,
      name:"用户注册数量"
    }
  },
  created(){
    index().then(res=>{
        let data = res.data
        this.panelGroupData = data.panelGroupData
        this.lineChartDataList = data.weekUsersData
        lineChartData.weekUsersData = data.weekUsersData
        lineChartData.weekRoomData = data.weekRoomData
        lineChartData.weekAdminData = data.weekAdminData
    })
  },
  methods: {
    handleSetLineChartData(type) {
      if(type == "weekUsersData")this.name = "用户注册数量"
      if(type == "weekRoomData")this.name = "房间注册数量"
      if(type == "weekAdminData")this.name = "管理注册数量"
      this.lineChartDataList = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
