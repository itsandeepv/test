import React, { useState } from "react";
import './buttonStyles.css'
import uploadImg from '../assets/images/uploadImg.svg'
import plus from '../assets/images/plus.svg'

interface BlueCommonButtonProps {
  title: string;
  subTitle?: string;
  buttonClick?: any;
}

interface WhiteCommonButtonProps {
  title: string;
  subTitle: any;
  buttonClick: Function
}
interface CancelCommonButtonProps {
  title: string;
  buttonClick: any;
}

interface UploadeCommonButtonProps {
  title: string;
  fileData: any
}
interface FunctionalCommonButtonProps {
  title: string;
  isActive: boolean
  onclick: Function
}
interface AddCommonButtonProps {
  onclick: any
}
interface CustomAddButtonProps {
  onclick: any;
  title: string;
  icon: any
}

export const BlueCommonButton: React.FC<BlueCommonButtonProps> = ({ title, subTitle, buttonClick }) => {
  const eventHandler = () => {
    buttonClick()
  }
  return (
    <div className="d-flex curser">
      <div onClick={() => eventHandler()} className="blueButtonStyle white">
        <span className="ml-10px mr-10px d-flex">{title}&nbsp;{subTitle}</span>
      </div>
    </div>
  );
};
export const RedCommonButton: React.FC<BlueCommonButtonProps> = ({ title, subTitle, buttonClick }) => {
  const eventHandler = () => {
    buttonClick()
  }
  return (
    <div className="d-flex curser">
      <div onClick={() => eventHandler()} className="redButtonStyle darkred white">
        <span className="ml-15px mr-15px">{title}&nbsp;{subTitle}</span>
      </div>
    </div>
  );
};

export const WhiteCommonButton: React.FC<WhiteCommonButtonProps> = ({ title, subTitle, buttonClick }) => {
  const eventHandler = () => {
    buttonClick()
  }
  return (
    <div className="d-flex curser">
      <div onClick={() => eventHandler()} className="whiteButtonStyle commonBlackcolor">
        <span className="ml-5px mr-5px">{title}&nbsp;{subTitle}</span>
      </div>
    </div>
  );
};

export const UploadCommonButton: React.FC<UploadeCommonButtonProps> = ({ title, fileData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event: any) => {
    // Access the selected file from the event
    const file = event.target.files[0];

    // Update the state with the selected file
    setSelectedFile(file);
    fileData(file)
  };
  return (
    <div className="d-flex curser">
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        onChange={handleFileChange}
      />
      <label htmlFor="contained-button-file">
        <div className="blueButtonStyle white d-flex alignItem-center">
          <img src={uploadImg} className="ml-5px mr-5px" />
          <span className="light0_813Rem white ml-5px mr-5px">{title}</span>
        </div>
      </label>
    </div>
  );
};
export const CancelCommonButton: React.FC<CancelCommonButtonProps> = ({ title, buttonClick }) => {
  const eventHandler = () => {
    buttonClick()
  }
  return (
    <div className="d-flex curser">
      <div onClick={() => eventHandler()} className="cancelButtonStyle commonBlackcolor">
        <span className="ml-15px mr-15px">{title}</span>
      </div>
    </div>
  );
};

export const FunctionalCommonButton: React.FC<FunctionalCommonButtonProps> = ({ title, isActive, onclick }) => {
  return (
    <div className="d-flex m-10px curser">
      <div onClick={() => onclick()}
        className="functionalButtonStyle" style={{ backgroundColor: isActive ? '#027DC2' : "#EFEFEF" }}>
        <span
          style={{ color: isActive ? '#ffff' : "#202020" }}
          className="pl-20px pr-20px">{title}{isActive}</span>
        <span>{isActive}</span>
      </div>
    </div>
  );
};

export const AddButton: React.FC<AddCommonButtonProps> = ({ onclick }) => {
  const onEvent = () => {
    onclick()
  }
  return (
    <div onClick={onEvent} className="blueButtonStyle white d-flex align-center p-10px">
      <img src={plus} className=" mr-10px" />
      <span>Add New Expense</span>
    </div>
  )
}

export const CustomAddButton: React.FC<CustomAddButtonProps> = ({ onclick, title, icon }) => {

  return (
    <div onClick={() => onclick()} className="blueButtonStyle white d-flex align-center justfyContent-center curser addButton">
      {icon}
      <span className="pl-5px pr-5px">{title}</span>
    </div>
  )
}

export const Nothing = () => {
  return (
    <div className="blueButtonStyle white d-flex align-center justfyContent-center curser addButton">
      <span className="pl-5px pr-5px"></span>
    </div>
  )
}



