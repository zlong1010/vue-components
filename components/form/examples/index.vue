<template>
  <CusForm :cmp="UseForm">
    <UseForm />
  </CusForm>
</template>

<script>
import CusForm from '../src/form.vue';
import UseForm from './useForm.vue';

export default {
  components: { CusForm },
  data() {
    return {
      UseForm,
    };
  },
};
</script>

<style></style>
