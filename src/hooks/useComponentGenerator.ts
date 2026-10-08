import { useState, useCallback } from 'react';
import type { GeneratedComponent, Provider } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

const COMPONENTS_STORAGE_KEY = 'react-component-generator:components';

interface UseComponentGeneratorReturn {
  components: GeneratedComponent[];
  isLoading: boolean;
  error: string | null;
  generate: (prompt: string, apiKey: string | undefined, provider: Provider) => Promise<void>;
  removeComponent: (id: string) => void;
  clearAll: () => void;
}

function restoreComponents(storedValue: unknown): GeneratedComponent[] {
  if (!Array.isArray(storedValue)) {
    return [];
  }

  return storedValue.flatMap((component) => {
    if (
      typeof component !== 'object' ||
      component === null ||
      !('id' in component) ||
      !('prompt' in component) ||
      !('code' in component) ||
      !('createdAt' in component) ||
      typeof component.id !== 'string' ||
      typeof component.prompt !== 'string' ||
      typeof component.code !== 'string' ||
      typeof component.createdAt !== 'string'
    ) {
      return [];
    }

    const createdAt = new Date(component.createdAt);
    return Number.isNaN(createdAt.getTime())
      ? []
      : [{ id: component.id, prompt: component.prompt, code: component.code, createdAt }];
  });
}

export function useComponentGenerator(): UseComponentGeneratorReturn {
  const [components, setComponents] = useLocalStorageState(
    COMPONENTS_STORAGE_KEY,
    [] as GeneratedComponent[],
    restoreComponents,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string, apiKey: string | undefined, provider: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ...(apiKey && { apiKey }), provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate component');
      }

      const newComponent: GeneratedComponent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        prompt,
        code: data.code,
        createdAt: new Date(),
      };

      setComponents((prev) => [newComponent, ...prev]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setComponents]);

  const removeComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }, [setComponents]);

  const clearAll = useCallback(() => {
    setComponents([]);
  }, [setComponents]);

  return { components, isLoading, error, generate, removeComponent, clearAll };
}
