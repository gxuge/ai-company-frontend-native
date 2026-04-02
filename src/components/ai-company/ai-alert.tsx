import { Text, TextClassContext } from '@/components/reusables/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { View, type ViewProps } from 'react-native';

type AiAlertVariant = 'success' | 'error' | 'warning' | 'info';

const variantContainerClass: Record<AiAlertVariant, string> = {
  success: 'bg-emerald-500/10 border-emerald-500/20',
  error: 'bg-red-500/10 border-red-500/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  info: 'bg-blue-500/10 border-blue-500/20',
};

const variantIconColor: Record<AiAlertVariant, string> = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

const variantTextClass: Record<AiAlertVariant, string> = {
  success: 'text-emerald-300',
  error: 'text-red-300',
  warning: 'text-amber-300',
  info: 'text-blue-300',
};

function VariantIcon({ variant }: { variant: AiAlertVariant }) {
  const color = variantIconColor[variant];

  if (variant === 'success') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <Polyline points="8.5 12 11 14.5 16 9.5" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }

  if (variant === 'error') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
        <Line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth="2" />
        <Line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth="2" />
      </Svg>
    );
  }

  if (variant === 'warning') {
    return (
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4.5 20 19.5H4L12 4.5Z" stroke={color} strokeWidth="2" />
        <Line x1="12" y1="9.5" x2="12" y2="13.5" stroke={color} strokeWidth="2" />
        <Circle cx="12" cy="16.5" r="1" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Line x1="12" y1="10" x2="12" y2="15" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="7" r="1" fill={color} />
    </Svg>
  );
}

type AiAlertProps = ViewProps & {
  variant?: AiAlertVariant;
  icon?: React.ReactNode;
    iconClassName?: string;
  };

function AiAlert({ className, variant, children, icon, iconClassName, ...props }: AiAlertProps) {
  const resolvedVariant: AiAlertVariant = variant ?? 'info';

  return (
    <TextClassContext.Provider value={cn('text-sm text-foreground', variantTextClass[resolvedVariant])}>
      <View
        role="alert"
        className={cn(
          'relative w-full rounded-lg border px-4 pb-2 pt-3.5',
          variantContainerClass[resolvedVariant],
          className
        )}
        {...props}
      >
        <View className={cn('absolute left-3.5 top-3 size-5 items-center justify-center', iconClassName)}>
          {icon ?? <VariantIcon variant={resolvedVariant} />}
        </View>
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AiAlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      className={cn('mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function AiAlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        'text-muted-foreground ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed',
        textClass?.includes('text-red-300') && 'text-red-300/90',
        className
      )}
      {...props}
    />
  );
}

export { AiAlert, AiAlertDescription, AiAlertTitle };
