export interface User{
    _id: any;
    id:string;
    firstName:string;
    lastName:string ;
    bio:string;
    email:string;
    password:string;
    profilePic:string;
}

export interface Episode {
    _id: string;
    episodeTitle: string;
    episodeDescription: string;
    audioUrl: string;
    createdAt: string;
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

