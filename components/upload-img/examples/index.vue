<template>
  <div>
    <UploadImg v-model="img" @input="onUpdate" />
  </div>
</template>

<script>
import UploadImg from '../src/upload-img.vue';

function absoluteURL(doc, relativeURL) {
  // In the case of data: URL-based pages, relativeURL === absoluteURL.
  if (doc.location.protocol === 'data:') {
    return doc.location.href;
  }
  var urlNormalizer = doc['__gCrWebURLNormalizer'];
  if (!urlNormalizer) {
    urlNormalizer = doc.createElement('a');
    doc['__gCrWebURLNormalizer'] = urlNormalizer;
  }

  // Use the magical quality of the <a> element. It automatically converts
  // relative URLs into absolute ones.
  urlNormalizer.href = relativeURL;
  return urlNormalizer.href;
};

export default {
  components: { UploadImg },
  data() {
    return {
      img: '',
    };
  },
  methods: {
    onUpdate(_, file) {
      console.debug('onUpdate file: ', file);
      console.debug('abs url: ', absoluteURL(document, file?.name));
    },
  },
};
</script>
