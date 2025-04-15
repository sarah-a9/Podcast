import { RxTrackPrevious } from "react-icons/rx"

const PreviousButton = ({onPrevClick, disabled = false}:{onPrevClick:()=>void, disabled?:boolean})=>{
    return(
        <button onClick={onPrevClick} disabled={disabled} className="text-white cursor-pointer  hover:text-gray-400">
        <RxTrackPrevious size={22} />
      </button>
    )
}

export default PreviousButton;