export interface User{
    _id:string;
    role:number;
    firstName:string;
    lastName:string ;
    bio:string;
    email:string;
    password:string;
    profilePic:string;
    favoritePodcasts:string[];
    likedEpisodes:string[];
    playlists:string[];
    podcasts?: {
      episodes?: any[];
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Episode {
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    createdAt: string;
    likedByUsers: string[];
    podcast:Podcast;
    status: string;
    averageRating: number;
    listens: number;
    scheduledAt: string | null; // ISO date string or null if not scheduled
  }
  

  export interface Podcast {
    _id: string;
    podcastName: string;
    podcastImage: string;
    podcastDescription: string;
    creator: {
      _id: string | undefined;
      firstName: string;
      lastName: string;
    };
    episodes:Episode[];
    favoritedByUsers:string[];
    createdAt: string;
    categories: string[];
  }


  export interface Category{
    _id :string ;
    categoryName: string;
  }


  export interface Playlist{
    _id:string;
    playlistName:string;
    playlistDescription:string;
    playlistImg?:string;
    creator: {
      firstName: string;
      lastName: string;
    };
    episodes: Episode[];
  }

  export interface LikeButtonProps {
    episodeId: string;
    isLiked: boolean;
    onLikeClick: (e: React.MouseEvent) => void;
    buttonSize: string;
    iconSize: number;
  }

  export interface FavoriteButtonProps {
    podcastId: string;
    isFavorite: boolean;
    onFavoriteClick: (e: React.MouseEvent) => void;
    buttonSize: string;
    iconSize:number;
  }

  export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
  }

  export interface EditProfilePopupProps {
    user: {
      //_id: string;//yasmine added this
      firstName: string;
      lastName: string;
      bio?: string;
      profilePic?: string;
    };
    onClose: () => void;
    onSave: (data: {
     // _id: string; //yasmine added this
      firstName: string;
      lastName: string;
      bio: string;
      profilePic: string;
    }) => void;
  }
  

  export interface DeleteProfilePopupProps {
    onCancel: () => void;
    onConfirm: () => void;
  }

  export interface ProfileHeaderProps {
    // id:string; //yasmine added this
    firstName: string;
    lastName: string;
    bio: string;
    profilePic: string;
    onEdit: () => void;
    onDelete: () => void;
    onChangePassword: () => void;
    followers?: number;
    following?: number;
  }

  export interface CreatePodcastPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onPodcastCreated?: (podcast: any) => void;
    isAdmin: boolean;
    creatorOptions?: User[]; // Optional prop for creator options for the admin to select
  }

 export interface SeeMoreButtonProps {
    label: string;
    onClick: () => void;
  }


  export type SearchResult = Podcast | Episode | User | Category;

  export interface StarRatingProps {
    value: number; // Current rating value (user's rating or average)
    onRate: (value: number) => void; // Function to send rating to backend
    maxStars: number; // Max stars (usually 5)
    isEditable: boolean; // Whether the user can change their rating
    episodeId: string; // The episode ID to send to the backend
  }

  export interface FollowUnfollowButtonProps {
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  TargetUserId: string;
}