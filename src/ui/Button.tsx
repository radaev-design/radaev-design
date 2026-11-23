import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  block?: boolean;
};

export function Button({ variant = 'primary', block, className = '', type = 'button', ...p }: Props) {
  const cls = ['btn', variant === 'secondary' && 'secondary', block && 'block', className]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...p} />;
}
