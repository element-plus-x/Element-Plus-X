<script lang="ts">
import { h } from 'vue'
import { codeToHtml } from 'shiki'

export default defineComponent({
  props: {
    codeKey: {
      type: String,
      default: '',
    },
    codeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {

    const html = ref('')

    const generateHtml = async () => {
      const { language, content } = props.codeData;
      html.value = await codeToHtml(content, {
        lang: language,
        theme: 'vitesse-light'
      }).catch(() => {
        return '';
      });
    }

    watch(
      () => [props.codeData.content],
      generateHtml,
      { immediate: true }
    )
    return () => h('div', {
      class: 'markdown-code',
      key: props.codeKey,
      innerHTML: html.value,
    });
  },
});
</script>
