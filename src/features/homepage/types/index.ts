export interface HomepageSection {
  id: string;
  sectionKey: string;
  titleRu: string | null;
  titleTj: string | null;
  titleEn: string | null;
  subtitleRu: string | null;
  subtitleTj: string | null;
  subtitleEn: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isActive: boolean;
  updatedAt: string;
}
