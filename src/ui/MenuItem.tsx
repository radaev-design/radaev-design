import { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & {
  ico: string;
  title: string;
  sub?: string;
  right?: ReactNode;
};

export function MenuItem({ ico, title, sub, right = <span className="mi-ch">›</span>, ...p }: Props) {
  return (
    <button type="button" className="mi" {...p}>
      <span className="mi-ico">{ico}</span>
      <span className="mi-t">
        {title}
        {sub && <small>{sub}</small>}
      </span>
      {right}
    </button>
  );
}
