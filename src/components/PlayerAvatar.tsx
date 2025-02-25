'use client'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 45%)`;
}

interface PlayerAvatarProps {
  name: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PlayerAvatar({ name, size = 'md', className = '' }: PlayerAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: stringToColor(name) }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
