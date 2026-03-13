import { onMounted, onUnmounted, ref } from 'vue';

export function useDarkModeWatcher() {
  const isDark = ref(
    typeof document !== 'undefined' && document.body.classList.contains('dark')
  );

  let observer: MutationObserver;

  onMounted(() => {
    observer = new MutationObserver(() => {
      isDark.value = document.body.classList.contains('dark');
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'] // 只监听 class 变化
    });
  });

  onUnmounted(() => {
    observer && observer.disconnect();
  });

  return {
    isDark
  };
}
