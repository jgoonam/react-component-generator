import type { Provider } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

const API_KEY_STORAGE_KEY = 'react-component-generator:api-key';
const PROVIDER_STORAGE_KEY = 'react-component-generator:provider';
const PROMPT_HISTORY_STORAGE_KEY = 'react-component-generator:prompt-history';

function restoreApiKey(storedValue: unknown): string {
  return typeof storedValue === 'string' ? storedValue : '';
}

function restoreProvider(storedValue: unknown): Provider {
  return storedValue === 'anthropic' || storedValue === 'google' ? storedValue : 'google';
}

function restorePromptHistory(storedValue: unknown): string[] {
  return Array.isArray(storedValue)
    ? storedValue.filter((prompt): prompt is string => typeof prompt === 'string')
    : [];
}

export function useAppPreferences() {
  const [apiKey, setApiKey] = useLocalStorageState(
    API_KEY_STORAGE_KEY,
    '',
    restoreApiKey,
  );
  const [provider, setProvider] = useLocalStorageState(
    PROVIDER_STORAGE_KEY,
    'google' as Provider,
    restoreProvider,
  );
  const [promptHistory, setPromptHistory] = useLocalStorageState(
    PROMPT_HISTORY_STORAGE_KEY,
    [] as string[],
    restorePromptHistory,
  );

  const rememberPrompt = (prompt: string) => {
    setPromptHistory((previous) => [prompt, ...previous.filter((item) => item !== prompt)]);
  };

  return { apiKey, setApiKey, provider, setProvider, promptHistory, rememberPrompt };
}
