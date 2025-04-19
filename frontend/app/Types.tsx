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
    playlists:string[];
}

export interface Episode {
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    createdAt: string;
    likedByUsers: string[];
    podcast:Podcast;
    
  }
  

  export interface Podcast {
    _id: string;
    podcastName: string;
    podcastImage: string;
    podcastDescription: string;
    creator: {
      firstName: string;
      lastName: string;
    };
    episodes:Episode[];
    favoritedByUsers:string[];
  }


  export interface Category{
    id :string ;
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

  