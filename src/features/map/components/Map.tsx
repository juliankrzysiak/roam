"use client";

import {
  APIProvider,
  Map as GoogleMap,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function Map() {
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const position = { lat: 34.118, lng: -118.1 };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap center={position} zoom={11}></GoogleMap>
    </APIProvider>
  );
}
