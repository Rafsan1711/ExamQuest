interface UserAvatarProps {
  photoURL?: string;
  displayName: string;
  rank?: number;
}

export const UserAvatar = ({ photoURL, displayName, rank }: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBorderColor = () => {
    if (rank === 1) return 'border-yellow-400';
    if (rank === 2) return 'border-gray-300';
    if (rank === 3) return 'border-amber-600';
    return 'border-white/10';
  };

  const borderClass = rank && rank <= 3 ? `border-2 ${getBorderColor()}` : 'border border-white/10';

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={displayName}
        className={`w-10 h-10 rounded-full object-cover ${borderClass}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback avatar
  return (
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm ${borderClass}`}>
      {getInitials(displayName || 'User')}
    </div>
  );
};
