import { useEffect, useState } from 'react';

export const useIsSticky = (ref: React.RefObject<HTMLElement | null>, offset = 0) => {
  const [isSticky, setSticky] = useState(false);

  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().top <= offset);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isSticky;
};
