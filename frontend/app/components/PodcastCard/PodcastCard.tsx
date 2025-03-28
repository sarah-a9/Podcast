// // 

// import React from 'react';

// interface PodcastProps {
//   podcastName: string;
//   podcastDescription: string;
//   podcastImage: string;
// }

// const PodcastCard: React.FC<PodcastProps> = ({ podcastName, podcastDescription, podcastImage }) => {
//   return (
//     <div className="podcast-card">
//       <img src={podcastImage} alt={podcastName} />
//       <h3>{podcastName}</h3>
//       <p>{podcastDescription}</p>
//     </div>
//   );
// };

// export default PodcastCard;


import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';


interface PodcastProps {
  id: string;
  podcastName: string;
  podcastImage: string;
  podcastDescription: string;
  creator: {
    firstName: string;
    lastName: string;
  }
}

const PodcastCard: React.FC<PodcastProps> = ({ podcastName, creator, podcastImage, id, podcastDescription }: PodcastProps) => {
  const router = useRouter();
  const handleViews = () =>{
    //increase views
    console.log('Received podcast ID:', id);

    router.push(`/PodcastDetail/${id}`)
  }
  
  return (
    
    <div className="w-1/7 flex-flex-col flex-shrink-0 shadow-sm cursor-pointer "onClick={handleViews}>
      <div className='flex flex-col'>
        <img className=" rounded-t-lg  rounded-lg w-full h-40 object-cove bg-gray-300"  src={podcastImage} alt={podcastName} />
        <p className='truncate text-l'>
          {podcastName}
        </p>
        <div >
          <p className="w-38 truncate mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{podcastDescription}</p>
        </div>  
      </div>
    </div>

  );
};

export default PodcastCard;
