export type PlaceDetails = {
  id: string;
  displayName: { languageCode: string; text: string };
  primaryTypeDisplayName?: { languageCode: string; text: string };
  shortFormattedAddress: string;
  regularOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri: string;
};
