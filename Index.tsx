import React, { useState } from "react";
import WelcomeScreen from "@/components/screens/WelcomeScreen";
import QuestionScreen from "@/components/screens/QuestionScreen";
import ConfirmationScreen from "@/components/screens/ConfirmationScreen";
import FallbackScreen from "@/components/screens/FallbackScreen";
import CelebrationScreen from "@/components/screens/CelebrationScreen";

type Screen = "welcome" | "question" | "confirmation" | "fallback" | "celebration";

const Index: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [chaosMode, setChaosMode] = useState(false);

  const handleChaosMode = () => {
    setChaosMode(true);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen onContinue={() => setCurrentScreen("question")} />;
      case "question":
        return (
          <QuestionScreen
            onYes={() => setCurrentScreen("confirmation")}
            onChaosMode={handleChaosMode}
            onFallback={() => setCurrentScreen("fallback")}
          />
        );
      case "confirmation":
        return <ConfirmationScreen onComplete={() => setCurrentScreen("celebration")} />;
      case "fallback":
        return <FallbackScreen onContinue={() => setCurrentScreen("celebration")} />;
      case "celebration":
        return <CelebrationScreen />;
      default:
        return <WelcomeScreen onContinue={() => setCurrentScreen("question")} />;
    }
  };

  return <>{renderScreen()}</>;
};

export default Index;
