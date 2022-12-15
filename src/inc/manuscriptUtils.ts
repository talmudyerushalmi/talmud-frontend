import { iManuscript, iManuscriptPopup } from '../types/types';

export const getImageUrl = (manuscripts: iManuscript[], sublineData: iManuscriptPopup): string => {
  return (
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.fromLine < sublineData?.line &&
        manuscript?.toLine > sublineData?.line
    )?.imageurl ||
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.toLine === sublineData?.line &&
        manuscript?.toSubline >= sublineData?.subline?.index
    )?.imageurl ||
    manuscripts?.find(
      (manuscript) =>
        manuscript?.slug === sublineData?.synopsisCode &&
        manuscript?.fromLine === sublineData?.line &&
        manuscript?.fromSubline <= sublineData?.subline?.index
    )?.imageurl ||
    ''
  );
};
