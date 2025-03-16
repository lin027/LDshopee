<template>
  <el-container>
    <el-header
      ><el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <router-link to="/size">尺寸</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/home">描述改造</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link to="/personalShop">店铺</router-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
</style>
<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
