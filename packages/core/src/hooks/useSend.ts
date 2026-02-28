export interface UseSendProps {
  onAbort?: () => void;
  sendHandler?: (...args: any[]) => void;
  abortHandler?: () => void;
  finishHandler?: () => void;
}

/**
 * @description A utility function for handling the request status of send operation management, supporting optional abort functionality, as well as Promise and Server-Sent Events (SSE).
 *              一个用于处理发送操作管理请求状态的实用函数，支持可选的中止功能，同时支持 Promise 和 SSE（服务端事件）。
 *
 * @typedef {object} WithAbortProps
 * @property {(signal: AbortSignal) => Promise<any>} promiseFn - A function that returns a promise and accepts an `AbortSignal` for cancellation. / 一个返回 Promise 的函数，接受一个用于取消的 `AbortSignal`。
 *
 * @typedef {object} WithSSEProps
 * @property {EventSource} eventSource - An `EventSource` instance for handling Server-Sent Events. / 用于处理服务端事件的 `EventSource` 实例。
 *
 * @typedef {object} UseSendProps
 * @property {WithAbortProps | WithSSEProps} props - Either `WithAbortProps` or `WithSSEProps`, depending on the use case. / 根据使用场景，传入 `WithAbortProps` 或 `WithSSEProps`。
 * @property {() => void} [onAbort] - Optional callback triggered when the operation is aborted. / 可选的回调函数，在操作被中止时触发。
 * @property {(...args: any[]) => void} [sendHandler] - Optional handler function invoked before sending starts. / 可选的处理函数，在发送开始前调用。
 *
 * @param {UseSendProps} props - Configuration options for the `useSend` function. / `useSend` 函数的配置选项。
 *
 * @returns {object} - Returns an object containing utility methods and state. / 返回一个包含实用方法和状态的对象。
 *
 * @property {Ref<boolean>} loading - A reactive reference indicating whether a send operation is in progress. / 一个响应式引用，指示是否正在执行发送操作。
 *
 * @property {() => void} abort - A function to abort the ongoing operation, either by aborting the promise or closing the EventSource. / 一个用于中止当前操作的函数，可以中止 Promise 或关闭 EventSource。
 *
 * @property {(...args: any[]) => void} send - A function to initiate the send operation, invoking the `sendHandler` if provided. / 一个用于启动发送操作的函数，如果提供了 `sendHandler` 则会调用。
 *
 * @property {() => void} finish - A function to mark the send operation as finished. / 一个用于标记发送操作完成的函数。
 */
export function useSend(
  { onAbort, sendHandler, abortHandler }: UseSendProps = {} as UseSendProps
) {
  const loading = ref<boolean>(false);

  const handleSend = (...args: any[]) => {
    if (loading.value) return;
    sendHandler?.(...args);
    loading.value = true;
  };

  const handleAbort = () => {
    loading.value = false;
    abortHandler?.();
    onAbort?.();
  };

  const handleFinish = () => {
    loading.value = false;
  };

  return {
    loading,
    abort: handleAbort,
    send: handleSend,
    finish: handleFinish
  };
}
