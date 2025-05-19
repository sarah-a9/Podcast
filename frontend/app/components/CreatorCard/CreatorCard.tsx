// "use client";
import { User } from '@/app/Types';
import { useRouter } from 'next/navigation';




const CreatorCard = ({_id, firstName, profilePic }: User) => {
   const router = useRouter();

  const handleClick = () => {
    router.push(`../CreatorProfile/${_id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-30 h-30 rounded-full overflow-hidden mb-2 cursor-pointer" onClick={handleClick}>
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
