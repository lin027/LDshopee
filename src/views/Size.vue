<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <h2>添加尺寸信息</h2>
      <div style="display: flex; align-items: center; padding-right: 20px">
        <el-select class="normal-input" v-model="selectedType">
          <el-option value="shirt" label="上衣"></el-option>
          <el-option value="skirt" label="裙子"></el-option>
          <el-option value="pants" label="裤子"></el-option>
          <el-option value="underwear" label="內裤"></el-option>
        </el-select>
        <span style="margin-left: 10px">表格高度：</span>
        <el-input v-model="tableRowHeight" placeholder="请输入表格高度" class="normal-input" style="width: 80px"></el-input>
      </div>
    </div>

    <div>货号：
      <el-input v-model="productCode" placeholder="请输入货号" class="normal-input" style="width: 240px"></el-input>
    </div>

    <span style="margin-left: 10px">显示字段：</span>
    <el-checkbox-group v-model="selectedColumns" style="display: inline-block; vertical-align: middle;">
      <el-checkbox
        v-for="col in [...allColumns, ...customColumns]"
        :key="col.key"
        :label="col.key"
        style="margin-right: 10px; margin-bottom: 5px;">
        {{ col.label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- 自定义字段输入 -->
    <div style="margin-top: 10px;">
      <el-input v-model="newCustomField" placeholder="字段名（如 leg）" style="width: 160px;"></el-input>
      <el-input v-model="newCustomFieldEn" placeholder="英文名（如 Leg）" style="width: 160px; margin-left: 10px;"></el-input>
      <el-input v-model="newCustomFieldZhTw" placeholder="繁體名（如 腿圍）" style="width: 160px; margin-left: 10px;"></el-input>
      <el-button type="primary" @click="addCustomField" style="margin-left: 10px;">添加字段</el-button>
    </div>

    <div class="btn-group">
      <el-button type="info" @click="addNewRow">添加行</el-button>
      <el-button type="success" @click="saveSizes">保存</el-button>
      <el-button type="danger" @click="clearSizes">清除尺码</el-button>
      <el-button type="primary" @click="downloadImages">下载图片</el-button>
    </div>

    <!-- 动态表格 -->
    <table class="input_table" width="100%" border="1" cellpadding="10" cellspacing="0">
      <thead>
        <tr>
          <th v-for="key in selectedColumns" :key="key">{{ getColumnLabel(key) }}</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(size, index) in sizes" :key="index">
          <td v-for="key in selectedColumns" :key="key">
            <input type="text" v-model="size[key]" />
          </td>
          <td>
            <el-button type="danger" @click="deleteRow(index)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 已保存数据展示 -->
    <div v-if="savedSizes.length > 0" class="size-details" style="margin-top: 20px;">
      <div>📏 尺码信息：</div>
      <div v-for="(size, index) in savedSizes" :key="index">
        <span v-for="key in selectedColumns" :key="key">
          {{ getColumnLabel(key) }}：{{ size[key] }}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>

    <hr style="margin-top: 20px;" />
    <!-- 图片预览区域 -->
    <div class="des-container des_container_en" ref="desContainerEn" v-if="savedSizes.length > 0">
      <h1 class="title">{{ translations['en'].title }}</h1>
      <div class="gray-bg">
        <div class="white-bg">
          <table border="0" cellspacing="0">
            <thead>
              <tr>
                <th v-for="key in selectedColumns" :key="key" :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }">
                  {{ translations['en'][key] || this.getCustomLabel(key, 'en') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(size, index) in savedSizes" :key="index">
                <td v-for="key in selectedColumns" :key="key" :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }">
                  {{ size[key] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="des-container" ref="desContainerZhTw" v-if="savedSizes.length > 0">
      <h1 class="title">{{ translations['zh_tw'].title }}</h1>
      <div class="gray-bg">
        <div class="white-bg">
          <table border="0" cellspacing="0">
            <thead>
              <tr>
                <th v-for="key in selectedColumns" :key="key" :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }">
                  {{ translations['zh_tw'][key] || this.getCustomLabel(key, 'zh_tw') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(size, index) in savedSizes" :key="index">
                <td v-for="key in selectedColumns" :key="key" :style="{ height: `${tableRowHeight}px`, lineHeight: `${tableRowHeight}px` }">
                  {{ size[key] }}
                </td>
              </tr>
            </tbody>
          </table>
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
      selectedType: 'underwear',
      productCode: '',
      tableRowHeight: '50',
      selectedColumns: [],
      allColumns: [],
      customColumns: [], // 存放用户自定义字段
      newCustomField: '', // 输入的新字段名
      sizes: [],
      savedSizes: [],
      translations,

      customColumns: [], // 存放用户添加的字段
      newCustomField: '', // 输入的新字段名
      newCustomFieldEn: '', // 英文标签
      newCustomFieldZhTw: '', // 繁体中文标签
    };
  },
 watch: {
    selectedType: {
      handler(newType) {
        this.allColumns = this.columnsMap[newType];
        this.selectedColumns = this.allColumns.map(col => col.key); // 默认全选
      },
      immediate: true // 组件创建时也执行一次
    }
  },
  computed: {
    columnsMap() {
      return {
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
          { key: 'weight', label: '体重' }
        ],
        underwear: [
          { key: 'size', label: '尺码' },
          { key: 'waist', label: '腰围' },
          { key: 'midLength', label: '中长' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' }
        ],
        pants: [
          { key: 'size', label: '尺码' },
          { key: 'inseam', label: '裤长' },
          { key: 'waist', label: '腰围' },
          { key: 'hip', label: '臀围' },
          { key: 'weight', label: '体重' }
        ]
      };
    }
  },
  methods: {
    addNewRow() {
      const newSize = {};
      this.selectedColumns.forEach(key => {
        newSize[key] = '';
      });
      this.sizes.push(newSize);
    },
    saveSizes() {
      this.savedSizes = this.sizes.map(size => {
        const savedSize = {};
        this.selectedColumns.forEach(key => {
          savedSize[key] = size[key];
        });
        return savedSize;
      });
    },
    clearSizes() {
      this.sizes = [];
    },
    deleteRow(index) {
      this.sizes.splice(index, 1);
    },
    downloadImages() {
      const elementEn = this.$refs.desContainerEn;
      const elementZhTw = this.$refs.desContainerZhTw;

      if (!elementEn || !elementZhTw) {
        alert('没有可下载的内容');
        return;
      }

      this.generateImage(elementEn, `${this.productCode}_en.png`);
      this.generateImage(elementZhTw, `${this.productCode}_zh_tw.png`);
    },
    generateImage(element, filename) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = filename;
        link.click();
      });
    },
   getColumnLabel(key) {
    const column = [...this.allColumns, ...this.customColumns].find(col => col.key === key);
    return column ? column.label : key;
   },
   getCustomLabel(key, lang) {
    const customCol = this.customColumns.find(col => col.key === key);
    return customCol ? customCol[lang] || key : this.translations[lang]?.[key] || key;
    },
    addCustomField() {
      const field = this.newCustomField.trim();
      if (!field) {
        this.$message.warning('请输入字段名称');
        return;
      }

      if (this.allColumns.some(col => col.key === field) || this.customColumns.some(col => col.key === field)) {
        this.$message.warning('该字段已存在');
        return;
      }

      // 添加到自定义字段列表
      this.customColumns.push({
        key: field,
        label: this.newCustomFieldZhTw || field, // 默认使用中文标签
        en: this.newCustomFieldEn || field,
        zh_tw: this.newCustomFieldZhTw || field
      });

      this.selectedColumns.push(field); // 默认选中
      this.newCustomField = '';
      this.newCustomFieldEn = '';
      this.newCustomFieldZhTw = '';
    }
  }
};
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