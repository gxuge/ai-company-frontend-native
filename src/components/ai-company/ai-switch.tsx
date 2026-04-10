import * as React from 'react';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform } from 'react-native';

export interface AiSwitchProps extends SwitchPrimitives.RootProps, React.RefAttributes<SwitchPrimitives.RootRef> {
  checkedColorClassName?: string;
}

export function AiSwitch({
  className,
  checkedColorClassName = 'bg-[rgba(155,254,3,0.9)]',
  ...props
}: AiSwitchProps) {
  return (
    <SwitchPrimitives.Root
      className={[
        'flex h-[30px] w-[54px] shrink-0 flex-row items-center rounded-full border border-transparent transition-colors',
        Platform.select({
          web: 'focus-visible:outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed peer inline-flex',
        }),
        props.checked ? checkedColorClassName : 'bg-[#4b5563]',
        props.disabled ? 'opacity-50' : '',
        className
      ].filter(Boolean).join(' ')}
      {...props}>
      <SwitchPrimitives.Thumb
        className={[
          'bg-white h-[24px] w-[24px] rounded-full transition-transform',
          Platform.select({
            web: 'pointer-events-none block ring-0 shadow-[0_2px_4px_rgba(0,0,0,0.2)]',
          }),
          props.checked
            ? 'translate-x-[27px]'
            : 'translate-x-[3px]'
        ].filter(Boolean).join(' ')}
      />
    </SwitchPrimitives.Root>
  );
}
