<script>
import Vue from 'vue';
import Vue2TooltipSimple from '@/vue2-tooltip-simple.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    Vue2TooltipSimple
  }
});
</script>

<template>
  <div id="app">
    <vue2-tooltip-simple />
  </div>
</template>
