import { Helmet } from "react-helmet-async";
import DeviceClock from "@/components/device/DeviceClock";

const Index = () => (
  <>
    <Helmet>
      <title>Chess Timer</title>
      <meta
        name="description"
        content="Mobile-first chess clock for over-the-board play. Tap to switch, increment supported, works offline."
      />
      <meta name="theme-color" content="#020306" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
      />
    </Helmet>
    <DeviceClock />
  </>
);

export default Index;
