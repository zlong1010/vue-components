<template>
  <div class="c-upload-img">
    <div v-if="value" class="preview" :style="sizeSty">
      <img :src="value" alt="" />
      <IconDelete class="act-icon icon_delete_red" @click.native="onDelete" />
    </div>
    <div v-else class="empty" :style="sizeSty" @click="onEdit">
      <span class="image-desc">{{ desc }}</span>
      <slot name="empty"></slot>
      <span class="act-icon">
        <IconEdit />
      </span>
    </div>
    <div v-if="error" class="error-wrap"><IconErrDiamond />{{ error }}</div>
    <input id="vdqh4nafee" type="file" accept="image/png, image/jpeg, image/jpg" @change="upload" />
  </div>
</template>

<script>
import { IconEdit, IconDelete, IconErrDiamond } from '../../svg-icon';

const loadImg = base64 => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('图片加载失败'));
  });
};

export default {
  name: 'UploadImg',
  components: { IconEdit, IconDelete, IconErrDiamond },
  props: {
    value: String,
    maxSize: {
      type: Number,
      default: 3,
    },
    desc: String,
    width: String,
    height: String,
  },
  computed: {
    sizeSty({ width, height }) {
      const styObj = {};
      width && (styObj.width = width);
      height && (styObj.height = height);
      return styObj;
    },
  },
  data() {
    return {
      error: '',
    };
  },
  methods: {
    upload(e) {
      this.error = '';
      const file = e.target.files[0];
      if (!file) return;
      if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.type)) {
        this.error = '图片格式不支持，上传失败';
        return;
      }
      if (file.size > this.maxSize * 1024 * 1024) {
        this.error = 'logo尺寸过大';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result;
        this.$emit('input', base64, file);
        // loadImg(base64).then(() => {
        //   this.$emit('input', base64, file);
        // });
      };
    },
    onEdit() {
      const ele = this.$el.querySelector('#vdqh4nafee');
      ele.value = '';
      ele.click();
    },
    onDelete() {
      console.debug('delete');
      // this.$el.querySelector('#vdqh4nafee').value = '';
      this.$emit('input', '');
    },
  },
};
</script>

<style lang="less" scoped>
.c-upload-img {
  input[type='file'] {
    display: none;
  }
  .empty {
    display: block;
    height: 44px;
    width: 44px;
    border: 1px dashed #c0c4cc;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
  }
  .image-desc {
    color: #3a51e0;
    font-size: 14px;
    line-height: 22px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .preview {
    width: 44px;
    height: 44px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
  .act-icon {
    width: 24px;
    height: 24px;
    margin-left: 0;
    display: inline-block;
    position: absolute;
    right: -10px;
    bottom: -8px;
    background-color: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(184, 192, 207, 0.5);
    border-radius: 50%;
    cursor: pointer;
    & > svg {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .error-wrap {
    max-width: 358px;
    display: flex;
    margin-top: 8px;
    align-items: center;
    font-size: 12px;
    color: #f56c6c;
    line-height: 18px;
    font-weight: 400;
    svg {
      margin-right: 4px;
    }
  }
}
</style>
