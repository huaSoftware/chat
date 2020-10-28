<!--
 * @Author: hua
 * @Date: 2020-04-18 18:43:22
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-28 21:37:47
-->
<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard, },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    
  }
}
</script>
