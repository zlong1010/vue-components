<template>
  <div>
    <h3>input 框</h3>
    <Input width="360px" desc="字段描述" placeholder="请输入" />
    <h3 style="margin-top: 32px">textarea</h3>
    <Input width="360px" textarea maxlength="48" desc="字段描述" placeholder="请输入" errMsg="错误信息" />
  </div>
</template>

<script>
import Input from '../src/input.vue';

export default {
  components: { Input },
};
</script>
