import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  deserialize?: (storedValue: unknown) => T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return initialValue;
      }

      const parsedValue: unknown = JSON.parse(storedValue);
      return deserialize ? deserialize(parsedValue) : (parsedValue as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장소 접근 실패 시 현재 세션 상태는 계속 사용한다.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
