import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useAppPreferences } from './useAppPreferences';

describe('useAppPreferences', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('API 키, Provider, 프롬프트 히스토리를 복원한다', () => {
    localStorage.setItem('react-component-generator:api-key', JSON.stringify('AIza-stored'));
    localStorage.setItem('react-component-generator:provider', JSON.stringify('anthropic'));
    localStorage.setItem(
      'react-component-generator:prompt-history',
      JSON.stringify(['프로필 카드', '대시보드']),
    );

    const { result } = renderHook(() => useAppPreferences());

    expect(result.current.apiKey).toBe('AIza-stored');
    expect(result.current.provider).toBe('anthropic');
    expect(result.current.promptHistory).toEqual(['프로필 카드', '대시보드']);
  });

  it('새 프롬프트를 히스토리에 저장한다', () => {
    const { result } = renderHook(() => useAppPreferences());

    act(() => {
      result.current.rememberPrompt('알림 설정 패널');
    });

    expect(localStorage.getItem('react-component-generator:prompt-history')).toBe(
      JSON.stringify(['알림 설정 패널']),
    );
  });
});
