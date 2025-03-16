<template>
  <div>
    {{selectedCategory}}
    <el-select v-model="selectedCategory" placeholder="请选择类别">
      <el-option label="包延长绳子" value="BagStrap"></el-option>
      <el-option label="包巾" value="BagScraf"></el-option>
      <el-option label="内裤" value="panties"></el-option>
      <el-option label="羽絨服" value="coat"></el-option>
    </el-select>
  </div> 
  <div class="table-container">
    <div class="table-left">
      <el-button type="primary" @click="exportToExcel(tableData, 'all.xlsx')"
        >全文导出到Excel</el-button
      >
      <el-input
        v-model="searchkey"
        placeholder="请输入关键词"
        :suffix-icon="Search"
        clearable
        style="width: 240px; margin-left: 10px; margin-right: 10px"
        @input="fetchSearchkey(searchkey)"
      />
      <span>均价：{{ averagePrice }}</span>
      <el-table
        :data="tableData"
        @sort-change="handleSortChange"
        style="width: 100%; height: 800px"
      >
        <el-table-column prop="itemid" label="id" width="120" />
        <el-table-column prop="shopid" label="shopid" width="120" />
        <el-table-column prop="image" label="图片" width="100">
          <template #default="scope">
            <img
              :src="scope.row.image"
              alt="图片"
              style="width: 100px; height: auto"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="标题" width="700">
          <template #default="scope">
            <span v-html="highlightText(scope.row.name, searchkey)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="showPrice"
          label="价格"
          width="120"
          sortable
        ></el-table-column>
        <el-table-column prop="sold" sortable label="销量" width="120">
          <template #default="scope">
            <span>{{ scope.row.sold }} / {{ scope.row.historical_sold }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-right">
      <div class="btn-group">
        <el-button
          type="success"
          @click="exportToExcel(totalNumData, 'total.xlsx')"
        >
          导出统计次数
        </el-button>
        <el-input
          v-model="searchTotalNumKey"
          placeholder="请输入关键词"
          :suffix-icon="Search"
          clearable
          style="width: 240px; margin-left: 10px"
          @input="searchTotalNumkey"
        />
      </div>
      <el-table :data="totalNumData" style="width: 100%; height: 800px">
        <el-table-column prop="word" label="词" width="200">
          <template #default="scope">
            <span
              v-html="highlightText(scope.row.word, searchTotalNumKey)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="出现次数" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script>
// https://sg.xiapibuy.com/api/v4/shop/rcmd_items
import * as XLSX from 'xlsx'
import _ from 'lodash'
export default {
  data() {
    return {
      selectedCategory: 'BagStrap', // 默认选择内裤
      //表格数据
      searchkey: '',
      allTableData: [],
      tableData: [],

      searchTotalNumKey: '',
      allTotalNumData: [],
      totalNumData: [],
      averagePrice: 0,
    }
  },
  watch: {
    selectedCategory: {
      handler(newVal) {
        this.mergeData()
      },
      immediate: true,
    },
  },
  mounted() {
    this.mergeData()
  },
  methods: {
    //通用请求文件
    async fetchJsonFile(filePath) {
      try {
        const response = await fetch(filePath)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return await response.json()
      } catch (error) {
        console.error('Error fetching JSON file:', error)
        throw error
      }
    },
    //合并json文件
    async mergeData() {
      let jsonFilePaths=''
      try {
        if (this.selectedCategory=="panties") {
           jsonFilePaths = ['panties/1.JSON','panties/2.JSON','panties/3.JSON','panties/4.JSON']
        }else if(this.selectedCategory=="BagScraf"){
           jsonFilePaths = ['BagScraf/1.JSON','BagScraf/2.JSON','BagScraf/F1.JSON']
        }
         else if(this.selectedCategory=="BagStrap"){
            jsonFilePaths = ['bagStrapLongchamp/1.JSON','bagStrapLongchamp/3.JSON']
         }
         else if(this.selectedCategory=="coat"){
            jsonFilePaths = ['coat/1.JSON','coat/3.JSON']
         }
         
       
        // 读取并解析每个 JSON 文件的内容
        const jsonDataArray = await Promise.all(
          jsonFilePaths.map(filePath => this.fetchJsonFile(filePath))
        )
        // 使用 Set 来存储已有的 itemid
        const seenItemIds = new Set()
        // 合并所有 JSON 文件的数据
        const mergedData = jsonDataArray.reduce((acc, res) => {
          console.log(res)
          let data = res.data?res.data:res;
        
          if (Array.isArray(data.items)) {
            data.items.forEach(item => {
              if (!seenItemIds.has(item.itemid)) {
                seenItemIds.add(item.itemid)
                const itemToPush = item.item_basic ? item.item_basic : item;
                console.log(itemToPush)
                acc.push(itemToPush);
              }
            })
          }
          return acc
        }, [])
        const worksheetData = mergedData.map(item => ({
          itemid: item.itemid,
          shopid: item.shopid,
          name: item.name,
          sold: item.sold,
          historical_sold: item.historical_sold,
          image: 'https://img.ws.mms.shopee.cn/file/' + item.image + '_tn.webp',
          showPrice: item.price / 100000,
        }))
        const sum = worksheetData.reduce((acc, item) => {
          return acc + item.showPrice
        }, 0)

        this.averagePrice = sum / worksheetData.length
        this.allTableData = worksheetData
        this.tableData = this.allTableData

        this.allTotalNumData = this.getWordCountArraySorted()
        this.totalNumData = this.allTotalNumData
      } catch (error) {
        console.error('Error merging JSON files:', error)
      }
    },
    //搜索功能
    fetchSearchkey(searchkey) {
      this.tableData = this.allTableData.filter(item => {
        return item.name.toLowerCase().includes(searchkey.toLowerCase())
      })
    },
    handleSortChange({ column, prop, order }) {
      if (!order) {
        // 如果没有排序，则恢复原始顺序
        this.tableData.sort((a, b) => 0)
        return
      }

      const isAscending = order === 'ascending'

      this.tableData.sort((a, b) => {
        if (isAscending) {
          return a[prop] - b[prop]
        } else {
          return b[prop] - a[prop]
        }
      })
    },

    //搜索功能
    searchTotalNumkey(searchkey) {
      this.totalNumData = this.allTotalNumData.filter(item => {
        return item.word.toLowerCase().includes(searchkey.toLowerCase())
      })
    },
    // 统计 allTableData 中的词频并将结果存储到数组中，并按 count 从大到小排序
    getWordCountArraySorted() {
      if (!this.allTableData || this.allTableData.length === 0) {
        console.warn('No data to process')
        return []
      }

      const wordCount = {}

      this.allTableData.forEach(item => {
        if (item.name) {
          const words = item.name.split(/\s+/).filter(word => word.length > 0)
          words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1
          })
        }
      })

      const wordCountArray = Object.entries(wordCount).map(([word, count]) => ({
        word,
        count,
      }))

      // 按 count 从大到小排序
      wordCountArray.sort((a, b) => b.count - a.count)

      return wordCountArray
    },

    //导出到excel
    async exportToExcel(worksheetData, exportXlsName) {
      try {
        const worksheet = XLSX.utils.json_to_sheet(worksheetData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Items')
        XLSX.writeFile(workbook, exportXlsName)
      } catch (error) {
        console.error('Error merging JSON files:', error)
      }
    },

    // 高亮显示匹配的文本
    highlightText(text, keyword) {
      if (!keyword) return text
      const regex = new RegExp(`(${keyword})`, 'gi')
      return text.replace(regex, '<span style="color: red;">$1</span>')
    },
  },
}
</script>

<style scoped>
/* 添加你的样式 */
.table-container {
  display: flex;
  margin-top:10px;
}
.table-left {
  flex: 1;
}
.table-right {
  margin-left: 50px;
}
.btn-group {
  display: flex;
}
</style>