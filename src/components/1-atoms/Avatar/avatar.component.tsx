// src/components/1-atoms/Avatar/avatar.component.tsx
// src/components/1-atoms/Avatar/avatar.component.tsx
import React from 'react';
import './avatar.component.scss';

// This is the interface we are fixing.
interface AvatarProps {
  initials: string;
  // ✅ THE FIX IS HERE: We are adding the 'hasVoted' prop.
  hasVoted?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  initials,
  // ✅ AND HERE: We give it a default value of false.
  hasVoted = false,
}) => {
  // Add a class to the wrapper if the player has voted
  const wrapperClasses = `avatar-wrapper ${hasVoted ? 'has-voted' : ''}`;

  return (
    <div className={wrapperClasses}>
      <div className="avatar">
        {initials}
      </div>
   
    </div>
  );
};

export default Avatar;

