import { RxTrackPrevious } from "react-icons/rx"

const PreviousButton = ({onPrevClick}:{onPrevClick:()=>void})=>{
    return(
        <button onClick={onPrevClick}  className="text-white hover:text-gray-400">
        <RxTrackPrevious size={22} />
      </button>
    )
}

export default PreviousButton;