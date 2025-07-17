<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <h2>添加尺寸信息</h2>
      <div style="display: flex;align-items: center;padding-right: 20px">
        <el-select class="normal-input" v-model="selectedType">
          <el-option value="shirt" label="上衣">上衣</el-option>
          <el-option value="skirt" label="裙子">裙子</el-option>
          <el-option value="pants" label="裤子">裤子</el-option>
          <el-option value="underwear" label="內裤">內裤</el-option>
        </el-select>
        <span>表格高度：</span>
        <el-input v-model="tableRowHeight" placeholder="请输入表格高度" class="normal-input"></el-input>
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
      <div class="gray-bg">
        <div class="white-bg">
          <div class="unit-row">
            <span class="unit-left">{{ translations['en'].unitLeft }}</span>
            <span class="unit-right">{{ translations['en'].unitRight }}</span>
          </div>
          <table v-if="savedSizes.length > 0" border="0" cellspacing="0">
            <thead>
              <tr>
                <th :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }" v-for="column in visibleColumns" :key="column.key">
                  {{ column.key === 'weight' ? translations['en'][column.key] + '(kg)' : translations['en'][column.key]
                  }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(size, index) in savedSizes" :key="index">
                <td :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }" v-for="column in visibleColumns" :key="column.key">
                  {{ column.key === 'weight' ? convertWeightToKg(size[column.key]) : size[column.key] }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="wc-des">{{ translations['en'].wcDes }}</div>
        </div>
      </div>
    </div>

    <div class="des-container" ref="desContainerZhTw" v-if="savedSizes.length > 0">
      <h1 class="title">{{ translations['zh_tw'].title }}</h1>
      <div class="gray-bg">
        <div class="white-bg">
          <div class="unit-row">
            <span class="unit-left">{{ translations['zh_tw'].unitLeft }}</span>
            <span class="unit-right">{{ translations['zh_tw'].unitRight }}</span>
          </div>
          <!-- 繁体中文描述部分 -->
          <table v-if="savedSizes.length > 0" border="0" cellspacing="0">
            <thead>
              <tr>
                <th :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }" v-for="column in visibleColumns" :key="column.key">
                  {{ column.key === 'weight' ? translations['zh_tw'][column.key] + '(斤)' :
                    translations['zh_tw'][column.key]
                  }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(size, index) in savedSizes" :key="index">
                <td :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }" v-for="column in visibleColumns" :key="column.key">
                  {{ size[column.key] }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="wc-des">{{ translations['zh_tw'].wcDes }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
import translations from '@/assets/i18n.json';
export default {
  data() {
    return {
      selectedType: 'shirt', // 默认选择上衣
      sizes: [],
      savedSizes: [],
      translations: translations,
      language: 'zh_tw', // 默认语言
      productCode: '', // 货号
      tableRowHeight:'50',
      columnsMap: {
        shirt: [
          { key: 'size', label: '尺码' },
          { key: 'length', label: '衣长' },
          { key: 'bust', label: '胸围' },
          { key: 'sleevelength', label: '袖长' },
          { key: 'shoulder', label: '肩宽' },
          { key: 'waist', label: '腰围' },
          { key: 'height', label: '身高' },
          { key: 'weight', label: '体重' }
          
        ],
        skirt: [
          { key: 'size', label: '尺码' },
          { key: 'skirtLength', label: '裙长' },
          { key: 'waist', label: '腰围' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' },
        ],
        underwear: [
          { key: 'size', label: '尺码' },
          { key: 'waist', label: '腰围' },
          { key: 'midLength', label: '中长' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' },
        ],
        pants: [
          { key: 'size', label: '尺码' },
          { key: 'inseam', label: '裤长' },
          { key: 'waist', label: '腰围' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' },
        ],
      },

    };
  },
  computed: {
    visibleColumns() {
      const typeColumns = this.columnsMap[this.selectedType];
      console.log('visibleColumns', typeColumns);
      return typeColumns.filter(column => {
        return this.sizes.some(size => size[column.key] !== null && size[column.key] !== '');
      });
    },
  },
  methods: {
    addNewRow() {
      const newSize = {
        size: '',
        weight: ''
      };
      if (this.selectedType === 'shirt') {
        newSize.length = null;
        newSize.shoulder = null;
        newSize.bust = '';
        newSize.waist = '';
        newSize.sleevelength = null;
        newSize.height = null;
      } else if (this.selectedType === 'skirt') {
        newSize.skirtLength = '';
        newSize.waist = '';
        newSize.hip = '';
      }
      else if (this.selectedType === 'underwear') {
        newSize.waist = '';
        newSize.midLength = '';
        newSize.hip = '';
      }
      else if (this.selectedType === 'pants') {
        newSize.inseam = '';
        newSize.waist = '';
        newSize.hip = '';
      }
      this.sizes.push(newSize);
    },
    saveSizes() {
      this.savedSizes = this.sizes.map(size => {
        const savedSize = { size: size.size, weight: size.weight };
        if (this.selectedType === 'shirt') {
          savedSize.length = size.length;
          savedSize.shoulder = size.shoulder;
          savedSize.bust = size.bust;
          savedSize.waist = size.waist;
          savedSize.sleevelength = size.sleevelength;
          savedSize.height = size.height;
        } else if (this.selectedType === 'skirt') {
          savedSize.skirtLength = size.skirtLength;
          savedSize.waist = size.waist;
          savedSize.hip = size.hip;
        } else if (this.selectedType === 'underwear') {
          savedSize.waist = size.waist;
          savedSize.midLength = size.midLength;
          savedSize.hip = size.hip;
        } else if (this.selectedType === 'pants') {
          savedSize.inseam = size.inseam;
          savedSize.waist = size.waist;
          savedSize.hip = size.hip;
        }
        return savedSize;
      });
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
  padding-top: 20px;
  padding-bottom: 20px;
}

.title {
  text-align: center;
  font-size: 48px;
  height: 60px;
  line-height: 60px;
}

.gray-bg {
  margin-top: 20px;
  background-color: #E9E9E9;
  padding: 20px;
  height: 700px;
}

.white-bg {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  font-size: 24px;
  height: 100%;
  position: relative;

  .unit-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #251800;
    color: #5d5d5d;
    align-items: flex-end;
    line-height: 64px;
  }

  .unit-left {
    font-size: 40px;
  }

  .unit-right {
    font-size: 24px;
  }

  table {
    width: 100%;
    border: none;
    text-align: center;
    margin-top: 30px;
  }

  td {
    border-bottom: 1px solid #ecebe9;
  }

  th {
    padding: 0 4px;
  }

  td,
  th {
    height: 60px;
  }

  .wc-des {
    font-size: 20px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%);
    white-space: nowrap;
  }
}

.des_container_en {
  .white-bg {
    font-size: 20px;
  }
}
</style>