const DEFAULT_STREAM_SEPARATOR = '\n\n';
const DEFAULT_PART_SEPARATOR = '\n';
const DEFAULT_KV_SEPARATOR = ':';

// 工具函数
const isValidString = (str: string) => (str ?? '').trim() !== '';

// TransformStream 实现
function splitStream() {
  let buffer = '';

  return new TransformStream<string, string>({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(DEFAULT_STREAM_SEPARATOR);
      parts.slice(0, -1).forEach((part) => {
        if (isValidString(part))
          controller.enqueue(part);
      });
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (isValidString(buffer))
        controller.enqueue(buffer);
    },
  });
}

function splitPart() {
  return new TransformStream<string, SSEOutput>({
    transform(partChunk, controller) {
      const lines = partChunk.split(DEFAULT_PART_SEPARATOR);
      const sseEvent = lines.reduce<SSEOutput>((acc, line) => {
        const sepIndex = line.indexOf(DEFAULT_KV_SEPARATOR);
        if (sepIndex === -1)
          return acc;

        const key = line.slice(0, sepIndex);
        if (!isValidString(key))
          return acc;

        const value = line.slice(sepIndex + 1);
        return { ...acc, [key]: value };
      }, {});

      if (Object.keys(sseEvent).length > 0)
        controller.enqueue(sseEvent);
    },
  });
}

// 类型定义
export type SSEFields = 'data' | 'event' | 'id' | 'retry';
export type SSEOutput = Partial<Record<SSEFields, any>>;

export interface XStreamOptions<Output = SSEOutput> {
  readableStream: ReadableStream<Uint8Array>;
  transformStream?: TransformStream<string, Output>;
}

// 可读流类型，支持异步迭代和中断
type XReadableStream<R = SSEOutput> = ReadableStream<R> & {
  [Symbol.asyncIterator]: () => AsyncGenerator<R>;
  reader?: ReadableStreamDefaultReader<R>;
};

// 核心流处理函数（支持中断）
function XStream<Output = SSEOutput>(
  options: XStreamOptions<Output>,
  signal?: AbortSignal,
): XReadableStream<Output> {
  const { readableStream, transformStream } = options;
  if (!(readableStream instanceof ReadableStream)) {
    throw new TypeError('options.readableStream 必须是 ReadableStream 的实例。');
  }

  const decoderStream = new TextDecoderStream();
  const processedStream = transformStream
    ? readableStream
        .pipeThrough(decoderStream)
        .pipeThrough(transformStream)
    : readableStream
      .pipeThrough(decoderStream)
      .pipeThrough(splitStream())
      .pipeThrough(splitPart()) as XReadableStream<Output>;

  // 为流添加异步迭代器并处理中断信号
  (processedStream as XReadableStream<Output>)[Symbol.asyncIterator] = async function* () {
    const reader = this.getReader();
    const cancelReader = () => {
      void reader.cancel().catch(() => undefined);
    };
    (this as XReadableStream<Output>).reader = reader; // 保存读取器引用
    signal?.addEventListener('abort', cancelReader, { once: true });
    try {
      if (signal?.aborted) {
        await reader.cancel();
        return;
      }
      while (true) {
        const { done, value } = await reader.read();
        if (done || signal?.aborted)
          break;
        if (value)
          yield value;
      }
    }
    finally {
      signal?.removeEventListener('abort', cancelReader);
      reader.releaseLock(); // 释放锁
    }
  };

  return processedStream as XReadableStream<Output>;
}

// Vue3 Hooks 实现
export function useXStream() {
  const data = ref<SSEOutput[]>([]);
  const error = ref<Error | null>(null);
  const isLoading = ref<boolean>(false);
  const abortController = shallowRef<AbortController | null>(null);
  const currentStream = shallowRef<XReadableStream<SSEOutput> | null>(null);
  let streamGeneration = 0;

  const stopCurrentStream = () => {
    abortController.value?.abort();
    const reader = currentStream.value?.reader;
    if (reader) {
      void reader.cancel().catch(() => undefined);
    }
    currentStream.value = null;
    abortController.value = null;
  };

  // 启动流式请求
  const startStream = async (options: XStreamOptions<SSEOutput>) => {
    stopCurrentStream();
    const generation = ++streamGeneration;
    const controller = new AbortController();

    isLoading.value = true;
    error.value = null;
    data.value = [];
    abortController.value = controller;

    try {
      const stream = XStream(options, controller.signal);
      currentStream.value = stream;
      for await (const item of stream) {
        if (controller.signal.aborted || generation !== streamGeneration)
          break;
        data.value.push(item);
      }
    }
    catch (err) {
      if (
        generation === streamGeneration
        && !controller.signal.aborted
        && err instanceof Error
      ) {
        error.value = err;
      }
    }
    finally {
      if (generation === streamGeneration) {
        isLoading.value = false;
        currentStream.value = null; // 释放流引用
        abortController.value = null; // 释放控制器
      }
    }
  };

  // 中断流式请求（强制关闭流）
  const cancel = () => {
    streamGeneration += 1;
    stopCurrentStream();
    isLoading.value = false;
  };

  return {
    startStream,
    cancel, // 新增中断方法
    data,
    error,
    isLoading,
  };
}
