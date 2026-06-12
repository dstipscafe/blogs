'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Icon from './Icon';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <button className="theme-toggle" aria-label="切換深色模式" />;
  }

  const dark = resolvedTheme === 'dark';
  return (
    <button
      className="theme-toggle"
      aria-label="切換深色模式"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  );
}
