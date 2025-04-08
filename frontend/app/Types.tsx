export interface User{
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
    id :string ;
    categoryName: string;
  }


  export interface Playlist{
    _id:string;
    playlistName:string;
    playlistDescription:string;
    playlistImage:string;
    creator:User;
  }