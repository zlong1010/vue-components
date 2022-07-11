<template>
  <div class="cus-form">
    <h1>cus-form</h1>
    <component :is="cmp">
      <template v-slot:input="slotP">
        <input type="text" />
        <pre>{{ slotP }}</pre>
      </template>
      <template v-slot:cusinput>
        <CusInput />
      </template>
      <template v-slot:checkbox>
        <input type="checkbox" />
      </template>
    </component>
    <!-- <slot /> -->
  </div>
</template>

<script>
/* eslint-disable */

import CusInput from '../../input';

export default {
  components: { CusInput },
  props: {
    cmp: Object,
  },
};
</script>

<style></style>
