<template>
  <div>
    <h2>富文本输入</h2>
    <textarea v-model="inputText" placeholder="请输入文案" rows="20" cols="50"></textarea>
    <button @click="clearInput">清空</button>
    
    <h2>格式化输出</h2>
    <pre>{{ formattedText }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputText: `XL：衣長：54 肩寬：38 胸圍：94 袖長：60 袖口：20 體重：60-70kg`
    };
  },
  computed: {
    formattedText() {
      return this.convertWeightToJin(this.inputText);
    }
  },
  methods: {
    clearInput() {
      this.inputText = '';
    },
    convertWeightToJin(text) {
      return text.replace(/(\d+)-(\d+)kg/g, (match, p1, p2) => {
        const minKg = parseInt(p1, 10);
        const maxKg = parseInt(p2, 10);
        const minJin = minKg * 2;
        const maxJin = maxKg * 2;
        return `${minJin}-${maxJin}斤`;
      });
    }
  }
};
</script>

<style>
textarea {
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
}
pre {
  background-color: #f9f9f9;
  padding: 10px;
  border: 1px solid #ddd;
  white-space: pre-wrap;
}
button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #d32f2f;
}
</style>