import { MdMoreHoriz } from "react-icons/md";
import { useState } from "react";

const MenuButton = ({ showMenu, setShowMenu, buttonSize, iconSize }: { showMenu: boolean, setShowMenu:  (e: React.MouseEvent) => void, buttonSize: string, iconSize: number}) => {


  return (
    <button className={`text-gray-400 hover:text-white relative ${buttonSize}`} onClick={setShowMenu}>
      <MdMoreHoriz size={iconSize}  />
    </button>
  );
};

export default MenuButton;
