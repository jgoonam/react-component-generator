import { afterEach, describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useComponentGenerator } from './useComponentGenerator';

const COMPONENTS_STORAGE_KEY = 'react-component-generator:components';

describe('useComponentGenerator', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('저장된 컴포넌트 목록과 생성 시간을 복원한다', () => {
    localStorage.setItem(
      COMPONENTS_STORAGE_KEY,
      JSON.stringify([
        {
          id: 'stored-component',
          prompt: '프로필 카드',
          code: 'const Card = () => null; render(<Card />);',
          createdAt: '2026-10-08T00:00:00.000Z',
        },
      ]),
    );

    const { result } = renderHook(() => useComponentGenerator());

    expect(result.current.components).toHaveLength(1);
    expect(result.current.components[0].createdAt).toBeInstanceOf(Date);
  });
});
