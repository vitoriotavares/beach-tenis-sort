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
  imageUrl?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PlayerAvatar({ name, imageUrl, size = 'md', className = '' }: PlayerAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  if (imageUrl) {
    return (
      <div 
        className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}
        style={{ backgroundColor: '#f3f4f6' }}
      >
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback para iniciais se a imagem falhar
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.setAttribute('data-show-initials', 'true');
          }}
        />
        <div 
          className={`absolute inset-0 flex items-center justify-center text-white font-medium ${imageUrl ? 'opacity-0' : ''}`}
          style={{ 
            backgroundColor: bgColor,
            opacity: imageUrl ? 0 : 1
          }}
          data-show-initials={!imageUrl}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <span className="text-white font-medium">{initials}</span>
    </div>
  );
}
