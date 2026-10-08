import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useLocalStorageState } from './useLocalStorageState';

function StateProbe() {
  const [value, setValue] = useLocalStorageState('test:value', 'default');
  const [count, setCount] = useState(0);

  return (
    <>
      <output>{value}</output>
      <button onClick={() => setValue('updated')}>값 변경</button>
      <button onClick={() => setCount((previous) => previous + 1)}>리렌더</button>
      <span>{count}</span>
    </>
  );
}

describe('useLocalStorageState', () => {
  it('저장된 값을 초기 상태로 복원한다', () => {
    localStorage.setItem('test:value', JSON.stringify('stored'));

    render(<StateProbe />);

    expect(screen.getByText('stored')).toBeInTheDocument();
  });

  it('상태 변경을 localStorage에 저장한다', () => {
    render(<StateProbe />);

    fireEvent.click(screen.getByRole('button', { name: '값 변경' }));

    expect(localStorage.getItem('test:value')).toBe(JSON.stringify('updated'));
  });
});
