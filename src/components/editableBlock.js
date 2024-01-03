import React, { useState, useEffect, useRef } from "react";
import ContentEditable from "react-contenteditable";
import "./styles.css";
import SelectMenu from "../selectMenu";
import { getCaretCoordinates, setCaretToEnd } from "../utils/caretHelpers";

const CMD_KEY = "/";

const EditableBlock = (props) => {
  const contentEditable = useRef(null);
  const [htmlBackup, setHtmlBackup] = useState(null);
  const [html, setHtml] = useState("");
  const [tag, setTag] = useState("p");
  const [previousKey, setPreviousKey] = useState("");
  const [selectMenuIsOpen, setSelectMenuIsOpen] = useState(false);
  const [selectMenuPosition, setSelectMenuPosition] = useState({ x: null, y: null });

  useEffect(() => {
    setHtml(props.html);
    setTag(props.tag);
  }, [props.html, props.tag]);

  useEffect(() => {
    if (html !== props.html || tag !== props.tag) {
      props.updatePage({
        id: props.id,
        html: html,
        tag: tag
      });
    }
  }, [html, tag, props]);

  const onChangeHandler = (e) => {
    setHtml(e.target.value);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === CMD_KEY) {
      setHtmlBackup(html);
    }
    if (e.key === "Enter" && previousKey !== "Shift" && !selectMenuIsOpen) {
      e.preventDefault();
      props.addBlock({
        id: props.id,
        ref: contentEditable.current
      });
    }
    if (e.key === "Backspace" && !html) {
      e.preventDefault();
      props.deleteBlock({
        id: props.id,
        ref: contentEditable.current
      });
    }
    setPreviousKey(e.key);
  };

  const onKeyUpHandler = (e) => {
    if (e.key === CMD_KEY) {
      openSelectMenuHandler();
    }
  };

  const openSelectMenuHandler = () => {
    const { x, y } = getCaretCoordinates();
    setSelectMenuPosition({ x, y });
    setSelectMenuIsOpen(true);
    document.addEventListener("click", closeSelectMenuHandler);
  };

  const closeSelectMenuHandler = () => {
    setHtmlBackup(null);
    setSelectMenuIsOpen(false);
    setSelectMenuPosition({ x: null, y: null });
    document.removeEventListener("click", closeSelectMenuHandler);
  };

  const tagSelectionHandler = (selectedTag) => {
    setTag(selectedTag);
    setHtml(htmlBackup);
    setCaretToEnd(contentEditable.current);
    closeSelectMenuHandler();
  };

  return (
    <>
      {selectMenuIsOpen && (
        <SelectMenu
          position={selectMenuPosition}
          onSelect={tagSelectionHandler}
          close={closeSelectMenuHandler}
        />
      )}
      <ContentEditable
        className="Block"
        innerRef={contentEditable}
        html={html}
        tagName={tag}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        onKeyUp={onKeyUpHandler}
      />
    </>
  );
};

export default EditableBlock;
