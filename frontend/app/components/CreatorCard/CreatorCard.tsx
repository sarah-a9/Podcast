import React, { useEffect } from 'react';

interface UserProps{
    id:string;
    firstName:string;
    lastName:string ;
    profilePic:string;
}



const CreatorCard = ({ firstName, profilePic , id }: UserProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-30 h-30 rounded-full overflow-hidden mb-2">
        <img
          src={profilePic}
          alt={firstName}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-center text-xl">{firstName}</p>
    </div>
  );
};

export default CreatorCard;
