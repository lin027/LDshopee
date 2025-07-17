<template>
  <main>
    <label for="category">选择商品类别:</label>
    <select v-model="key" id="category">
      <option value="clothes">衣服</option>
      <option value="underwear">贴身衣物</option>
      <option value="bag">包</option>
      <option value="towel">包巾</option>
    </select>
    <h3 class="desc-title">描述转换</h3>
    <div class="desc-trans-row">
      <div class="before-des">
        <el-input v-model="form.beforeDesc" style="width: 400px" :rows="20" type="textarea" placeholder="转换前" />
      </div>
      <div class="btn-group">
        <div>
          <el-button type="primary" class="trans-btn" @click="transformText">转换按钮</el-button>
        </div>
        <div>
          <el-button type="info" class="clear-btn" @click="clearText">清空</el-button>
        </div>
      </div>

      <div class="after-des">
        <el-input v-model="form.afterDesc" style="width: 400px" :rows="20" type="textarea" placeholder="转换后" />
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'

const form = reactive({
  beforeDesc: '',
  afterDesc: '',
  keyString: '',
})
const key = ref('underwear') // 默认选择“衣服”
const selectAfterDesc = computed(() => {
  let baseDesc =
    '🌈产品规格：\n' +
    '\n' +
    '🌈重要通知：\n' +
    '🎯优惠畅享：关注店铺,即可领取超值优惠券,开启你的购物狂欢\n' +
    '🎯运输提醒：产品源自中国,运输过程需要一定时间,预计送达时间为5-10个工作日,请您耐心等待🚚\n' +
    '\n' +
    '🌈小提示：\n' +
    '由于拍摄光线的原因,实际收到的货物颜色可能会与图片有所差异,请以实物为准！\n' +
    '尺寸仅供参考,可能存在1-3厘米的测量误差,请在购买前确认是否适合您的尺寸需求\n'
  if (key.value === 'underwear') {
    baseDesc +=
      '基于个人卫生考量,贴身衣物恕不接受退换货\n' +
      '商品瑕疵请立即附开箱照片影片告知小帮手处理,衣物类一经下水洗过恕不退换货\n' +
      '深浅色系记得分开清洗,避免商品染色'
      
  } else if (key.value === 'clothes') {
    baseDesc +=
      '选择合适尺寸的小贴士：可以使用类似的衣物进行尺寸对比\n' +
      '商品瑕疵请立即附开箱照片影片告知小帮手处理,衣物类一经下水洗过恕不退换货\n' +
      '深浅色系记得分开清洗,避免商品染色\n' 
  }
  return baseDesc
})

function transformText() {
  // 保留包含关键字的行
  let keyLineArr = form.beforeDesc.split('\n');
  // 转换后的文案
  let keyLindeDesc = keyLineArr.map(line => `👉 ${line}`).join('\n');
  // 更新 afterDesc
  form.afterDesc = selectAfterDesc.value.replace(
    '🌈产品规格：\n',
    '🌈产品规格：\n' + keyLindeDesc + '\n'
  );
}

function clearText() {
  form.beforeDesc = ''
  form.afterDesc = ''
}

</script>

<style scoped>
.form-inline {
  width: 600px;
}

.desc-trans-row {
  display: flex;
  margin-top: 10px;
}

.clear-btn {
  margin-top: 30px;
}
</style>