export interface UseRecordError {
  code: number;
  message: string;
}

export interface UseRecordProps {
  onError?: (err: SpeechRecognitionErrorEvent | UseRecordError) => void;
  onStart?: () => void;
  onEnd?: (v: string) => void;
  onResult?: (result: string) => void;
}

/**
 * @description Provides a hook for speech recognition, allowing voice input and handling various events such as start, end, result, and errors.
 *              提供语音识别的钩子，允许语音输入并处理开始、结束、结果及错误等各种事件。
 *
 * @interface UseRecordError
 * Represents the structure of an error object for useRecord. / 表示 useRecord 的错误对象结构。
 *
 * @property {number} code - The error code. / 错误代码。
 *
 * @property {string} message - The error message. / 错误信息。
 *
 * @interface UseRecordProps
 * Represents the configuration options for useRecord. / 表示 useRecord 的配置选项。
 *
 * @property {Function} [onError] - Callback function triggered when an error occurs. / 当发生错误时触发的回调函数。
 *
 * @property {Function} [onStart] - Callback function triggered when voice recognition starts. / 当语音识别开始时触发的回调函数。
 *
 * @property {Function} [onEnd] - Callback function triggered when voice recognition ends, providing the final recognized text. / 当语音识别结束时触发的回调函数，并提供最终识别的文本。
 *
 * @property {Function} [onResult] - Callback function triggered when intermediate recognition results are available. / 当有中间识别结果时触发的回调函数。
 *
 * @function useRecord
 * Initializes the speech recognition functionality and returns state and control functions. / 初始化语音识别功能并返回状态和控制函数。
 *
 * @param {UseRecordProps} [props] - Configuration options for the hook. / 钩子的配置选项。
 *
 * @returns {object} - An object containing the state and methods for speech recognition. / 包含语音识别状态和方法的对象。
 *
 * @property {Ref<boolean>} loading - Indicates whether speech recognition is currently active. / 指示语音识别是否正在进行。
 *
 * @property {Function} start - Starts the speech recognition process. / 开始语音识别过程。
 *
 * @property {Function} stop - Stops the speech recognition process. / 停止语音识别过程。
 *
 * @property {Ref<string>} value - Holds the recognized text. / 保存识别的文本。
 *
 * @example
 * const { loading, start, stop, value } = useRecord({
 *   onStart: () => console.log('Recognition started'),
 *   onEnd: (result) => console.log('Recognition ended with result:', result),
 *   onResult: (result) => console.log('Intermediate result:', result),
 *   onError: (error) => console.error('Error:', error),
 * });
 *
 * start(); // Start voice recognition
 * stop();  // Stop voice recognition
 * console.log(value.value); // Access the recognized text
 */
export function useRecord({
  onError,
  onStart,
  onEnd,
  onResult
}: UseRecordProps = {}) {
  const loading = ref<boolean>(false);
  const recognition = ref<null | SpeechRecognition>(null);
  const value = ref<string>('');

  const start = () => {
    if ('webkitSpeechRecognition' in window) {
      recognition.value = new webkitSpeechRecognition();
      recognition.value!.continuous = true;
      recognition.value.interimResults = true;
      recognition.value.lang = 'zh-CN';
      recognition.value.onstart = () => {
        loading.value = true;
        value.value = '';
        onStart?.();
      };
      recognition.value.onend = () => {
        loading.value = false;
        onEnd?.(value.value);
      };
      recognition.value.onerror = e => {
        loading.value = false;
        onError?.(e);
      };
      recognition.value.onresult = e => {
        let results = '';
        for (let i = 0; i <= e.resultIndex; i++) {
          results += e.results[i][0].transcript;
        }
        value.value = results;
        onResult?.(results);
      };
      recognition.value.start();
    } else {
      onError?.({
        code: -1,
        message: 'The current browser does not support voice recognition'
      });
    }
  };

  const stop = () => {
    if (recognition.value) {
      recognition.value.stop();
    }
  };

  onUnmounted(() => {
    stop();
    recognition.value = null;
  });

  return {
    loading,
    start,
    stop,
    value
  };
}
