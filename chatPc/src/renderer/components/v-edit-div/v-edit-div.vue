<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2020-10-31 23:29:25
 -->
<template>
  <div
    class="edit-div"
    v-html="innerText"
    :contenteditable="canEdit"
    @focus="onFocus"
    @blur="onBlur"
    @input="changeText"
    @keydown.enter.prevent="onEnter"
  ></div>
</template>
<script >
export default {
  name: "editDiv",
  props: {
    value: {
      type: String,
      default: ""
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      innerText: this.value,
      isLocked: false
    };
  },
  watch: {
    value() {
      if (!this.isLocked) {
        ////console.log(this.value)
        this.innerText = this.value;
      }
    }
  },
  methods: {
    addBr(event) {
      //console.log(event)
      //this.innerText = this.innerText + "<br>";
      //event.keyCode = 0;//屏蔽回车键
      event.returnValue = false;
    },
    changeText(e) {
      //this.innerText = this.innerText + '<br>'
      this.$emit("input", this.$el.innerHTML);
    },
    onFocus() {
      this.isLocked = true;
      console.log("onFocus");
      this.$emit("onFocus",event);
    },
    onBlur() {
      this.isLocked = false;
      console.log("onBlur");
      this.$emit("onBlur");
    },
    onEnter(event){
      this.$emit("onEnter");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.edit-div {
  overflow: auto;
  word-break: break-all;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  background: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  caret-color: #606266;
  display: block;
  &[contenteditable="true"] {
    //user-modify: read-write-plaintext-only;
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #606266;
    }
  }
}
</style>
