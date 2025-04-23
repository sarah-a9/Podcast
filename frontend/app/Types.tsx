export interface User{
    _id:string;
    firstName:string;
    lastName:string ;
    bio:string;
    email:string;
    password:string;
    profilePic:string;
    favoritePodcasts:string[];
    likedEpisodes:string[];
}

export interface Episode {
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    createdAt: string;
    likedByUsers: string[];
    status: string;
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
  }


  export interface Category{
    _id :string ;
    categoryName: string;
  }


  export interface Playlist{
    _id:string;
    playlistName:string;
    playlistDescription:string;
    playlistImage:string;
    creator:User;
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
      firstName: string;
      lastName: string;
      bio?: string;
      profilePic?: string;
    };
    onClose: () => void;
    onSave: (data: {
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
    firstName: string;
    lastName: string;
    bio: string;
    profilePic: string;
    onEdit: () => void;
    onDelete: () => void;
  }

  export interface CreatePodcastPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onPodcastCreated?: (podcast: any) => void;
  }

