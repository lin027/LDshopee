<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <h2>添加尺寸信息</h2>
      <div style="display: flex;align-items: center;padding-right: 20px">
        <el-select class="normal-input" v-model="selectedType">
          <el-option value="pants" label="裤子">裤子</el-option>
        </el-select>
      </div>
    </div>
    <div>货号： <el-input v-model="productCode" placeholder="请输入货号" class="normal-input"></el-input></div>
    <div class="btn-group">
      <el-button type="info" @click="addNewRow">添加行</el-button>
      <el-button type="success" @click="saveSizes">保存</el-button>
      <el-button type="danger" @click="clearSizes">清除尺码</el-button>
      <el-button type="primary" @click="downloadImages">下载图片</el-button>
    </div>
    <table class="input_table" width="100%" border="1" cellpadding="10" cellspacing="0">
      <thead>
        <tr>
          <th v-for="item in columnsMap[selectedType]">{{ item.key === 'weight' ? item.label + '斤' : item.label }}</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(size, index) in sizes" :key="index">
          <td v-for="column in columnsMap[selectedType]">
            <input type="text" v-model="size[column.key]" required />
          </td>
          <td>
            <el-button type="danger" @click="deleteRow(index)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="savedSizes.length > 0" class="size-details" style="margin-top: 20px;">
      <div>📏尺码信息：（cm）</div>
      <div v-for="(size, index) in savedSizes" :key="index">
        <span v-for="column in visibleColumns" :key="column.key">
          {{ column.label }}：{{ column.key === 'weight' ? convertWeightToKg(size[column.key]) + 'kg' : size[column.key]
          }}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
    <hr style="margin-top: 20px;"></hr>
    <div v-if="savedSizes.length > 0" class="size-details" style="margin-top: 20px;background-color: #eee;">
      <div>📏Size Information：（cm）</div>
      <div v-for="(size, index) in savedSizes" :key="index">
        <span v-for="column in visibleColumns" :key="column.key">
          {{ translations['en'][column.key] }}：{{ column.key === 'weight' ? convertWeightToKg(size[column.key]) + 'kg' : size[column.key]
          }}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>

    <div class="des-container des_container_en" ref="desContainerEn" v-if="savedSizes.length > 0">
      <h1 class="title">{{ translations['en'].title }}</h1>
      <div class="select-row select-height">{{ translations['en'].heightTitle }}</div>
      <div class="type-row">
        <div class="type-square" v-for="item in translations['en'].heightTextArray">
          <div class="name-span">{{ item.nameText }}</div>
          <div>{{  item.heightText }}</div>
          <div>{{ item.typeText }}</div>
        </div>
      </div>
      <div class="select-row select-size">{{translations['en'].sizeTitle}}</div>
      <div class="table-bg">
        <div class="unit-row">
            <span class="unit-right">{{ translations['en'].unitRight }}</span>
          </div>
        <table v-if="savedSizes.length > 0" border="0" cellspacing="0">
          <thead>
            <tr>
              <th  v-for="column in visibleColumns" :key="column.key">
                {{translations['en'][column.key]}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(size, index) in savedSizes" :key="index">
              <td  v-for="column in visibleColumns" :key="column.key">
                {{ size[column.key] }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="wc-des">{{ translations['en'].wcDes }}</div>
      </div>
      <div class="select-row select-weight">Suitable for {{minWeightKg}}-{{maxWeightKg}}kg</div>
      <div class="weight-row">
        <div class="weight-square" v-for="item in savedSizes">
          <div class="size-span">{{ item.size }}</div>
          <div class="weight-label">{{translations['en'].weightLabel}}</div>
          <div>{{ convertWeightToKg(item.weight) }}kg</div>
        </div>
      </div>
    </div>

    <div class="des-container" ref="desContainerZhTw" v-if="savedSizes.length > 0">
      <h1 class="title">{{ translations['zh_tw'].title }}</h1>
      <div class="select-row select-height">{{ translations['zh_tw'].heightTitle }}</div>
      <div class="type-row">
        <div class="type-square" v-for="item in translations['zh_tw'].heightTextArray">
          <div class="name-span">{{ item.nameText }}</div>
          <div>{{  item.heightText }}</div>
          <div>{{ item.typeText }}</div>
        </div>
      </div>
       <div class="select-row select-size">{{translations['zh_tw'].sizeTitle}}</div>
      <div class="table-bg">
        <div class="unit-row">
          <span class="unit-right">{{ translations['zh_tw'].unitRight }}</span>
        </div>
        <!-- 繁体中文描述部分 -->
        <table v-if="savedSizes.length > 0" border="0" cellspacing="0">
          <thead>
            <tr>
              <th  v-for="column in visibleColumns" :key="column.key">
                {{ translations['zh_tw'][column.key] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(size, index) in savedSizes" :key="index">
              <td  v-for="column in visibleColumns" :key="column.key">
                {{ size[column.key] }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="wc-des">{{ translations['zh_tw'].wcDes }}</div>
      </div>
      <div class="select-row select-weight">適合{{minWeightKg}}-{{maxWeightKg}}公斤</div>
      <div class="weight-row">
        <div class="weight-square" v-for="item in savedSizes">
          <div class="size-span">{{ item.size }}</div>
          <div class="weight-label">{{translations['zh_tw'].weightLabel}}</div>
         <div>{{ convertWeightToKg(item.weight) }}公斤</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import translations from '@/assets/panti18n.json';
export default {
  data() {
    return {
      selectedType: 'pants', 
      sizes: [],
      savedSizes: [],
      translations: translations,
      language: 'zh_tw', // 默认语言
      productCode: '', // 货号
      columnsMap: {
        pants: [
          { key: 'size', label: '尺码' },
          { key: 'inseamPetite', label: '小个子裤长' },
          { key: 'inseamRegular', label: '常规款裤长' },
          { key: 'inseamLong', label: '加长款裤长' },
          { key: 'waist', label: '腰围' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' }
        ],
      },
    };
  },
  computed: {
    visibleColumns() {
      return this.columnsMap.pants.filter(column => {
        return [column.key] != "weight";
      });
    },
    // 获取最小体重（斤）并转为 kg
    minWeightKg() {
      if (!this.savedSizes.length) return null;

      let min = Infinity;
      for (const size of this.savedSizes) {
        if (!size.weight) continue;
        const [minVal] = size.weight.split('-').map(Number);
        if (minVal < min) min = minVal;
      }

      return min === Infinity ? null : (min * 0.5);
    },

    // 获取最大体重（斤）并转为 kg
    maxWeightKg() {
      if (!this.savedSizes.length) return null;

      let max = -Infinity;
      for (const size of this.savedSizes) {
        if (!size.weight) continue;
        const [, maxVal] = size.weight.split('-').map(Number);
        if (maxVal > max) max = maxVal;
      }

      return max === -Infinity ? null : (max * 0.5);
    }
  },
  methods: {
    addNewRow() {
     const newSize = {
        size: '',
        inseamPetite: '',
        inseamRegular: '',
        inseamLong:'',
        waist: '',
        hip: '',
        weight: ''
      };
      this.sizes.push(newSize);
    },
    saveSizes() {
      this.savedSizes = this.sizes.map(size => ({
      size: size.size,
      inseamPetite: size.inseamPetite,
      inseamRegular: size.inseamRegular,
      inseamLong: size.inseamLong,
      waist: size.waist,
      hip: size.hip,
      weight: size.weight
      }));
    },
    clearSizes() {
      this.sizes = [];
    },
    downloadImages() {
      const elementEn = this.$refs.desContainerEn;
      const elementZhTw = this.$refs.desContainerZhTw;

      if (!elementEn || !elementZhTw) {
        alert('没有可下载的内容');
        return;
      }

      // 生成英文图片
      this.language = 'en';
      this.$nextTick(() => {
        this.generateImage(elementEn, `${this.productCode}_en.png`);
      });

      // 生成繁体中文图片
      this.language = 'zh_tw';
      this.$nextTick(() => {
        this.generateImage(elementZhTw, `${this.productCode}_zh_tw.png`);
      });
    },
    generateImage(element, filename) {
      // 渲染为图片
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename;
        link.click();
      });
    },
    convertWeightToKg(weight) {
      const [minWeight, maxWeight] = weight.split('-').map(Number);
      const minKg = minWeight * 0.5;
      const maxKg = maxWeight * 0.5;
      return `${minKg}-${maxKg}`;
    },
    deleteRow(index) {
      this.sizes.splice(index, 1);
      this.saveSizes();
    },
  },
}
</script>

<style>
.normal-input{
  width:240px;
}
.btn-group {
  margin-top: 10px;
  padding-bottom:10px;
  button+button {
    margin-left: 10px;
  }
}

.input_table {
  th,
  td {
    width: 50px;
  }

  input {
    width: 100%;
  }
}
.des-container {
  width: 800px;
  height: 800px;
  display: inline-block;
  padding: 10px;
  .title {
  text-align: center;
  font-size: 40px;
  height: 50px;
  line-height: 50px;
  margin-bottom: 20px;
}
  table{
    width: 100%;
  }
  th,td{
    height: 36px;
    line-height:36px ;
    text-align: center;
    font-size: 18px;
   
 }
  th{background-color:#E0E0E0;}
}
.select-size,.select-weight{
  margin-top: 20px;
}
.select-row{
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  text-align: center;
   color:#fff;
   background-color: #424147;
}
.table-bg{
  margin-top:5px;
 .unit-row {
    overflow: hidden;
  }
  .unit-right {
    font-size: 16px;
    float: right;
  }
}
.type-row{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.type-square{
  text-align: center;
  display: inline-block;
  border: 1px solid #E0E0E0;
  width: 180px;
  font-size: 20px;
  justify-content: center;
  .name-span{
    font-size: 24px;
    font-weight: bold;
  }
}
.type-square+.type-square{
   margin-left: 30px;
}
.weight-row{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.weight-square{
  text-align: center;
  display: inline-block;
  background-color:#E0E0E0;
  border:1px solid #424147;
  width: 120px;
  height: 120px;
  font-size: 18px;
  .size-span{
    font-size: 30px;
  }
}
.des_container_en{
  .size-span{
    font-size: 30px;
    line-height: 36px;
  }
  .weight-square{
    font-size: 16px;
    line-height: 24px;
  }
   
}
.weight-square+.weight-square{
  margin-left: 40px;
}




</style>