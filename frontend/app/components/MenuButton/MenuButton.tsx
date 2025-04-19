import { MdMoreHoriz } from "react-icons/md";

interface MenuButtonProps {
  onClick: (e: React.MouseEvent) => void;
  buttonSize: string;
  iconSize: number;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick, buttonSize, iconSize }) => {
  return (
    <button
      className={`text-gray-400 hover:text-white  ${buttonSize}`}
      onClick={onClick}
    >
      <MdMoreHoriz size={iconSize} />
    </button>

    
  );
};

export default MenuButton;
