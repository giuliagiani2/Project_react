import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import CodePeople from "@mui/icons-material/People";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LanguageIcon from '@mui/icons-material/Language';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import InfoIcon from '@mui/icons-material/Info';

export const logo = "/logo-aivippro-bianco-web.png";
export const user = "/icon_userr.png";
export const userWhite = "/icons_userr_white.png";

export const categories = [
  { name: "Tutti i corsi", icon: <HomeIcon /> },
  { name: "Corsi in evidenza", icon: <OndemandVideoIcon /> },
  { name: "Per relatore", icon: <RecordVoiceOverIcon /> },
  { name: "Digital Marketing", icon: <LanguageIcon /> },
  { name: "SEO", icon: <ShowChartIcon /> },
  { name: "Social Media", icon: <CodePeople /> },
  { name: "Sviluppo Web", icon: <CodeIcon /> },
  { name: "FAQ", icon: <InfoIcon /> }
];

export const serverUrl = "http://localhost:3001";
export const finishquiz = false;

export const videoPaths = {
  corso1: "/video-stream/corso1/",
  corso2: "/video-stream/corso2/",
  corso3: "/video-stream/corso3/",
  corso4: "/video-stream/corso4/",
  corso5: "/video-stream/corso5/",
  corso6: "/video-stream/corso6/",
};
