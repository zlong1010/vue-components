<template>
  <div class="example">
    <div class="example-content">
      <div>
        <virtual-list
          class="inline-block-list scroll-touch"
          data-key="id"
          :data-sources="items"
          :keeps="70"
          :page-mode="false"
          v-on:totop="totop"
          v-on:tobottom="tobottom"
          itemClass="item-wrap"
        >
          <template v-slot:item="{ source }">
            <p>{{`${source.index} : ${source.name}`}}</p>
          </template>
        </virtual-list>
      </div>
    </div>
  </div>
</template>

<script>
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
  name: 'inline-block',
  data() {
    return {
      items: DataItems,
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
.inline-block-list {
  width: 100%;
  border: 2px solid;
  border-radius: 3px;
  overflow-y: auto;
  height: 80vh;
  border-color: dimgray;
  .item-wrap {
    display: inline-block;
    height: 80px;
    width: 189px;
    border-right: 1px solid seagreen;
    border-bottom: 1px solid seagreen;
    > * {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
.bottom {
  padding: 2em 0;
}
</style>
