<template>
  <div class="example">
    <introduction
      description="In <code>page-mode</code> virtual list using global document to scroll through the list."
    />
    <div class="example-content">
      <div>
        <virtual-list
          class="list-page scroll-touch"
          ref="vsl"
          :data-key="'id'"
          :data-sources="items"
          :estimate-size="135"
          :page-mode="true"
          v-on:totop="totop"
          v-on:tobottom="tobottom"
        >
          <template v-slot:item="{ source }">
            <Item :source="source" class="list-item-page" />
          </template>
        </virtual-list>
        <div class="bottom">
          <h2>This is page footer</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item';

import { Random } from '../../common/mock';
import getSentences from '../../common/sentences';
import genUniqueId from '../../common/gen-unique-id';

const TOTAL_COUNT = 1000;

const DataItems = [];
let count = TOTAL_COUNT;
while (count--) {
  const index = TOTAL_COUNT - count;
  DataItems.push({
    index,
    name: Random.name(),
    id: genUniqueId(index),
    desc: getSentences(),
  });
}

export default {
  name: 'page-mode',

  components: {
    Item,
  },

  data() {
    return {
      items: DataItems,
      itemComponent: Item,
    };
  },

  methods: {
    totop() {
      console.log('reach totop');
    },
    tobottom() {
      console.log('reach tobottom');
    },
  },
};
</script>

<style lang="less">
.list-page {
  width: 100%;
  border: 2px solid;
  border-radius: 3px;
  overflow-y: auto;
  border-color: dimgray;

  .list-item-page {
    display: flex;
    align-items: center;
    padding: 1em;
    border-bottom: 1px solid;
    border-color: lightgray;
  }
}
.bottom {
  padding: 2em 0;
}
</style>
