import React, { useEffect, useRef, useState } from 'react';
import './spotify.css';

interface Props {
  text: string;
}

const checkOverflow = (textContainer: HTMLSpanElement | null): boolean => {
  if (textContainer) {
    return textContainer.offsetWidth < textContainer.scrollWidth;
  }
  return false;
};

const Marquee = ({ text }: Props) => {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [overflowActive, setOverflowActive] = useState(false);

  useEffect(() => {
    if (titleRef && titleRef.current) {
      const hasOverflow = checkOverflow(titleRef.current);
      setOverflowActive(hasOverflow);
    }
  }, [text]);

  return (
    <>
      <span ref={titleRef} className="marquee">
        <span className={`${overflowActive ? 'move' : ''}`}>{text}</span>
      </span>
      {overflowActive && (
        <span className="marquee marquee2">
          <span className="move">{text}</span>
        </span>
      )}
    </>
  );
};

export default Marquee;
