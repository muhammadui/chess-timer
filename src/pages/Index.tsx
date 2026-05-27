import { Helmet } from "react-helmet-async";
import ChessTimer from "@/components/ChessTimer";

const Index = () => (
  <>
    <Helmet>
      <title>Chess Timer</title>
      <meta
        name="description"
        content="Mobile-first chess clock for over-the-board play. Tap to switch, increment supported, works offline."
      />
      <meta name="theme-color" content="#020617" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
      />
    </Helmet>
    <ChessTimer />
  </>
);

export default Index;
