<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" />
 -->
    <panel-group @handleSetLineChartData="handleSetLineChartData" :panelGroupData="panelGroupData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import {index} from '@/api/user'

const lineChartData = {
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
      lineChartData: lineChartData.weekUsersData
      
    }
  },
  created(){
    index().then(res=>{
        let data = res.data
        this.panelGroupData = data.panelGroupData
        let weekUsersData = []
        let weekRoomData = []
        let weekAdminData = []
        for(let i=0;i<7;i++){
          if(i<data.weekUsersData.length && typeof data.weekUsersData[i]['d']!=='undefined'){
            weekUsersData.push(data.weekUsersData[i]['n'])
          }else{
            weekUsersData.push(0)
          }
          if(i<data.weekRoomData.length  && typeof data.weekRoomData[i]['d']!=='undefined'){
            weekRoomData.push(data.weekRoomData[i]['n'])
          }else{
            weekRoomData.push(0)
          }
          if(i<data.weekAdminData.length && typeof data.weekAdminData[i]['d']!=='undefined'){
            weekAdminData.push(data.weekAdminData[i]['n'])
          }else{
            weekAdminData.push(0)
          }
        }
        lineChartData.weekUsersData = weekUsersData
        lineChartData.weekRoomData = weekRoomData
        lineChartData.weekAdminData = weekAdminData
    })
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
